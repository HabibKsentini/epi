(function() {
	'use strict';

	angular.module('epiApp').factory('Exercise', Exercise);

	function Exercise($q, $http, Topic, Discipline, Level, Group, Teacher,
			$filter) {
		var service = {
			getEmpty : getEmpty,
			goToWaitingForValidation:goToWaitingForValidation,
			getMarkedForRead : getMarkedForRead, 
			validate: validate, 
			get : get,
			query : query, 
			remove: remove, 
			update : update,
			getFiles : getFiles,
			getExercise : getExercise,
			_getDataFromAllArray , _getDataFromAllArray,
			getInPrepartionAndWaitingForValidation : getInPrepartionAndWaitingForValidation, 
			setMarkForRead : setMarkForRead
		};
		return service;

		function get(id) {
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : '/exercises/' + id
			}).success(function(data, status, headers, config) {
				deferred.resolve(data)
			}).error(function(data, status, headers, config) {
				deferred.reject(status);
			});
			return deferred.promise;
		}
		
		function setMarkForRead(id) {
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : '/exercises/setAsMarkedForRead/',
				params : {"id" : id}
			}).success(function(data, status, headers, config) {
				deferred.resolve(data)
			}).error(function(data, status, headers, config) {
				deferred.reject(status);
			});
			return deferred.promise;
		}
		
		
		function getMarkedForRead(){
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : '/exercises/' + 'markedForRead'
			}).success(function(data, status, headers, config) {
				deferred.resolve(data)
			}).error(function(data, status, headers, config) {
				deferred.reject(status);
			});
			return deferred.promise;
		}

		function getExercise(id) {
			var deferred = $q.defer();
			get(id).then(function(exercise) {
				exercise = fillExerciseFormData(exercise);
				deferred.resolve(exercise);
			});
			return deferred.promise;
		}
		
		function remove(id) {
			var deferred = $q.defer();
			$http({
				method : 'DELETE',
				url : '/exercises/' + id
			}).success(function(data, status, headers, config) {
				deferred.resolve(data)
			}).error(function(data, status, headers, config) {
				deferred.reject(status);
			});
			return deferred.promise;
		}

		function getFiles(id) {
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : '/exercises/files/',
				params : {
					"teachingExerciseId" : id
				}
			}).success(function(data, status, headers, config) {
				deferred.resolve(data)
			}).error(function(data, status, headers, config) {
				deferred.reject(status);
			});
			return deferred.promise;
		}

		function _createNew() {
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : '/exercises/createNew'
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(status);
			});
			return deferred.promise;
		}

		function getInPrepartionAndWaitingForValidation(requestParams) {
			var deferred = $q.defer();
			$http({
				method : 'GET',
				params : requestParams,
				url : '/exercises/inPrepartionAndWaitingForValidation'
			}).success(function(data, status, headers, config) {
				deferred.resolve(data)
			}).error(function(data, status, headers, config) {
				deferred.reject(status);
			});
			return deferred.promise;
		}

		function update(exercise) {
			var deferred = $q.defer();
			var exerciseData = _preperaExerciseBeforeSave(exercise);
			$http({
				method : 'PUT',
				data : exerciseData,
				url : '/exercises'
			}).success(function(data, status, headers, config) {
				deferred.resolve(data)
			}).error(function(data, status, headers, config) {
				deferred.reject(status);
			});
			return deferred.promise;
		}

		function _preperaExerciseBeforeSave(exercise) {
			var exerciseData = {
				"id" : exercise.id,
				"subject" : exercise.subject,
				"rawContent" : exercise.rawContent,
				"topicId" : exercise.topic != null ? exercise.topic.id : null,
				"teacherIds" : _getArrayOfId(exercise.teachers),
				"studentIds" : _getArrayOfId(exercise.students),
				"groupId" : exercise.group != null ? exercise.group.id : null,
				"disciplineIds" : _getArrayOfId(exercise.disciplines)
			};

			return exerciseData;
		}

		function _getArrayOfId(array) {
			if (array != null) {
				return array.map(_getId);
			}
			return [];
		}

		function _getId(object) {
			if (object != null) {
				return object.id;
			}
		}

		function fillExerciseFormData(exercise) {
			var deferred = $q.defer();
			exercise.allGroups = Group.query();
			exercise.allLevels = Level.query();
			exercise.allTeachers = Teacher.query();
			exercise.allTopics = Topic.query();
			exercise.allDisciplines = Discipline.query();
			exercise.allTeachers.$promise.then(function(teachers) {
			exercise.allTeachers = $filter('baseUsersInfos')(teachers);
			
			
			exercise.teachers= _getDataFromAllArray(exercise.allTeachers, exercise.teachers);
			if(exercise.groups != null && exercise.groups.lentgh > 0){
				exercise.groups = _getDataFromAllArray(exercise.allGroups, exercise.groups); 
			}
			deferred.resolve(exercise);
			});
			
			
			
			return deferred.promise;
		}

		
		function query(data) {
			var deferred = $q.defer();
			$http({
				method : 'GET',
				params : data,
				url : '/exercises/search'
			}).success(function(data, status, headers, config) {
				deferred.resolve(data)
			}).error(function(data, status, headers, config) {
				deferred.reject(status);
			});
			return deferred.promise;
		}
		
		function _getDataFromAllArray(allArray, datas) {
			var res = [];
			if(allArray != null && datas != null){
			var rv = {};
			for (var i = 0; i < allArray.length; ++i){
				if (allArray[i] !== undefined)
					rv[allArray[i]["id"]] = allArray[i];
			}
			
			for (var i = 0; i < datas.length; ++i){
				res.push(rv[datas[i]["id"]]); 
			}
			}
			return res;
		}

		function validate(id){
			var deferred = $q.defer();
			$http({
				method : 'GET',
				params : {"id" : id},
				url : '/exercises/validate'
			}).success(function(data, status, headers, config) {
				deferred.resolve(data)
			}).error(function(data, status, headers, config) {
				deferred.reject(status);
			});
			return deferred.promise;
		}
		
		function goToWaitingForValidation(id){
			var deferred = $q.defer();
			$http({
				method : 'GET',
				params : {"id" : id},
				url : '/exercises/goToWaitingForValidation'
			}).success(function(data, status, headers, config) {
				deferred.resolve(data)
			}).error(function(data, status, headers, config) {
				deferred.reject(status);
			});
			return deferred.promise;
		}
		
		function getEmpty() {
			var deferred = $q.defer();
			var exercise = {};
			_createNew().then(function(_exercise) {
				exercise = _exercise;
				exercise.uploadedFiles = [];
				exercise = fillExerciseFormData(exercise);
				deferred.resolve(exercise);
			});

			return deferred.promise;
		}
	}
})();
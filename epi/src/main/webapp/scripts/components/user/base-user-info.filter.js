<<<<<<< HEAD
'use strict';

/**
 * return {id: user.id , 
 * name: user.firstName  + " " + user.secondName }
 */
angular.module('epiApp')
    .filter('baseUserInfos', function () {
        return function (input, scope) {
        	var baseUser = {}; 
            if (input != null){
	            baseUser.id = input.id; 
	            baseUser.name = input.firstName + " " + input.lastName; 
            }
            return baseUser;
        }
    });

angular.module('epiApp')
.filter('userName', function () {
    return function (input, scope) {
    	var name  = ""; 
        if (input != null){
           name = input.lastName + " " + input.firstName; 
        }
        return name;
    }
});


angular.module('epiApp')
.filter('baseUsersInfos', function ($filter) {
    return function (users, scope) {
    	var baseUsers = {}; 
        if (users != null){
        	var getIdAndName = function(user) {
				return $filter('baseUserInfos')(user);
			}; 
			return users.map(getIdAndName);  
        }
        return baseUsers;
    }
});


angular.module('epiApp') 
.filter('getDate', function ($filter) {
    return function (localZoneDate, scope) {
    	var dateOut = null; 
        if (localZoneDate != null){
        	 dateOut = new Date(localZoneDate.year, localZoneDate.monthValue -1, localZoneDate.dayOfMonth, localZoneDate.hour, localZoneDate.minute, localZoneDate.second)
        }
        return dateOut;
    }
});

angular.module('epiApp')
.filter('userType', function () {
    return function (authorities, scope) {
    	var type = ''; 
        if (authorities != null){
            if (authorities.indexOf('ROLE_ADMIN') != -1){
            	 type = "Admin";
            }if (authorities.indexOf('ROLE_TEACHER') != -1){
        	   type = "Enseignant";
           }if(authorities.indexOf('ROLE_STUDENT') != -1){
        	   type = "Élève";
           }
        }
        return type;
    }
});



=======
'use strict';

/**
 * return {id: user.id , 
 * name: user.firstName  + " " + user.secondName }
 */
angular.module('epiApp')
    .filter('baseUserInfos', function () {
        return function (input, scope) {
        	var baseUser = {}; 
            if (input != null){
	            baseUser.id = input.id; 
	            baseUser.name = input.firstName + " " + input.lastName; 
            }
            return baseUser;
        }
    });

angular.module('epiApp')
.filter('userName', function () {
    return function (input, scope) {
    	var name  = ""; 
        if (input != null){
           name = input.lastName + " " + input.firstName; 
        }
        return name;
    }
});


angular.module('epiApp')
.filter('baseUsersInfos', function ($filter) {
    return function (users, scope) {
    	var baseUsers = {}; 
        if (users != null){
        	var getIdAndName = function(user) {
				return $filter('baseUserInfos')(user);
			}; 
			return users.map(getIdAndName);  
        }
        return baseUsers;
    }
});


angular.module('epiApp') 
.filter('getDate', function ($filter) {
    return function (localZoneDate, scope) {
    	var dateOut = null; 
        if (localZoneDate != null){
        	 dateOut = new Date(localZoneDate.year, localZoneDate.monthValue -1, localZoneDate.dayOfMonth, localZoneDate.hour, localZoneDate.minute, localZoneDate.second)
        }
        return dateOut;
    }
});

angular.module('epiApp')
.filter('userType', function () {
    return function (authorities, scope) {
    	var type = ''; 
        if (authorities != null){
            if (authorities.indexOf('ROLE_ADMIN') != -1){
            	 type = "Admin";
            }if (authorities.indexOf('ROLE_TEACHER') != -1){
        	   type = "Enseignant";
           }if(authorities.indexOf('ROLE_STUDENT') != -1){
        	   type = "Élève";
           }
        }
        return type;
    }
});



>>>>>>> branch 'master' of https://github.com/HabibKsentini/epi.git

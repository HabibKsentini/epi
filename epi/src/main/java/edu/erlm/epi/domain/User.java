package edu.erlm.epi.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Formula;
import org.hibernate.validator.constraints.Email;

import com.fasterxml.jackson.annotation.JsonIgnore;

import edu.erlm.epi.domain.exercise.TeachingExercise;
import edu.erlm.epi.repository.Searchable;

/**
 * A user.
 */
@Entity
@Table(name = "t_user")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class User extends AbstractAuditingEntity implements Serializable, Searchable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotNull
	@Pattern(regexp = "^[a-z0-9]*$|(anonymousUser)")
	@Size(min = 1, max = 50)
	@Column(length = 50, unique = true, nullable = false)
	private String login;

	@JsonIgnore
	@NotNull
	@Size(min = 60, max = 60)
	@Column(name = "password_hash", length = 60)
	private String password;

	@Size(max = 50)
	@Column(name = "first_name", length = 50)
	private String firstName;

	@Size(max = 50)
	@Column(name = "last_name", length = 50)
	private String lastName;

	@Email
	@Size(max = 100)
	@Column(length = 100, unique = true)
	private String email;

	@Column(nullable = false)
	private boolean activated = false;

	@Size(min = 2, max = 5)
	@Column(name = "lang_key", length = 5)
	private String langKey;

	@Size(max = 20)
	@Column(name = "activation_key", length = 20)
	@JsonIgnore
	private String activationKey;

	@Size(max = 20)
	@Column(name = "reset_key", length = 20)
	private String resetKey;

	@Column(name = "reset_date", nullable = true)
	private ZonedDateTime resetDate = null;

	@JsonIgnore
	@ManyToMany
	@JoinTable(name = "t_user_authority", joinColumns = {
			@JoinColumn(name = "user_id", referencedColumnName = "id") }, inverseJoinColumns = {
					@JoinColumn(name = "authority_name", referencedColumnName = "name") })
	@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	private Set<Authority> authorities = new HashSet<>();

	@JsonIgnore
	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "user")
	@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	private Set<PersistentToken> persistentTokens = new HashSet<>();

	@ManyToMany
	@JoinTable(name = "t_marked_to_read_teaching_exercise_user_junc", joinColumns = {
			@JoinColumn(referencedColumnName = "id", name = "user_id") }, inverseJoinColumns = {
					@JoinColumn(referencedColumnName = "id", name = "teaching_exercise_id") })
	private List<TeachingExercise> teachingExercisesMarkedForRead;

	
	@Formula("(select (select count(*) from t_teaching_exercise_student_junc t where t.user_id = id ) + (select count(*) from t_teaching_exercise_teacher_junc t where t.user_id = id)) ")
	private Long countTeachingExercise;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public boolean getActivated() {
		return activated;
	}

	public void setActivated(boolean activated) {
		this.activated = activated;
	}

	public String getActivationKey() {
		return activationKey;
	}

	public void setActivationKey(String activationKey) {
		this.activationKey = activationKey;
	}

	public String getResetKey() {
		return resetKey;
	}

	public void setResetKey(String resetKey) {
		this.resetKey = resetKey;
	}

	public ZonedDateTime getResetDate() {
		return resetDate;
	}

	public void setResetDate(ZonedDateTime resetDate) {
		this.resetDate = resetDate;
	}

	public String getLangKey() {
		return langKey;
	}

	public void setLangKey(String langKey) {
		this.langKey = langKey;
	}

	public Set<Authority> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(Set<Authority> authorities) {
		this.authorities = authorities;
	}

	public Set<PersistentToken> getPersistentTokens() {
		return persistentTokens;
	}

	public void setPersistentTokens(Set<PersistentToken> persistentTokens) {
		this.persistentTokens = persistentTokens;
	}

	public List<TeachingExercise> getTeachingExercisesMarkedForRead() {
		return this.teachingExercisesMarkedForRead;
	}

	public Long getCountTeachingExercise() {
		return countTeachingExercise;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}

		User user = (User) o;

		if (!login.equals(user.login)) {
			return false;
		}

		return true;
	}

	@Override
	public int hashCode() {
		return login.hashCode();
	}

	@Override
	public String toString() {
		return "User{" + "login='" + login + '\'' + ", firstName='" + firstName + '\'' + ", lastName='" + lastName
				+ '\'' + ", email='" + email + '\'' + ", activated='" + activated + '\'' + ", langKey='" + langKey
				+ '\'' + ", activationKey='" + activationKey + '\'' + "}";
	}
	
	@Override
	@Transient
	public Object get(String attributeName) {
		switch (attributeName) {
		case "login":
			return login;
		case "firstName":
			return firstName;
		case "lastName":
			return lastName;
		case "authorities":
			return authorities;
		}
		return null;
	}

	@Override
	public List<String> getAttributes() {
		String[] attributes = { "login", "firstName", "lastName", "authorities" };
		return Arrays.asList(attributes);
	}


}
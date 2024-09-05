package lk.ritzy;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RestController;

import lk.ritzy.employee.EmployeeDao;
import lk.ritzy.user.Role;
import lk.ritzy.user.RoleDao;
import lk.ritzy.user.User;
import lk.ritzy.user.UserDao;

import org.springframework.web.bind.annotation.RequestMapping;


@SpringBootApplication
@RestController
public class RitzyApplication {

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private EmployeeDao employeeDao;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private UserDao userDao;

	public static void main(String[] args) {
		SpringApplication.run(RitzyApplication.class, args);
		System.out.println("Mushfa");
	}

	@RequestMapping(value = "/createadmin")
	public String generateAdmin(){
		
		User adminUser = new User();	//creating User object
		adminUser.setUsername("Admin");
		adminUser.setPassword(bCryptPasswordEncoder.encode("12345"));
		adminUser.setEmail("admin@email.com");
		adminUser.setStatus(true);
		adminUser.setAdded_date(LocalDateTime.now());
		adminUser.setAdded_user(1);

		Set<Role> roles = new HashSet<Role>();
		roles.add(roleDao.getReferenceById(1));
		adminUser.setRoles(roles);

		adminUser.setEmployee_id(employeeDao.getReferenceById(1));

		userDao.save(adminUser);

		

		return "<script> window.location.replace('http://localhost:8888/login'); </script>";
	}
	
}

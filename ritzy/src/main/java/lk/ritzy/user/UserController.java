package lk.ritzy.user;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.ritzy.privlilege.PrivilegeController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping(value = "/user") // class level mapping which will applied to all the mapping in this file
public class UserController {

    @Autowired
    private UserDao dao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private PrivilegeController privilegeController;

    // [/user/findall -->class level mapping is /user,method level mapping is
    // /findall ]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<User> getAllData() {

        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "USER");

        if (!logUserPriv.get("select")) {
            return null;
        }

        return dao.findAll(Sort.by(Direction.DESC, "id"));
    }

    // [ /user ---> class level mapping is /user]
    @GetMapping
    public ModelAndView userUI() {

        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView useView = new ModelAndView();
        useView.addObject("loggedusername", authentication.getName()); // loggedusername this connect in Tobnavbar.html
                                                                       // to display username
        useView.addObject("Heading", "User Management");
        useView.addObject("title", "Ritzy : User Management");
        useView.setViewName("User.html");
        return useView;
    }

    // save user details
    @PostMapping
    public String saveUser(@RequestBody User user) {

        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "USER");

        if (!logUserPriv.get("insert")) {
            return "Insert not Completed : You have no privilege..!";
        }

        // duplicate email, username, employee checking

        // username duplicate check --> query in userDao line 10
        User existingUsername = dao.getUserbyUserName(user.getUsername());
        if (existingUsername != null) {
            return "Given Username " + user.getUsername() + " is already existing..!";
        }

        // email duplicate check --> query in userDao line 14
        User existingEmail = dao.getUserbyEmail(user.getEmail());
        if (existingEmail != null) {
            return "Given Email " + user.getEmail() + " is already existing..!";
        }

        // employee duplicate check --> query in userDao line 16
        User existingEmployee = dao.getUserByEmployee(user.getEmployee_id().getId());
        if (existingEmployee != null) {
            return "Given Employee " + user.getEmployee_id().getEmp_first_name() + " is already existing..!";
        }

        try {
            user.setAdded_user(1); // automatically set it to added_user as mushfa who is id is 1
            user.setAdded_date(LocalDateTime.now()); // set automatically added data and time
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            dao.save(user);
            return "OK";
        } catch (Exception e) {
            // TODO: handle exception
            return "Failed to save user details...!" + e.getMessage();
        }
    }

    // define delete mapping for delete user account ---> user.js line 63
    @DeleteMapping
    public String deleteUser(@RequestBody User user) {

        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "USER");

        if (!logUserPriv.get("delete")) {
            return "Delete not Completed : You have no privilege..!";
        }

        // check given user existing or ont existing
        User existingUser = dao.getReferenceById(user.getId());
        if (existingUser == null) {
            return "Failed to Delete User : User is not existing..! ";
        }

        try {
            user.setStatus(false); // change user status into in-active
            user.setDeleted_date(LocalDateTime.now()); // set automatically deleted data and time
            dao.save(user);
            return "OK";
        } catch (Exception e) {
            // TODO: handle exception
            return "Failed to Delete User" + e.getMessage();
        }
    }

    // putmapping for update user details
    @PutMapping
    public String updateUser(@RequestBody User user) {
        // check logged user Authentiction and autherization
        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "USER");

        if (!logUserPriv.get("update")) {
            return "Update not Completed : You have no privilege..!";
        }

        User existingUserId = dao.getReferenceById(user.getId());
        if (existingUserId == null) {
            return "Update not completed : User is not available";
        }
        // check existing and duplicate
        // username duplicate check --> query in userDao line 10
        User existingUsername = dao.getUserbyUserName(user.getUsername());
        if (existingUsername != null && !user.getId().equals(existingUsername.getId())) {
            return "Given Username " + user.getUsername() + " is already existing..!";
        }

        // email duplicate check --> query in userDao line 14
        User existingEmail = dao.getUserbyEmail(user.getEmail());
        if (existingEmail != null && !user.getId().equals(existingEmail.getId())) {
            return "Given Email " + user.getEmail() + " is already existing..!";
        }

        // employee duplicate check --> query in userDao line 16
        User existingEmployee = dao.getUserByEmployee(user.getEmployee_id().getId());
        if (existingEmployee != null && !user.getId().equals(existingEmployee.getId())) {
            return "Given Employee " + user.getEmployee_id().getEmp_first_name() + " is already existing..!";
        }

        try {

            // this is a modification given to prev btch
            // if (!user.getPassword().equals("")) { //check passwors field is not null,if
            // // there is paswd this condition works
         // if (bCryptPasswordEncoder.matches(user.getPassword(), existingUserId.getPassword())) { //if password   is existing --> use paswrd matcher
            // return "Failed update : Given Password is already exist..! ";
            // }else{
            // //if there is no password, shud encrypt the password
                // user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            // }
            // }else{ //if there is no passwrd exist this condition works
            // user.setPassword(existingUserId.getPassword());
            // }

           user.setPassword(existingUserId.getPassword());
            // set auto generated value

            // operator
            dao.save(user);

            // dependancies

            return "OK";
        } catch (Exception e) {
            return "Update not Completed : " + e.getMessage();
        }
    }
}

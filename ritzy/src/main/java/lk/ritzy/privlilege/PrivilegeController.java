package lk.ritzy.privlilege;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


import java.util.List;

import java.time.LocalDateTime;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


//annotate the class as a RestController, indicating that it handles HTTP requests nd returns responses
@RestController
public class PrivilegeController {

    //Autowire (inject) the PrivilegeDao bean into the controller
    @Autowired // dependancies injection
    private PrivilegeDao dao; // inject PrivilegeDao object into dao variable

    //Mapping to generate the privilege UI
    //Request mapping or get mapping  for generate privilege UI
    @RequestMapping(value = "/privilege")

    //Method to handle requests for displaying the privilege user interface
    public ModelAndView privilegeUI() {

        // get logged user authentication object using security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //create a ModalAndView object to represent the view and modal for the response
        ModelAndView privilegeView = new ModelAndView();
        privilegeView.addObject("loggedusername", authentication.getName()); // loggedusername this connect in Tobnavbar.html to display username
        privilegeView.addObject("title", "Ritzy - Privilege Management"); //set title name
        privilegeView.addObject("Heading", "Privilege Management");//set Heading 
        privilegeView.setViewName("Privilege.html"); //set the view name to "privilege.html"
        return privilegeView; //return the ModalAndView object
    }


    // mapping to find all privilege data
    // create mapping for get all privilege data ------> URL[/privilege/findall]
    @GetMapping(value = "/privilege/findAll", produces = "application/json")
    
    //method to handle requests for retrieving all privilege data in Ascending order by 'id'
    public List<Privilege> getAllData() {

        //call the findAll() method of the 'dao' (presumably a Spring Data JPA repository)
        //Sort the result in Ascending order by the 'id' field
        return dao.findAll(Sort.by(Direction.ASC, "id"));
    }



    // save Privilege details
    //create post mapping for save privilege record
    @PostMapping(value = "/privilege")
    public String saveUser(@RequestBody Privilege privilege) {

        //retrieve the current authenticated user's details from the security context
        //get the privilege of the logged-in user
        Privilege existingPrivilege = dao.getByRoleModule(privilege.getRole_id().getId(),
        

        //check for duplicate privilege
        //retrieve an existing privilege with the same role and module form the database
        privilege.getModule_id().getId());
        //if a privilege with the same role and module already exists, return an error message
        if (existingPrivilege != null) {
            return "Add Privilege not completed : Privilege Already exist with given Role and Module...!";
        }


        try {

            //set auto generated value
            privilege.setAdded_user(1); // automatically set it to added_user as mushfa who is id is 1
            privilege.setAdded_date(LocalDateTime.now()); // set automatically added data and time
            
            //opearation
            dao.save(privilege);
            //if save operation is successful, return "OK"
            return "OK";
        } catch (Exception e) {
            // if an exception occurs during save, return an error message with the exception details
            return "Failed to save Privilege details...!" + e.getMessage();
        }
    }




     //putmapping for update Privilege details
    @PutMapping(value = "/privilege")
    public String updatePrivilege(@RequestBody Privilege privilege) {
        // check logged user Authentiction and autherization
       
        
        // check given Privilege existing or ont existing
        Privilege extPrivilege = dao.getReferenceById(privilege.getId());
        //check if the privilege record exists
        if (extPrivilege == null) {
             //if the privilege record does not exist, return an error message
            return "Failed to Update Privilege : Privilege does not exist..! ";
        }

        try {
            // set auto generated value

            // operator if the privilege record exists, update it in the database
            dao.save(privilege);

            //if the update operation is successful, return "OK"
            return "OK";
        } catch (Exception e) {
            //if an exception occurs during the update, return an error message with the exception details
            return "Update not Completed : " + e.getMessage();
        }
    }


    

    // define delete mapping for delete privilege
    @DeleteMapping(value = "/privilege")
    public String deletePrivilege(@RequestBody Privilege privilege) {

        // check given Privilege existing or ont existing
        Privilege extPrivilege = dao.getReferenceById(privilege.getId());
        if (extPrivilege == null) {
            //if the privilege record does not exist, return an error message
            return "Failed to Delete Privilege : Privilege does not exist..! ";
        }

        try {
            
            //set auto generated value
            //set all privileges to false(essentially deleting the privilege)
            extPrivilege.setSelect_privilege(false);
            extPrivilege.setInsert_privilege(false);
            extPrivilege.setUpdate_privilege(false);
            extPrivilege.setDelete_privilege(false);

            //set auto generated Value
            privilege.setDeleted_date(LocalDateTime.now()); // set automatically deleted data and time
            //save the updated privilege to the database
            dao.save(extPrivilege);
            //if save operation is successful, return "OK"
            return "OK";
        } catch (Exception e) {
            //if an exception occurs during save, return an error message with the exception details
            return "Failed to Delete Privilege" + e.getMessage();
        }
    }



    // create get mapping for get privilege by logged user module ---> check with ths employee js under refreshEMployeeForm
    //handle the request to retrieve a privilege for a specific module, module name provided as a path variable
    @GetMapping(value = "/privilege/byloggedusermudule/{modulename}", produces = "application/json")
    //get logged user authentication object using SecurityContextHolder
    public HashMap<String, Boolean> getPrivilegeByUserModule(@PathVariable("modulename")String modulename){
        ////get logged user authentation object using securitycontextholder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //retrieve and return the privilege for the specified module
        return getPrivilegeByUserModule(authentication.getName(), modulename);
    }
    



    //define function for get privilege by user module
    public HashMap<String, Boolean> getPrivilegeByUserModule(String username, String modulename) {
        HashMap<String, Boolean> userPrivilege = new HashMap<String, Boolean>();
        //check if the authenticated user is "Admin"
        if (username.equals("Admin")) {
            //if the user is "Admin", create a Privilege object with all permissions set to true
            userPrivilege.put("select", true);
            userPrivilege.put("insert", true);
            userPrivilege.put("update", true);
            userPrivilege.put("delete", true);
        }else{
            //for non-admin users, retrieve the privilege string from the database
            String userPriv = dao.getPrivilegeByUserModule(username, modulename);
            System.out.println(userPriv);


            //1,1,1,0
            //split the privilege string into an array using commas
            String[] userPriviList = userPriv.split(",");
            userPrivilege.put("select", userPriviList[0].equals("1"));
            userPrivilege.put("insert", userPriviList[1].equals("1"));
            userPrivilege.put("update", userPriviList[2].equals("1"));
            userPrivilege.put("delete", userPriviList[3].equals("1"));

        }

        //return the privilege object
        return userPrivilege;
    }

}

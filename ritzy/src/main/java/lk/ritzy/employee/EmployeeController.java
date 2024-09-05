package lk.ritzy.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import jakarta.transaction.Transactional;
import lk.ritzy.privlilege.PrivilegeController;
import lk.ritzy.user.User;
import lk.ritzy.user.UserDao;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@RestController
public class EmployeeController {

    @Autowired
    private EmployeeDao dao;

    @Autowired
    private EmployeeStatusDao empStastusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    // public EmployeeController(EmployeeDao dao) {
    // this.dao = dao;
    // }

    @RequestMapping(value = "/employee")
    public ModelAndView employeeUI() {

        //get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView employeView = new ModelAndView();
        employeView.addObject("loggedusername", authentication.getName()); //loggedusername this connect in Tobnavbar.html to display username
        employeView.addObject("title", "Ritzy - Employee Management");
        employeView.addObject("Heading", "Employee Management");
        employeView.setViewName("Employee.html");
        return employeView;
    }

    // create get mapping for get employee list without user account
    @GetMapping(value = "/employee/listwithoutuseraccount", produces = "application/json")
    public List<Employee> getEmployeeListWithoutUserAccount() { // this functions comes from EmployeeController
       
        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "EMPLOYEE");

        if (!logUserPriv.get("select")) {
            return null;
        }

        return dao.getEmployeeListWithoutUserAccount(); // this function comes from EmployeDao line 11
    }

    @GetMapping(value = "/employee/findall", produces = "application/json")
    public List<Employee> findAll() {
        return dao.findAll(Sort.by(Direction.DESC, "id"));
    }

    // define post mapping for save employee record
    @PostMapping(value = "/employee")
    public String saveEmployee(@RequestBody Employee employee) {
        // authentication and authorization

        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "EMPLOYEE");

        if (!logUserPriv.get("insert")) {
            return "Insert not Completed : You have no privilege..!";
        }


        // duplicate checking
        // check duplicate for email
        Employee extEmployeeByEmail = dao.getByEmail(employee.getEmail());
        if (extEmployeeByEmail != null) {
            return "Couldn't complete save : Given " + employee.getEmail() + "already exist...!";
        }

        try {
            // set autogenerated value

            // create next number variable to store next number in DB using calling
            // getNextNumber in Dao
            // employee.setEmpno("00000002"); // manual
            String nextNumber = dao.getNextNumber();
            if (nextNumber.equals(null) || nextNumber.equals("nextNumber")) {
                employee.setEmpno("00000001");
            } else {
                employee.setEmpno(nextNumber);
            }

            // save employee
            employee.setAdded_user(1); // automatically set it to added_user as mushfa who is id is 1
            employee.setAdded_date(LocalDate.now());// set automatically added data and time
            dao.save(employee); // save employee object(insert given employee --> run insert query)
            return "OK";
        } catch (Exception e) {
            // TODO: handle exception
            return "Submitting record failed...!\n" + e.getMessage();
        }
    }

    @Transactional //if there is any problem occured system can rollback and manages transactions
    @DeleteMapping(value = "/employee")
    public String deleteEmployee(@RequestBody Employee employee) {

        //get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(), "EMPLOYEE");

        if (!logUserPriv.get("delete")) {
            return "Delete not Completed : You have no privilege..!";
        }

        // authentication and autherization

        // existing check
        Employee existingEmployee = dao.getReferenceById(employee.getId());
        if (existingEmployee == null) {
            return "Delete not complete : Employee Does not exist..!";
        }

        

        try {
            // operator

            // hard delete --> not recommended
            // dao.delete(employee); // use direct object
            // dao.delete(dao.getReferenceById(employee.getId())); // front end la irundha,
            // atha BE la check panni pathu primary key eduthu dlete pannum


            

            EmployeeStatus deleteStatus = empStastusDao.getReferenceById(3); // 3rd id belongs to 'deleted' sataus
            existingEmployee.setEmployeestatus_id(deleteStatus); // here status changes into deleted
            existingEmployee.setDeleted_date(LocalDate.now());
            dao.save(existingEmployee);

            //need to inactive user account
            User existingUser = userDao.getUserByEmployee(existingEmployee.getId());
            if (existingUser != null) {
                existingUser.setStatus(false);
                userDao.save(existingUser);
            }

            

            return "OK";
        } catch (Exception e) {
            // TODO: handle exception
            return "Delete not completed : " + e.getMessage();
        }
    }

    @PutMapping(value = "/employee")
    public String updateEmployee(@RequestBody Employee employee) {
        // Authentictio and autherization
        // check logged user Authentiction and autherization
        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "EMPLOYEE");

        if (!logUserPriv.get("update")) {
            return "Update not Completed : You have no privilege..!";
        }

        // check existing and duplicate
        // get existing employee object object getReferencebyid funtion---> used
        // employee pK
        Employee existingEmployee = dao.getReferenceById(employee.getId());
        if (existingEmployee == null) {
            return "Update not Completed : Employee is not Exist....!";
        }

        Employee existingEmployeeByEmail = dao.getByEmail(employee.getEmail());
        // get existing employee object by using frontend[employee.getId()] employee
        // object email value, then assign this to extEmployeeByEmail variable
        if (existingEmployeeByEmail != null && existingEmployeeByEmail.getId() != employee.getId()) {
            // return "Update not completed : change Email already exist"
            return "Update not completed : change " + employee.getEmail() + " is already exist";
        }

       

        try {
            // set auto generated value

            // operator
            existingEmployee.setUpdated_date(LocalDate.now());
            dao.save(employee);

            // dependancies

            return "OK";
        } catch (Exception e) {
            return "Update not Complete : " + e.getMessage();
        }
    }


    // get mapping for get employee without having user account
    // [/employee/listbywithoutuseraccount]
    @GetMapping(value = "/employee/listbywithoutuseraccount", produces = "application/json")
    public List<Employee> getListByWithoutUserAccount() {
        return dao.getEmployeeWithoutUserAccount();
    }
}

package lk.ritzy.maintenance;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import jakarta.transaction.Transactional;

import lk.ritzy.privlilege.PrivilegeController;
import lk.ritzy.user.User;
import lk.ritzy.user.UserDao;

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

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
public class MaintenanceController {

    @Autowired
    private MaintenanceDao dao;

    @Autowired
    private MaintenanceStatusDao custStatusdao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @RequestMapping(value = "/maintenance")
    public ModelAndView maintenanceUI() {

        //get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView maintenanceView = new ModelAndView();
        maintenanceView.addObject("loggedusername", authentication.getName()); //loggedusername this connect in Tobnavbar.html to display username
        maintenanceView.addObject("title", "Ritzy - Maintenance Management");
        maintenanceView.addObject("Heading", "Maintenance Management");
        maintenanceView.setViewName("Maintenance.html");
        return maintenanceView;
    }


    // create mapping for get all customer data ------> URL[/Module/findall]
    @GetMapping(value = "/maintenance/findAll", produces = "application/json")
    public List<Maintenance> getAllData() {

        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "CUSTOMER");

        if (!logUserPriv.get("select")) {
            return null;
        }

        return dao.findAll(Sort.by(Direction.ASC, "id"));
    }

    
}

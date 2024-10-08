package lk.ritzy.purchaserequest;

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
import lk.ritzy.dresscatalog.Dress;
import lk.ritzy.dresscatalog.DressAvailability;
import lk.ritzy.privlilege.PrivilegeController;
import lk.ritzy.user.User;
import lk.ritzy.user.UserDao;

import java.util.List;
import java.time.LocalDateTime;
import java.util.HashMap;



@RestController
public class PurchaseRequestController {
    
    @Autowired
    private PurchaseRequestDao dao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PRStatusDao prstatusdao;

    @Autowired
    private PrivilegeController privilegeController;

    @RequestMapping(value = "/dresspuchasereq")
    public ModelAndView dressPReqUI() {

        //get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        
        ModelAndView dressPReqView = new ModelAndView();
        dressPReqView.addObject("loggedusername", authentication.getName()); //loggedusername this connect in Tobnavbar.html to display username
        dressPReqView.addObject("title", "Ritzy - Dress Puchase Request Management");
        dressPReqView.addObject("Heading", "Dress Purchase Request");
        dressPReqView.setViewName("DressPurchaseReq.html");
        return dressPReqView;
    }

    @GetMapping(value = "/dresspuchasereq/findAll", produces = "application/json")
    public List<PurchaseRequest> getAllData(){
        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "DRESS_REQUEST");

        if (!logUserPriv.get("select")) {
            return null;
        }

        return dao.findAll(Sort.by(Direction.DESC, "id"));
        
    }


    // save dresspuchasereq details
    @PostMapping(value = "/dresspuchasereq")
    public String saveDressPR(@RequestBody PurchaseRequest purchaseRequest) {

        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "DRESS_REQUEST");

        if (!logUserPriv.get("insert")) {
            return "Insert not Completed : You have no privilege..!";
        }

                //duplicate check is not necessory here
        try {
            // set autogenerated value


            //set dependancies like inventory


            User loggedUser = userDao.getUserbyUserName(authentication.getName());
            purchaseRequest.setAdded_user(loggedUser.getAdded_user()); 

            
            // purchaseRequest.setAdded_user(1); // automatically set it to added_user as mushfa who is id is 1
            purchaseRequest.setAdded_datetime(LocalDateTime.now()); // set automatically added data and time
            dao.save(purchaseRequest);
            return "OK";
        } catch (Exception e) {
            // TODO: handle exception
            return "Failed to save purchase request details...!" + e.getMessage();
        }
    }


    @PutMapping(value = "/dresspuchasereq")
    public String updateDressPR(@RequestBody PurchaseRequest purchaseRequest) {
       
        // check logged user Authentiction and autherization
        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "DRESS_REQUEST");

        if (!logUserPriv.get("update")) {
            return "Update not Completed : You have no privilege..!";
        }


        // check existing and duplicate
        // get existing employee object object getReferencebyid funtion---> used
        // employee pK
        PurchaseRequest existingDressPR = dao.getReferenceById(purchaseRequest.getId());
        if (existingDressPR == null) {
            return "Update not Completed : Purchase Request is not Exist....!";
        }

       

        try {
            // set auto generated value

            // operator
            existingDressPR.setUpdated_datetime(LocalDateTime.now());
            dao.save(purchaseRequest);

            // dependancies

            return "OK";
        } catch (Exception e) {
            return "Update not Complete : " + e.getMessage();
        }
    }


    @Transactional //if there is any problem occured system can rollback and manages transactions
    @DeleteMapping(value = "/dresspuchasereq")
    public String deleteDressPR(@RequestBody PurchaseRequest purchaseRequest) {
        // authentication and autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "DRESS_REQUEST");

        if (!logUserPriv.get("delete")) {
            return "Delete not Completed : You have no privilege..!";
        }


        // existing check        
        PurchaseRequest existingDressPR = dao.getReferenceById(purchaseRequest.getId());
        if (existingDressPR == null) {
            return "Delete not Completed : Purchase Request does not Exist....!";
        }

        try {
            // operator

            // hard delete --> not recommended
            // dao.delete(employee); // use direct object
            // dao.delete(dao.getReferenceById(employee.getId())); // front end la irundha,
            // atha BE la check panni pathu primary key eduthu delete pannum

            PRStatus prstatus = prstatusdao.getReferenceById(3); // 3rd id belongs to 'deleted' sataus
            existingDressPR.setPurchase_request_status_id(prstatus); // here status changes into deleted
            existingDressPR.setDeleted_datetime(LocalDateTime.now());
            dao.save(existingDressPR);


            return "OK";
        } catch (Exception e) {
            // TODO: handle exception
            return "Delete not completed : " + e.getMessage();
        }
    }

}

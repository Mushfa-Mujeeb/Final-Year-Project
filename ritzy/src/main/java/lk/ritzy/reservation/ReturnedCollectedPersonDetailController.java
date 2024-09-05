package lk.ritzy.reservation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.ritzy.customer.Customer;
import lk.ritzy.privlilege.PrivilegeController;
import lk.ritzy.user.User;
import lk.ritzy.user.UserDao;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDateTime;

import java.util.List;
import java.util.HashMap;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
public class ReturnedCollectedPersonDetailController {

    @Autowired // inject ReturnedCollectedPersonDetailDao object into dao variable
    private ReturnedCollectedPersonDetailDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ReservationDao daoReservation;

    @Autowired
    private ReservationStatusDao daoReservationStatus;
    
    @RequestMapping(value = "/collectedperson")
    public ModelAndView dresscollectedUI() {

        //get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView dresscollectedView = new ModelAndView();
        dresscollectedView.addObject("loggedusername", authentication.getName()); //loggedusername this connect in Tobnavbar.html to display username
        dresscollectedView.addObject("title", "Ritzy - Dress Collected Management");
        dresscollectedView.addObject("Heading", "Dress Collecting Details Managment");
        dresscollectedView.setViewName("DressCollected.html");
        return dresscollectedView;
    }


    @RequestMapping(value = "/returendperson")
    public ModelAndView dressreturnedUI() {

        //get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView dressreturnedView = new ModelAndView();
        dressreturnedView.addObject("loggedusername", authentication.getName()); //loggedusername this connect in Tobnavbar.html to display username
        dressreturnedView.addObject("title", "Ritzy - Dress Returned Management");
        dressreturnedView.addObject("Heading", "Dress Returning Details Managment");
        dressreturnedView.setViewName("DressReturned.html");
        return dressreturnedView;
    }

    // get service mapping for getAll ReturnedCollectedPersonDetailDao data
    @GetMapping(value = "/returendcollectedperson/findall", produces = "application/json")
    public List<ReturnedCollectedPersonDetail> getAllData() {
        return dao.findAll();
    }

    // define post mapping for save collectedperson record
    @PostMapping(value = "/returendcollectedperson")
    public String saveCollectedPersong(@RequestBody ReturnedCollectedPersonDetail dresscollpersonob) {

        // duplicate checking
        // check duplicate for nic

        ReturnedCollectedPersonDetail extCollRetPersonByNic = dao.getByPersonNic(dresscollpersonob.getPerson_nic());
        if (extCollRetPersonByNic != null) {
            return "Couldn't complete save : Given " + dresscollpersonob.getPerson_nic() + "already exist...!";
        }
        try {
            // save dresscollpersonob
            dao.save(dresscollpersonob); // save dresscollpersonob object(insert given dresscollpersonob --> run insert query)
            return "OK";
        } catch (Exception e) {
            // TODO: handle exception
            return "Submitting record failed...!\n" + e.getMessage();
        }
    }

    //reservation put mapping
    @PutMapping(value = "/reservationcolllected")
    public String putResrvationCollected(@RequestBody Reservation dresscollperson) {
        // check logged user Authentiction and autherization
        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // string ---> insert/update/delete/select   |   Boolean ---> true/fale
        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "DRESS_COLLECTED");

        if (!logUserPriv.get("update")) {
            return "Update not Completed : You have no privilege..!";
        }


        // check existing and duplicate
        // get existing employee object object getReferencebyid funtion---> used
        // employee pK
        Reservation existingReservation = daoReservation.getReferenceById(dresscollperson.getId());
        if (existingReservation == null) {
            return "Update not Completed : Reservation is not Exist....!";
        }      

        try {

            
            //set updated user
            User loggedUser = userDao.getUserbyUserName(authentication.getName());
            dresscollperson.setUpdated_user(loggedUser.getUpdated_user());
            // set auto generated value

            // operator
            dresscollperson.setUpdated_datetime(LocalDateTime.now());
            
            //set inner object
            for (ReservationHasDress reshasdress : dresscollperson.getReservationHasDressList()) {
                reshasdress.setReservation_id(dresscollperson);
                if (reshasdress.getRental_status().equals("Dress Collected")) {
                    dresscollperson.setReservation_status_id(daoReservationStatus.getReferenceById(3));
                }

            }
            daoReservation.save(dresscollperson);

            // dependancies

            return "OK";
        } catch (Exception e) {
            return "Update not Complete : " + e.getMessage();
        }
    }


    //reservation put mapping
    @PutMapping(value = "/reseravtionreturned")
    public String putResrvationReturn(@RequestBody Reservation dressreturnperson) {
        // check logged user Authentiction and autherization
        // get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // string ---> insert/update/delete/select   |   Boolean ---> true/fale
        HashMap<String, Boolean> logUserPriv = privilegeController.getPrivilegeByUserModule(authentication.getName(),
                "DRESS_RETURNED");

        if (!logUserPriv.get("update")) {
            return "Update not Completed : You have no privilege..!";
        }


        // check existing and duplicate
        // get existing employee object object getReferencebyid funtion---> used
        // employee pK
        Reservation existingReservation = daoReservation.getReferenceById(dressreturnperson.getId());
        if (existingReservation == null) {
            return "Update not Completed : Reservation is not Exist....!";
        }      

        try {

            
            //set updated user
            User loggedUser = userDao.getUserbyUserName(authentication.getName());
            dressreturnperson.setUpdated_user(loggedUser.getUpdated_user());
            // set auto generated value

            // operator
            dressreturnperson.setUpdated_datetime(LocalDateTime.now());
            
            //set inner object
            // dependancies
            int returnCount = 0;
            for (ReservationHasDress reshasdress : dressreturnperson.getReservationHasDressList()) {
                reshasdress.setReservation_id(dressreturnperson);
                if (reshasdress.getRental_status().equals("Dress Returned")) {
                  returnCount= returnCount + 1;
                }
                

            }
            if (returnCount == dressreturnperson.getReservationHasDressList().size()) {
                dressreturnperson.setReservation_status_id(daoReservationStatus.getReferenceById(4));
            }
            daoReservation.save(dressreturnperson);

            

            return "OK";
        } catch (Exception e) {
            return "Update not Complete : " + e.getMessage();
        }
    }

    
}

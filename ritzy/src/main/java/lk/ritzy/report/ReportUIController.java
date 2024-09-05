package lk.ritzy.report;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ReportUIController {

    @RequestMapping(value = "/dresspurchreqpendingreport")
    public ModelAndView purchreqpendingUI() {

        //get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView purchreqpendingView = new ModelAndView();
        purchreqpendingView.addObject("loggedusername", authentication.getName()); //loggedusername this connect in Tobnavbar.html to display username
        purchreqpendingView.addObject("title", "Ritzy - Report Management");
        purchreqpendingView.addObject("Heading", "Report Management");
        purchreqpendingView.setViewName("Reportpendingpurchaserequst.html");
        return purchreqpendingView;
    }

    @RequestMapping(value = "/dressreport")
    public ModelAndView dressreportUI() {

        //get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView dressreportView = new ModelAndView();
        dressreportView.addObject("loggedusername", authentication.getName()); //loggedusername this connect in Tobnavbar.html to display username
        dressreportView.addObject("title", "Ritzy - Dress Catalog Report");
        dressreportView.addObject("Heading", "Report Management");
        dressreportView.setViewName("ReportDressCatalog.html");
        return dressreportView;
    }

    @RequestMapping(value = "/dressckeckwithwddngdatereport")
    public ModelAndView ckeckwithwddngdateUI() {

        //get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView ckeckwithwddngdateView = new ModelAndView();
        ckeckwithwddngdateView.addObject("loggedusername", authentication.getName()); //loggedusername this connect in Tobnavbar.html to display username
        ckeckwithwddngdateView.addObject("title", "Ritzy - Dress Availability Report");
        ckeckwithwddngdateView.addObject("Heading", "Report Management");
        ckeckwithwddngdateView.setViewName("ReportCheckDressAvailWIthWddngDate.html");
        return ckeckwithwddngdateView;
    }
}

package lk.ritzy.login;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;



@RestController
public class LoginController {

    @RequestMapping(value = "/login")
    public ModelAndView loginUI() {
        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("Login.html");
        loginView.addObject("title", "Ritzy : Log In");
        loginView.addObject("Heading", "Log In");
        return loginView;
    }  

    @RequestMapping(value = "/dashboard")
    public ModelAndView dashboardUI(){

        //get logged user authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView dashboardVeiw = new ModelAndView();
        dashboardVeiw.addObject("loggedusername", authentication.getName()); //loggedusername this connect in Tobnavbar.html to display username
        dashboardVeiw.addObject("title", "Ritzy : Home"); //title this connect in Tobnavbar.html to display titile
        dashboardVeiw.addObject("Heading", "Ritzy ~ Elegence Rented ~");
        dashboardVeiw.setViewName("Dashboard.html");
        return dashboardVeiw;
    }   

    @RequestMapping(value = "/errorpage")
    public ModelAndView errorUI() {
        ModelAndView errorView = new ModelAndView();
        errorView.setViewName("Error.html");
        errorView.addObject("title", "Error");
        errorView.addObject("Heading", "Error");
        return errorView;
    }
}


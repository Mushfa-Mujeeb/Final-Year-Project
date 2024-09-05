package lk.ritzy.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;
import lk.ritzy.user.User;
import lk.ritzy.user.UserDao;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class ChangeUserSettingsController {

    @Autowired
    private UserDao daoUser;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // get service mapping for get data
    @GetMapping(value = "/loggeduser", produces = "application/json")
    public User getLoggedUser() {
        // authentication and autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = daoUser.getUserbyUserName(authentication.getName());
        loggedUser.setPassword(null);
        return loggedUser;

    }

    @Transactional
    @PutMapping(value = "/changeuser", produces = "application/json")
    public String updateChangeUser(@RequestBody User user) {

        try {

            User existingUser = daoUser.getReferenceById(user.getId());
            if (user.getPassword() != null) {
                if (bCryptPasswordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
                    return "User Setting change not completed : Password same as prevoius Password";
                } else {
                    user.setPassword((bCryptPasswordEncoder.encode(user.getPassword())));
                }
            } else { // if only username chaneg this sets existing password and save user details
                user.setPassword(existingUser.getPassword());
            }

            
            daoUser.save(user);

          return "OK";
        } catch (Exception e) {
            return "User Setting Change not Completed : " + e.getMessage();
        }
    }

}

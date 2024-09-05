package lk.ritzy.service;

import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lk.ritzy.user.Role;
import lk.ritzy.user.User;
import lk.ritzy.user.UserDao;


@Service
public class MyUserDetailSeevice implements UserDetailsService{

    @Autowired
    private UserDao userDao;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        System.out.println(username);

        User loggedUser = userDao.getUserbyUserName(username);

            System.out.println(loggedUser.getUsername());

            Set<GrantedAuthority> userRole = new HashSet<GrantedAuthority>();

            for (Role role : loggedUser.getRoles()) {
                userRole.add(new SimpleGrantedAuthority(role.getName()));
            }

            ArrayList<GrantedAuthority> grantedAuthorities =  new  ArrayList<GrantedAuthority>(userRole);

            

            UserDetails user = new org.springframework.security.core.userdetails.User(loggedUser.getUsername(), loggedUser.getPassword(), loggedUser.getStatus(),true,true,true,grantedAuthorities);

        return user;
    }
    
}

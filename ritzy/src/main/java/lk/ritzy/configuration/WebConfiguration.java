package lk.ritzy.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class WebConfiguration {

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    private String[] resourcesURL = {"/bootstrap-5.2.3**", "/fontawesome-free-6.4.2/**", "/style/**", "/script**",
    "Controllerjs/**", "/image/**", "/dataTables-1.13.6/**"};

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{

        httpSecurity.authorizeHttpRequests((auth) -> {
            auth
            .requestMatchers(resourcesURL).permitAll()
            .requestMatchers("/createadmin").permitAll()
            .requestMatchers("/login").permitAll()
            .requestMatchers("/errorpage").permitAll()
            .requestMatchers("/dashboard").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person", "Designer")
            .requestMatchers("/changeuser/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person")
            .requestMatchers("/loggeduser").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person")
            .requestMatchers("/employee/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person")
            .requestMatchers("/user/**").hasAnyAuthority("Admin", "Manager")
            .requestMatchers("/privilege/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person")
            .requestMatchers("/dress/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person")
            .requestMatchers("/customer/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person")
            .requestMatchers("/designer/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person")
            .requestMatchers("/dresspuchasereq/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager")
            .requestMatchers("/reservation/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person")
            .requestMatchers("/collectedperson/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person")
            .requestMatchers("/returendperson/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person")
            .requestMatchers("/dressckeckwithwddngdatereport/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person")
            .requestMatchers("/dressreport/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager","Sales-Person")
            .requestMatchers("/dresspurchreqpendingreport/**").hasAnyAuthority("Admin", "Manager","Assistant-Manager")
            .requestMatchers("/designerview/**").hasAnyAuthority("Admin", "Designer")
            .anyRequest().authenticated();

        })       
        //login form detail
        .formLogin((login) -> {
            login
            .loginPage("/login")
            .usernameParameter("username")
            .passwordParameter("password")
            .defaultSuccessUrl("/dashboard",true)
            .failureUrl("/login?error=usernamepassworderror");
            
        })
        .logout((logout) ->{
            logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/login");
        })

        .exceptionHandling(exception -> 
            exception.accessDeniedPage("/errorpage")
        )
        .csrf(csrf -> 
            csrf.disable()// Enables CSRF protection. This is activated by default when using EnableWebSecurity
        );

        return httpSecurity.build();
    
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }
}

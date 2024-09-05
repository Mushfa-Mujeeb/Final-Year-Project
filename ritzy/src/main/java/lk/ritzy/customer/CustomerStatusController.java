package lk.ritzy.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;;

@RestController
public class CustomerStatusController {

    @Autowired // inject CustomerStatusDao object into dao variable
    private CustomerStatusDao dao;

    // get service mapping for getAll customerstatus data
    @GetMapping(value = "/customerstatus/findall", produces = "application/json")
    public List<CustomerStatus> getAllData() {
        return dao.findAll();
    }

    
}

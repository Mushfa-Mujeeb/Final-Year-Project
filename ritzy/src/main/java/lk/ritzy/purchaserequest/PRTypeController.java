package lk.ritzy.purchaserequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;;

@RestController
public class PRTypeController {

    @Autowired // inject purchasereqtypeDao object into dao variable
    private PRTypeDao dao;

    // get service mapping for getAll purchasereqtypeDao data
    @GetMapping(value = "/purchasereqtype/findall", produces = "application/json")
    public List<PRType> getAllData() {
        return dao.findAll();
    }
}

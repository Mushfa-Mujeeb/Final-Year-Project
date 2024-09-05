
package lk.ritzy.purchaserequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;;

@RestController
public class PRStatusController {

    @Autowired // inject purchasereqStatusDao object into dao variable
    private PRStatusDao dao;

    // get service mapping for getAll purchasereqStatusDao data
    @GetMapping(value = "/purchasereqstatus/findall", produces = "application/json")
    public List<PRStatus> getAllData() {
        return dao.findAll();
    }
}
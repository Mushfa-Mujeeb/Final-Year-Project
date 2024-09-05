package lk.ritzy.purchaserequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;;

@RestController
public class UrgencyLevelController {

    @Autowired // inject urgencylevelDao object into dao variable
    private UrgencyLevelDao dao;

    // get service mapping for getAll urgencylevelDao data
    @GetMapping(value = "/urgencylevel/findall", produces = "application/json")
    public List<UrgencyLevel> getAllData() {
        return dao.findAll();
    }
}

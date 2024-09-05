package lk.ritzy.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@RestController
public class DesignationController {

    @Autowired // inject designationDao into dao variable
    private DesignationDao dao; // create designation dao object

    @GetMapping(value = "/designation/findall", produces = "application/json")
    public List<Designation> getAllData() {
        return dao.findAll();
    }

}

package lk.ritzy.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;;

@RestController
public class EmployeeStatusController {

    @Autowired // inject EmployeeStatusDao object into dao variable
    private EmployeeStatusDao dao;

    // get service mapping for getAll employeestatus data
    @GetMapping(value = "/employeestatus/findall", produces = "application/json")
    public List<EmployeeStatus> getAllData() {
        return dao.findAll();
    }
}

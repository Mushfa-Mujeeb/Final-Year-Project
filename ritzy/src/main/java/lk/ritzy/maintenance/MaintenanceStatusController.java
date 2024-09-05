package lk.ritzy.maintenance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;;

@RestController
public class MaintenanceStatusController {

    @Autowired // inject maintenanceStatusDao object into dao variable
    private MaintenanceStatusDao dao;

    // get service mapping for getAll maintenancestatus data
    @GetMapping(value = "/maintenancestatus/findall", produces = "application/json")
    public List<MaintenanceStatus> getAllData() {
        return dao.findAll();
    }

    
}

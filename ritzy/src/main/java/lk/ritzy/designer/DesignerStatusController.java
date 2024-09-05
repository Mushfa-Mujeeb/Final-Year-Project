package lk.ritzy.designer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;;

@RestController
public class DesignerStatusController {

    @Autowired // inject DesignerStatusDao object into dao variable
    private DesignerStatusDao dao;

    // get service mapping for getAll DesignerStatusDao data
    @GetMapping(value = "/designerstatus/findall", produces = "application/json")
    public List<DesignerStatus> getAllData() {
        return dao.findAll();
    }
}

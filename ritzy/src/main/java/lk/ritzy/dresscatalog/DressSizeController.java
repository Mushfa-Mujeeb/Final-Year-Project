package lk.ritzy.dresscatalog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DressSizeController {

    
    @Autowired
    private DressSizeDao dao;

    @GetMapping(value = "/dresssize/findAll", produces = "application/json")
    public List<DressSize> getAllData(){
        return dao.findAll();
    }
    
   

}

package lk.ritzy.dresscatalog;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DressTypeController {

    @Autowired
    private DressTypeDao dao;

    @GetMapping(value = "/dresstype/findAll", produces = "application/json")
    public List<DressType> getAllData(){
        return dao.findAll(Sort.by(Direction.ASC, "id"));
    }

    
    @GetMapping(value = "/dresstype/bystyle/{styleid}", produces = "application/json")
    public List<DressType> getDataByStyle(@PathVariable("styleid")int styleid){
        return dao.byStyle(styleid);
    }

}

package lk.ritzy.dresscatalog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
public class DressCategoryController {

    @Autowired
    private DressCategoryDao dao;

    @GetMapping(value = "/dresscategory/findAll", produces = "application/json")
    public List<DressCategory> getAllData(){
        return dao.findAll(Sort.by(Direction.ASC, "id"));
    }
    
    //get mapping for get style data by given style id ([ /dresscategory/bystyle?styleid=1 ] --> this is how should check in the browser to the above code segment)
    @GetMapping(value = "/dresscategory/bystyle/{styleid}", produces = "application/json")
    public List<DressCategory> getDataByStyle(@PathVariable("styleid")int styleid){
        return dao.byStyle(styleid);
    }
   

}

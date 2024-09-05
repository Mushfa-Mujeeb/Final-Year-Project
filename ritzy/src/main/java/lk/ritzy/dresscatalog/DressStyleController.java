package lk.ritzy.dresscatalog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DressStyleController {

    
    @Autowired
    private DressStyleDao dao;

    @GetMapping(value = "/dressstyle/findAll", produces = "application/json")
    public List<DressStyle> getAllData(){
        return dao.findAll(Sort.by(Direction.ASC, "id"));
    }

   

}

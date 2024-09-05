package lk.ritzy.dresscatalog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DressConditionController {

    @Autowired
    private DressConditionDao dao;

    @GetMapping(value = "/dresscondition/findAll", produces = "application/json")
    public List<DressCondition> getAllData(){
        return dao.findAll(Sort.by(Direction.ASC, "id"));
    }


}

package lk.ritzy.privlilege;

import org.springframework.web.bind.annotation.RestController;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class ModuleController {

    @Autowired // dependancies injection
    private ModuleDao dao; // inject ModuleDao object into dao variable


    // create mapping for get all Module data ------> URL[/Module/findall]
    @GetMapping(value = "/module/findAll", produces = "application/json")
    public List<Module> getAllData() {
        return dao.findAll(Sort.by(Direction.ASC, "id"));
    }

    //get mapping for get module data by given role id ([ /module/findAllbyrole?roleid=1 ] --> this is how should check in the browser to the above code segment)
    @GetMapping(value = "/module/findAllbyrole" , params = {"roleid"})
    public List<Module> getByRole(@RequestParam("roleid") Integer roleid){
        return dao.getModuleByRole(roleid);
    }


}

//
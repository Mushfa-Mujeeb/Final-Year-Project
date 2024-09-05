package lk.ritzy.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@RestController
public class RoleController {

    @Autowired // inject roleDao into dao variable
    private RoleDao dao; // create role dao object

    @GetMapping(value = "/role/listwithoutadmin", produces = "application/json")
    public List<Role> getRoleWithoutAdmin() {
        return dao.getListWithoutAdmin();
    }

}

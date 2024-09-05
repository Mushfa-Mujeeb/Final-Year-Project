package lk.ritzy.privlilege;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ModuleDao extends JpaRepository<Module, Integer> {


    //create query for get module by given role id
    @Query("select m from Module m where m.id not in (select p.module_id.id from Privilege p where p.role_id.id=?1)")
    public List<Module> getModuleByRole(Integer roleid);
}
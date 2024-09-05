package lk.ritzy.privlilege;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PrivilegeDao extends JpaRepository<Privilege, Integer> {

    
    //create query for get privilege object by given role id and module id
    @Query("select p from Privilege p where p.role_id.id=?1 and p.module_id.id=?2")
    public Privilege getByRoleModule(Integer roleid, Integer moduleid); 

    // create query for getprivilege by given username and module name
    @Query(value = "SELECT bit_or(p.select_privilege) as sel, bit_or(p.insert_privilege) as insrt ,bit_or(p.update_privilege) as upd , bit_or(p.delete_privilege) as del FROM ritzy.privilege as p where p.role_id in (select uhr.role_id from ritzy.user_has_role as uhr where uhr.user_id in (select u.id from ritzy.user as u where u.username=?1)) and p.module_id in (select m.id from ritzy.module as m where m.name=?2);" ,nativeQuery = true)
    public String getPrivilegeByUserModule(String username, String modulename);

}
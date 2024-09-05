package lk.ritzy.user;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

// create designation interface and extends into JpaRepository <modalfile, datatype of PK>
public interface RoleDao extends JpaRepository<Role, Integer> {

    // create query for get roles list without admin
    @Query("select r from Role r where r.name <> 'Admin'")
    List<Role> getListWithoutAdmin();
    

}

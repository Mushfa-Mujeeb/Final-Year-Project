package lk.ritzy.dresscatalog;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DressTypeDao extends JpaRepository<DressType,Integer>{

    //Query to filter dressType from DressStyle  --> check DressTypeController line 26
    @Query(value = "select dt from DressType dt where dt.style_id.id =?1")
    List<DressType> byStyle(int styleid);

   

}

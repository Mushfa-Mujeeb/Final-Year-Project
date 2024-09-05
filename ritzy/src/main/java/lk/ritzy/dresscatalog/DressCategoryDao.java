package lk.ritzy.dresscatalog;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DressCategoryDao extends JpaRepository<DressCategory,Integer>{

    //Query to filter dressCategory from DressStyle  --> check DressCategoryController line 26
    @Query(value = "select dc from DressCategory dc where dc.style_id.id=?1")
    List<DressCategory> byStyle(int styleid);

   

}

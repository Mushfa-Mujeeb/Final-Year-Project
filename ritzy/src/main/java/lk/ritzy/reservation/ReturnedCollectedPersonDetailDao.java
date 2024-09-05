package lk.ritzy.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface ReturnedCollectedPersonDetailDao extends JpaRepository<ReturnedCollectedPersonDetail, Integer> {

    
    @Query("select crp from ReturnedCollectedPersonDetail crp where crp.person_nic=?1")
    public ReturnedCollectedPersonDetail getByPersonNic(String person_nic);

    
}

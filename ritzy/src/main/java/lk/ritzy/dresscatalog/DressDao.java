package lk.ritzy.dresscatalog;

import java.util.List;
import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface DressDao extends JpaRepository<Dress,Integer>{

    // get next dress code
    @Query(value = "SELECT lpad(max(d.dress_code)+1,3,'0') FROM ritzy.dress as d;", nativeQuery = true)
    public String getNextNumber();

    //for reservation module
    //Define query for get dress with selected column which has available status
    @Query("select new Dress(d.id, d.dress_code, d.dress_name, d.price) from Dress d where d.dressavailability_id.id=1")
    public List<Dress> getAvalaibleDressList();

      //query for filter dresses by rental duration(not reserved) [fittonDate - rental end date]
    @Query(value = "select new Dress(d.id, d.dress_code, d.dress_name, d.price) from Dress d where d.dressavailability_id.id=1 and d.id not in (select rhd.dress_id.id from ReservationHasDress rhd where ?1 between rhd.fitton_date and rhd.rental_end_date or ?2 between rhd.fitton_date and rhd.rental_end_date)")
    public List<Dress> getByRentalFDED(LocalDate fd, LocalDate ed); 
    
}

package lk.ritzy.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.ritzy.dresscatalog.Dress;

import java.util.List;

public interface ReservationDao extends JpaRepository<Reservation, Integer> {

    // @Query(value = "SELECT concat('R', lpad(substring(max(r.reservaton_no), 2)+1,3,'0')) FROM ritzy.reservation as r;", nativeQuery = true)
    // public String getNextResvNumber();


    @Query(value = "SELECT concat('R',year(current_date()), lpad(substring(max(r.reservaton_no), 6)+1,5,'0')) FROM ritzy.reservation as r where year(current_date()) = year(r.added_datetime);", nativeQuery = true)
    public String getNextResvNumber();
    

    //Query to filter bu reservation status for dress collected form
    @Query(value = "select r from Reservation r where (r.reservation_status_id.id=2 or r.reservation_status_id.id=3) and r.id in (select rhd.reservation_id.id from ReservationHasDress rhd where rhd.rental_status = 'Fitton Done')")
    List<Reservation> byresStatus();

    //Query to filter bu reservation status for dress returned form
    @Query(value = "select r from Reservation r where r.reservation_status_id.id=3 and r.id in (select rhd.reservation_id.id from ReservationHasDress rhd where rhd.rental_status = 'Dress Collected')")
    List<Reservation> byresStatusForReturn();

     //Query to filter bu reservation status for payment module
     @Query(value = "select r from Reservation r where not ((r.reservation_status_id.id=4) and r.id in (select rhd.reservation_id.id from ReservationHasDress rhd where rhd.rental_status = 'Completed') or (r.reservation_status_id.id=5) and r.id in (select rhd.reservation_id.id from ReservationHasDress rhd where rhd.rental_status = 'Cancelled'))")
     List<Reservation> bypayforReservation();
    
    //  //Query to filter bu reservation status for payment module
    //  @Query(value = "select r from Reservation r where (r.reservation_status_id.id=4 and r.reservation_status_id.id=5) and r.id in (select rhd.reservation_id.id from ReservationHasDress rhd where rhd.rental_status = 'Completed' and rhd.rental_status = 'Cancelled')")
    //  List<Reservation> bypayforReservation();
    
    // @Query("SELECT b.batch_name FROM nanasala.batch as b where b.end_date = curdate() + interval -2 day;")
    // public List<Dress> getAvableDressList();


}

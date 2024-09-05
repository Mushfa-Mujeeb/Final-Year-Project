package lk.ritzy.payment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;



public interface PaymentDao extends JpaRepository<Payment, Integer>{

    //Query for get next number starting from year
    @Query(value = "SELECT concat('I',year(current_date()), lpad(substring(max(i.invoice_no), 6)+1,5,'0')) FROM ritzy.invioce as i where year(current_date()) = year(i.added_datetime);", nativeQuery = true)
    public String getNextNumber();
    


}

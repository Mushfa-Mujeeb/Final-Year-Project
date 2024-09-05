package lk.ritzy.customer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;



public interface CustomerDao extends JpaRepository<Customer, Integer>{


    // #################### duplicate email check ######################### //
    // create query for get customer by give email
    // option 01 ---> native method
    @Query("select c from Customer c where c.email=?1")
    public Customer getByEmail(String email);

    @Query("select c from Customer c where c.nic=?1")
    public Customer getByNic(String nic);

    //this query is to get customer list for customer dropdown under reserevation module
    @Query("select new Customer(c.id, c.first_name, c.phone, c.nic ) from Customer c where c.customerstatus_id.id=1") //selected 2 of them must be mentioned in customer entity file too
    public List<Customer> CustomerList();
  
    //this query is to get customer list for customer dropdown under dress collected module
    @Query("select new Customer(c.id, c.first_name, c.phone, c.nic) from Customer c where c.customerstatus_id.id=1 and c.id in (select r.customer_id.id from Reservation r)") //selected 2 of them must be mentioned in customer entity file too
    public List<Customer> CustomerReservedList();

}

package lk.ritzy.designer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.ritzy.purchaserequest.PurchaseRequest;



public interface DesignerDao extends JpaRepository<Designer,Integer>{

    // #################### duplicate email check ######################### //
    // create query for get designer by give email
    // option 01 ---> native method
    @Query("select d from Designer d where d.email=?1")
    public Designer getByEmail(String email);



    // get Designer by given nic
    @Query(value = "select d from Designer d where d.nic=?1")
    public Designer getBYNic(String nic);


    //
    
    // @Query(value = "select pr from Designer pr where pr.purchase_request_status_id.id=1")
    // List<Designer> pendingPurchaseRequestsdesignerViewList();


}

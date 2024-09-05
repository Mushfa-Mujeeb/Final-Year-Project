package lk.ritzy.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.ritzy.dresscatalog.Dress;
import lk.ritzy.purchaserequest.PurchaseRequest;

import java.util.HashMap;
import java.util.List;

import java.time.LocalDate;

@RestController
public class ReportDataController {
    
    @Autowired
    private ReportDao daoReport;



    @GetMapping(value = "/pendingpurchaserequestslist", produces = "application/json")
    public List<PurchaseRequest> getpendingPurchaseRequestsList(){
        return daoReport.pendingPurchaseRequestsList();
    }

    // [/reportavailablestyledresses?availability=1&style=1]
    @GetMapping(value = "/reportavailablestyledresses",params = {"availability","style"}, produces = "application/json")
    public List<Dress> getAvailableStyleDresses(@RequestParam("availability")int availability, @RequestParam("style")int style){
        return daoReport.AvailableStyleDresses(style,availability);
    }

    
    //Dress available list for reservation module
    @GetMapping(value = "/reportdressdata/availablelistbyfded/{fd}/{ed}", produces = "application/json")
    public List<Dress> getAvailableDressesByFDEDForReport(@PathVariable("fd")String fittondate, @PathVariable("ed")String enddate){
        
        LocalDate fd = LocalDate.parse(fittondate);
        LocalDate ed = LocalDate.parse(enddate);

        return daoReport.getByRentalFDED(fd , ed); // this connects in reportDao
    }


    
    //Dress available list for reservation module
    @GetMapping(value = "/designersview/purchaserequest", produces = "application/json")
    public List<PurchaseRequest> getpendingPurchaseRequestsdesignerViewList(){
        // get logged user authentication object

        return daoReport.pendingPurchaseRequestsList(); // this connects in designerdao
    }


}

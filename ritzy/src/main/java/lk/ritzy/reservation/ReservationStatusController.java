package lk.ritzy.reservation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;;

@RestController
public class ReservationStatusController {

    @Autowired // inject ReservationStatusDao object into dao variable
    private ReservationStatusDao dao;

    // get service mapping for getAll ReservationStatusDao data
    @GetMapping(value = "/reservationstatus/findall", produces = "application/json")
    public List<ReservationStatus> getAllData() {
        return dao.findAll();
    }
}

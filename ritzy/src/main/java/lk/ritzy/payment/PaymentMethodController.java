package lk.ritzy.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;;

@RestController
public class PaymentMethodController {

    @Autowired // inject PaymentMethodDao object into dao variable
    private PaymentMethodDao dao;

    // // get service mapping for getAll PaymentMethod data
    @GetMapping(value = "/paymentmethod/findall", produces = "application/json")
    public List<PaymentMethod> getAllData(){
        return dao.findAll();
    }
    
}

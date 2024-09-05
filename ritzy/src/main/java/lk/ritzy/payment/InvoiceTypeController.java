package lk.ritzy.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;;

@RestController
public class InvoiceTypeController {

    @Autowired // inject InvoiceTypeDao object into dao variable
    private InvoiceTypeDao dao;

    // get service mapping for getAll InvoiceType data
    @GetMapping(value = "/invoicetype/findall", produces = "application/json")
    public List<InvoiceType> getAllData() {
        return dao.findAll();
    }

    
}

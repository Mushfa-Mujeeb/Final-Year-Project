package lk.ritzy.payment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.ritzy.reservation.Reservation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import java.math.BigDecimal;

@Entity // applied as an entity class
@Table(name = "invioce") // for map with given table

@Data // generate getters and setters etc..
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // generate default constructor
public class Payment {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true)
    private Integer id;

    @Column(name = "invoice_no", unique = true)
    @NotNull
    private String invoice_no;
    
    @Column(name = "added_datetime")
    @NotNull
    private LocalDateTime added_datetime ; 
    
    @Column(name = "added_user")
    @NotNull
    private Integer added_user;  
   
    @Column(name = "note")
    private String note;


    // ##############################       Reservation Invoice      ##################################### //
    
    @Column(name = "reservation_payment_date")
    private LocalDateTime reservation_payment_date ; 
      
    @Column(name = "total_reservation_charge")
    private BigDecimal total_reservation_charge;


// ################################       Deposit Invoice      ################################### //
    
    @Column(name = "deposit_payment_date")
    private LocalDateTime deposit_payment_date ; 

    @Column(name = "total_deposit_amount")
    private BigDecimal total_deposit_amount;

    // ############################       Rental Invoice      ####################################### //

    
    @Column(name = "rental_payment_date")
    private LocalDateTime rental_payment_date ; 

    
    @Column(name = "total_dress_rental_price")
    private BigDecimal total_dress_rental_price;
    
    @Column(name = "refundable_amount")
    private BigDecimal refundable_amount;
    
    @Column(name = "rental_net_total")
    private BigDecimal rental_net_total;

    // ################################################################### //
       
    @Column(name = "total_amount")
    private BigDecimal total_amount;


    @Column(name = "paid_amount")
    private BigDecimal paid_amount;


    @Column(name = "balance_amount")
    private BigDecimal balance_amount;
    

    // ################################################################### //
    
    @ManyToOne
    @JoinColumn(name = "invoice_type_id", referencedColumnName = "id")
    private InvoiceType invoice_type_id;

    @ManyToOne
    @JoinColumn(name = "reservation_id", referencedColumnName = "id")
    private Reservation reservation_id;

    @ManyToOne
    @JoinColumn(name = "payment_method_id", referencedColumnName = "id")
    private PaymentMethod payment_method_id;
    

}

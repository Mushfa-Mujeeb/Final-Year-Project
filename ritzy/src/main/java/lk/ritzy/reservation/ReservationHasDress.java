package lk.ritzy.reservation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

import lk.ritzy.dresscatalog.Dress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "reservation_has_dress")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationHasDress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "reservation_id", referencedColumnName = "id")
    @JsonIgnore
    private Reservation reservation_id;
    
    @ManyToOne
    @JoinColumn(name = "dress_id", referencedColumnName = "id")
    private Dress dress_id;
    
    @Column(name = "dress_rental_price")
    @NotNull
    private BigDecimal dress_rental_price ;

    @Column(name = "deposit_amount")
    @NotNull
    private BigDecimal deposit_amount ;

    @Column(name = "pre_reservation_total")
    private BigDecimal pre_reservation_total;

    @Column(name = "rental_start_date")
    @NotNull
    private LocalDate rental_start_date ; 
    
    @Column(name = "rental_end_date")
    @NotNull
    private LocalDate rental_end_date ; 
    
    @Column(name = "fitton_date")
    @NotNull
    private LocalDate fitton_date ; 

    @Column(name = "rental_status")
    private String rental_status;

// ################################ Dress Colleced Details ################################ //
    
    @Column(name = "collected_date")
    private LocalDate collected_date ;

    @Column(name = "collected_by")
    private String collected_by;
    
    @ManyToOne(optional = true)
    @JoinColumn(name = "collected_person_detail_id", referencedColumnName = "id")
    private ReturnedCollectedPersonDetail collected_person_detail_id;

// ################################ Dress Returned Details ################################ //

    @Column(name = "returned_date")
    private LocalDate returned_date ;  

    @Column(name = "returned_by")
    private String returned_by;
        
    @ManyToOne(optional = true)
    @JoinColumn(name = "returned_person_detail_id", referencedColumnName = "id")
    private ReturnedCollectedPersonDetail returned_person_detail_id;  

    @Column(name = "refundable_amount")
    private BigDecimal refundable_amount ;

    @Column(name = "extra_charges")
    private BigDecimal extra_charges;



    @Column(name = "damaged_charge")
    private BigDecimal damaged_charge ;
    
    @Column(name = "damage_note")
    private String damage_note;

    


    @Column(name = "late_returned_charge")
    private BigDecimal late_returned_charge;

    @Column(name = "late_returned_note")
    private String late_returned_note;
}

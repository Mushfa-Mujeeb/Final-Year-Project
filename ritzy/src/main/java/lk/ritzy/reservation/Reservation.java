package lk.ritzy.reservation;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.ritzy.customer.Customer;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import java.util.List;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity // applied as an entity class
@Table(name = "reservation") // for map with given table
@Data // generate getters and setters etc..
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // generate default constructor
public class Reservation {    
    // ##################################  Reservation Section ################################## //
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id;
        
    @Column(name = "reservaton_no", unique = true)
    @NotNull
    private String reservaton_no;
    
    @Column(name = "wedding_date")
    @NotNull
    private LocalDate wedding_date ; 
    
    @Column(name = "rental_start_date")
    @NotNull
    private LocalDate rental_start_date ; 
    
    @Column(name = "rental_end_date")
    @NotNull
    private LocalDate rental_end_date ; 
    
    @Column(name = "total_amount")
    @NotNull
    private BigDecimal total_amount ; 
        
    @Column(name = "reservation_charge")
    @NotNull
    private BigDecimal reservation_charge;
    
    @Column(name = "net_total")
    @NotNull
    private BigDecimal net_total;
    
    @ManyToOne
    @JoinColumn(name = "reservation_status_id", referencedColumnName = "id")
    private ReservationStatus reservation_status_id;
    
    @Column(name = "note")
    private String note;

    // ##################################  Date modified details Section ################################## //
    
    @Column(name = "added_datetime")
    @NotNull
    private LocalDateTime added_datetime ; 
    
    @Column(name = "updated_datetime")
    private LocalDateTime updated_datetime ; 
    
    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime ; 
    
    @Column(name = "added_user")
    @NotNull
    private Integer added_user; 
    
    @Column(name = "updated_user")
    private Integer updated_user; 
    
    @Column(name = "deleted_user")
    private Integer deleted_user; 

    // ##################################  Dress Collected/Returned Section ################################## //
              
    @Column(name = "refundable_amount")
    private BigDecimal refundable_amount;    
    
    @Column(name = "total_damage_charge")
    private BigDecimal total_damage_charge;

    @Column(name = "total_late_returned_charge")
    private BigDecimal total_late_returned_charge;
    
    //cascade = CascadeType.ALL, orphanRemoval = true ------------> 
    @OneToMany(mappedBy = "reservation_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservationHasDress> reservationHasDressList;
    
    
}

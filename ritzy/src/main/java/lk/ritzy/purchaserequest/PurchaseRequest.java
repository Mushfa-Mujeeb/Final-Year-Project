package lk.ritzy.purchaserequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.ritzy.designer.Designer;
import lk.ritzy.dresscatalog.Dress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // applied as an entity class
@Table(name = "dress_purchase_request") // for map with given table

@Data // generate getters and setters etc..
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // generate default constructor
public class PurchaseRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id; 
    
    @Column(name = "quantity")
    @NotNull
    private Integer quantity;
    
    @Column(name = "budget_allocated")
    @NotNull
    private BigDecimal budget_allocated;
    
    @Column(name = "actual_budget")
    private BigDecimal actual_budget;
    
    @Column(name = "required_date")
    @NotNull
    private LocalDate required_date;
    
    @Column(name = "note")
    private String note;
    
    @Column(name = "added_user")
    @NotNull
    private Integer added_user; 
    
    @Column(name = "updated_user")
    private Integer updated_user; 
    
    @Column(name = "deleted_user")
    private Integer deleted_user; 
    
    @Column(name = "added_datetime")
    @NotNull
    private LocalDateTime added_datetime; 
    
    @Column(name = "updated_datetime")
    private LocalDateTime updated_datetime; 
    
    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime; 

    

    @ManyToOne
    @JoinColumn(name = "purchase_request_type_id", referencedColumnName = "id")
    private PRType purchase_request_type_id;


    @ManyToOne
    @JoinColumn(name = "purchase_request_status_id", referencedColumnName = "id")
    private PRStatus purchase_request_status_id;


    @ManyToOne
    @JoinColumn(name = "urgency_level_id", referencedColumnName = "id")
    private UrgencyLevel urgency_level_id;


    @ManyToOne
    @JoinColumn(name = "designer_id", referencedColumnName = "id")
    private Designer designer_id;


    @ManyToOne
    @JoinColumn(name = "dress_id", referencedColumnName = "id")
    private Dress dress_id;
     
    
    
}

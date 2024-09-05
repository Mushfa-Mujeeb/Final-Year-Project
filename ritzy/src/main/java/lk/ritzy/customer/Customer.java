package lk.ritzy.customer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity // applied as an entity class
@Table(name = "customer") // for map with given table

@Data // generate getters and setters etc..
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // generate default constructor
public class Customer {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    @Column(name = "id", unique = true)
    private Integer id;
    
    @Column(name = "first_name")  
    @NotNull  
    private String first_name;
    
    @Column(name = "last_name")
    @NotNull
    private String last_name;
    
    @Column(name = "email")
    @NotNull
    private String email; 

    @Column(name = "nic")
    @NotNull
    private String nic; 
    
    @Column(name = "address")
    @NotNull
    private String address; 
    
    @Column(name = "phone")
    @NotNull
    private String phone;
    
    @Column(name = "added_datetime")
    @NotNull
    private LocalDateTime added_datetime;
    
    @Column(name = "note")
    private String note;
    
    @Column(name = "updated_datetime")
    private LocalDateTime updated_datetime; 
    
    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime; 
    
    @Column(name = "added_user")
    @NotNull
    private Integer added_user; 
    
    @Column(name = "updated_user")
    private Integer updated_user; 
    
    @Column(name = "deleted_user")
    private Integer deleted_user; 

    
    @ManyToOne
    @JoinColumn(name = "customerstatus_id", referencedColumnName = "id")
    private CustomerStatus customerstatus_id;

    //this code segment is to get only 2 without getting all
    public Customer(Integer id,  String first_name, String phone,String nic){
        this.id = id;
        this.first_name = first_name;
        this.phone = phone;
        this.nic = nic;
    }
    
}

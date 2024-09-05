package lk.ritzy.designer;

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
@Table(name = "designer") // for map with given table

@Data // generate getters and setters etc..
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // generate default constructor
public class Designer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id ;
    
    @Column(name = "designer_name")
    @NotNull
    private String designer_name;
    
    @Column(name = "email")
    @NotNull
    private String email;
    
    @Column(name = "nic")
    @NotNull
    private String nic;
    
    @Column(name = "phone")
    @NotNull
    private String phone;
    
    @Column(name = "additional_phone")
    private String additional_phone;
    
    @Column(name = "address")
    @NotNull
    private String address;
    
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
    private LocalDateTime added_datetime ; 
    
    @Column(name = "updated_datetime")
    private LocalDateTime updated_datetime ; 
    
    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime ; 
    
    @ManyToOne
    @JoinColumn(name = "designer_status_id", referencedColumnName = "id")
    private DesignerStatus designer_status_id;
}

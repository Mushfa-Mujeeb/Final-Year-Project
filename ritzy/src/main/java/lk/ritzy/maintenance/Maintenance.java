package lk.ritzy.maintenance;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // applied as an entity class
@Table(name = "maintenance_tracking") // for map with given table

@Data // generate getters and setters etc..
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // generate default constructor
public class Maintenance {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    @Column(name = "id", unique = true)
    private Integer id;
    
    
}

package lk.ritzy.dresscatalog;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

@Entity // applied as an entity class
@Table(name = "dress") // for map with given table
@Data // generate getters and setters etc..
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // generate default constructor
public class Dress {

@Id //PK
@GeneratedValue(strategy = GenerationType.IDENTITY) // AI
@Column(name = "id", unique = true)
private Integer id;

@Column(name = "dress_code", unique = true)
@NotNull
private String dress_code;

@Column(name = "dress_name")
@NotNull
private String dress_name;

@Column(name = "price")
@NotNull
private BigDecimal price;

@Column(name = "image")
private byte[] image; 

@Column(name = "image_name")
private String image_name; 

@Column(name = "note")
private String note;

@Column(name = "added_datetime")
@NotNull
private LocalDateTime added_datetime; 

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
@JoinColumn(name = "style_id", referencedColumnName="id")
private DressStyle style_id; 

@ManyToOne
@JoinColumn(name = "category_id", referencedColumnName="id")
private DressCategory category_id; 

@ManyToOne
@JoinColumn(name = "dressavailability_id", referencedColumnName="id")
private DressAvailability dressavailability_id; 

@ManyToOne
@JoinColumn(name = "sizes_id", referencedColumnName="id")
private DressSize sizes_id; 

@ManyToOne
@JoinColumn(name = "dress_condition_id", referencedColumnName="id")
private DressCondition dress_condition_id;

@ManyToOne
@JoinColumn(name = "dress_type_id", referencedColumnName="id")
private DressType dress_type_id;
 

public Dress(Integer id, String dress_code, String dress_name, BigDecimal price){
    this.id = id;
    this.dress_code = dress_code;
    this.dress_name = dress_name;
    this.price = price;
}
}

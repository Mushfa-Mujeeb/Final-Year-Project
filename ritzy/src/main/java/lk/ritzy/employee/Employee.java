package lk.ritzy.employee;

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

import java.time.LocalDate;

@Entity // applied as an entity class
@Table(name = "employee") // for map with given table

@Data // generate getters and setters etc..
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // generate default constructor
public class Employee {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "empno", unique = true)
    @NotNull
    private String empno;

    @Column(name = "emp_first_name")
    @NotNull
    private String emp_first_name;

    @Column(name = "emp_last_name")
    @NotNull
    private String emp_last_name;

    @Column(name = "email", unique = true)
    @NotNull
    private String email;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name = "phone")
    @NotNull
    private String phone;

    @Column(name = "note")
    private String note;

    @Column(name = "added_date")
    private LocalDate added_date;

    @Column(name = "updated_date")
    private LocalDate updated_date;

    @Column(name = "deleted_date")
    private LocalDate deleted_date;

    @Column(name = "added_user")
    private Integer added_user;

    @Column(name = "updated_user")
    private Integer updated_user;

    @Column(name = "deleted_user")
    private Integer deleted_user;

    @ManyToOne
    @JoinColumn(name = "employeestatus_id", referencedColumnName = "id")
    private EmployeeStatus employeestatus_id;

    @ManyToOne
    @JoinColumn(name = "designation_id", referencedColumnName = "id")
    private Designation designation_id;
}

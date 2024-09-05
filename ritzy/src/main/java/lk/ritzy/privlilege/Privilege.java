package lk.ritzy.privlilege;


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
import lk.ritzy.user.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "privilege")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Privilege {

    @Id // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto Imlement
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "select_privilege")
    @NotNull
    private Boolean select_privilege;

    @Column(name = "insert_privilege")
    @NotNull
    private Boolean insert_privilege;

    @Column(name = "update_privilege")
    @NotNull
    private Boolean update_privilege;

    @Column(name = "delete_privilege")
    @NotNull
    private Boolean delete_privilege;

    @Column(name = "added_date")
    @NotNull
    private LocalDateTime added_date;

    @Column(name = "updated_date")
    private LocalDateTime updated_date;

    @Column(name = "deleted_date")
    private LocalDateTime deleted_date;

    @Column(name = "added_user")
    @NotNull
    private Integer added_user;

    @Column(name = "updated_user")
    private Integer updated_user;

    @Column(name = "deleted_user")
    private Integer deleted_user;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role_id;

    @ManyToOne
    @JoinColumn(name = "module_id", referencedColumnName = "id")
    private Module module_id;

}

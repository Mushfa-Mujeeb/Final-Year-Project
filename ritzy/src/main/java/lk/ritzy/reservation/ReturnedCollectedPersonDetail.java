package lk.ritzy.reservation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "returned_collected_person_detail")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReturnedCollectedPersonDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true)
    private Integer id;

    @Column(name = "person_name")
    @NotNull
    private String person_name;

    @Column(name = "person_nic",unique = true)
    @NotNull
    private String person_nic;

    @Column(name = "person_mobile")
    @NotNull
    private String person_mobile;
}

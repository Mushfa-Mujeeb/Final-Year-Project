package lk.ritzy.employee;

import org.springframework.data.jpa.repository.JpaRepository;

// create designation interface and extends into JpaRepository <modalfile, datatype of PK>
public interface DesignationDao extends JpaRepository<Designation, Integer> {

}

package lk.ritzy.employee;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeStatusDao extends JpaRepository<EmployeeStatus, Integer> {

}

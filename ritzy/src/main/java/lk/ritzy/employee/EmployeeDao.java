package lk.ritzy.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface EmployeeDao extends JpaRepository<Employee, Integer> {

    // get next employee number
    @Query(value = "SELECT lpad(max(e.empno)+1,8,'0') FROM ritzy.employee as e;", nativeQuery = true)
    public String getNextNumber();

    // define query for getEmployee List Without UserAccount
    @Query("SELECT e from Employee e WHERE e.id not in (select u.employee_id from User u)")
    List<Employee> getEmployeeListWithoutUserAccount(); // this functions in EMployeeController line 36

    // #################### duplicate email check ######################### //
    // create query for get employee by give email
    // option 01 ---> native method
    @Query("select e from Employee e where e.email=?1")
    public Employee getByEmail(String email);

    // selecting employee who has no user account
    // here it has a slight change in the query compared to the native query which
    // we
    // used in mysqlworkbench ---> the table name
    /*
     * select e.id, e.fullname from bitproject.employee as e where e.id not in
     * (SELECT u.employee_id FROM bitproject.user as u);
     */
    @Query("select e from Employee e where e.id not in (select u.employee_id.id from User u)")
    public List<Employee> getEmployeeWithoutUserAccount();

}

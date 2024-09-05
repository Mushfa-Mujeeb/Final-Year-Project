package lk.ritzy.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserDao extends JpaRepository<User, Integer> {

    // create query for get user by given usename --> userControlller line 45
    @Query("select u from User u where u.username=?1")
    public User getUserbyUserName(String username);

    // query for get user by given email --> userControlller line 51
    @Query("select u from User u where u.email=?1")
    public User getUserbyEmail(String email);

    // create query for get user by given employee --> userController line 58
    @Query("select u from User u where u.employee_id.id=?1")
    public User getUserByEmployee(Integer id);

    public static User getUserByUserName(String username) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUserByUserName'");
    }
}

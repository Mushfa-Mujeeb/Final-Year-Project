package lk.ritzy.reservation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationStatusDao extends JpaRepository<ReservationStatus, Integer> {

}

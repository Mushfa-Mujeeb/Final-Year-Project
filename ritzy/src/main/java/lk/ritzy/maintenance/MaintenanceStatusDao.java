package lk.ritzy.maintenance;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceStatusDao extends JpaRepository<MaintenanceStatus, Integer> {

}

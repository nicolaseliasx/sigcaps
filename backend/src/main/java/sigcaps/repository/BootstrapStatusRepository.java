package sigcaps.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import sigcaps.repository.model.BootstrapStatus;

public interface BootstrapStatusRepository extends MongoRepository<BootstrapStatus, String> {
}

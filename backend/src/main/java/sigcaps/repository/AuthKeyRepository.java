package sigcaps.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import sigcaps.repository.model.AuthKey;

public interface AuthKeyRepository extends MongoRepository<AuthKey, String> {
}

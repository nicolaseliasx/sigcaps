package sigcaps.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import sigcaps.repository.model.Config;

@Repository
public interface ConfigRepository extends MongoRepository<Config, String> {
}

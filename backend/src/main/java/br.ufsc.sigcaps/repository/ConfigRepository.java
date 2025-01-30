package br.ufsc.sigcaps.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import br.ufsc.sigcaps.model.document.ConfigDocument;

@Repository
public interface ConfigRepository extends MongoRepository<ConfigDocument, String> {
}

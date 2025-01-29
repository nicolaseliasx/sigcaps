package br.ufsc.sigcaps.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import br.ufsc.sigcaps.model.document.HistoricoChamadosDocument;

@Repository
public interface HistoricoChamadosRepository extends MongoRepository<HistoricoChamadosDocument, String> {
	List<HistoricoChamadosDocument> findTop10ByOrderByIdDesc();
}

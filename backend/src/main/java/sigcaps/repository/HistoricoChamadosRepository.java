package sigcaps.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import sigcaps.model.document.HistoricoChamados;

@Repository
public interface HistoricoChamadosRepository extends MongoRepository<HistoricoChamados, String> {
	List<HistoricoChamados> findTop10ByOrderByIdDesc();
}

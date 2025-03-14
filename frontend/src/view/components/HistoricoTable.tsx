import { DataTable, HFlow, Text } from "bold-ui";
import { useState } from "react";
import { riscoRecord } from "../painel-model";
import { titleCase } from "../../utils/utils";
import { idToRiscoClassificacao } from "../painel-utils";
import { ColorSquare } from "../../components/ColorSquare";

interface HistoricoRow {
  id: number;
  horario: string;
  nomePaciente: string;
  classificacao: keyof typeof riscoRecord;
  tipoServico: string[];
}

interface HistoricoTableProps {
  historico: Array<{
    horario: string;
    nomePaciente: string;
    classificacao: string;
    tipoServico: string[];
  }>;
}

type RiscoClassificacao = keyof typeof riscoRecord;

export function HistoricoTable({ historico }: HistoricoTableProps) {
  const [sort, setSort] = useState(["horario"]);

  const rows: HistoricoRow[] = historico.map((item, index) => {
    const classificacao = idToRiscoClassificacao(item.classificacao);

    const classificacaoValida =
      classificacao in riscoRecord
        ? (classificacao as RiscoClassificacao)
        : ("NAO_CLASSIFICADO" as RiscoClassificacao);

    return {
      id: index,
      horario: new Date(item.horario).toLocaleTimeString("pt-BR", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      nomePaciente: titleCase(item.nomePaciente),
      classificacao: classificacaoValida,
      tipoServico: item.tipoServico ?? [],
    };
  });

  return (
    <DataTable<HistoricoRow>
      rows={rows}
      sort={sort}
      onSortChange={setSort}
      loading={false}
      columns={[
        {
          name: "horario",
          header: <Text fontSize={1.6}>Horário</Text>,
          sortable: true,
          render: (item) => <Text fontSize={1.8}>{item.horario}</Text>,
        },
        {
          name: "nomePaciente",
          header: <Text fontSize={1.6}>Nome do Paciente</Text>,
          sortable: true,
          render: (item) => (
            <Text fontSize={2} fontWeight="bold">
              {item.nomePaciente}
            </Text>
          ),
        },
        {
          name: "classificacao",
          header: <Text fontSize={1.6}>Classificação</Text>,
          render: (item) => (
            <HFlow alignItems="center">
              <ColorSquare
                color={riscoRecord[item.classificacao].color}
                size={2}
              />
              <Text fontSize={1.8}>{riscoRecord[item.classificacao].nome}</Text>
            </HFlow>
          ),
        },
        {
          name: "tipoServico",
          header: <Text fontSize={1.6}>Atendimento</Text>,
          render: (item) => (
            <Text fontSize={1.8}>
              {item.tipoServico.length > 0
                ? titleCase(item.tipoServico.join(" e "))
                : ""}
            </Text>
          ),
        },
      ]}
    />
  );
}

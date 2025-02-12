import { DataTable, HFlow, Text } from "bold-ui";
import { useState } from "react";
import { riscoColorRecord, riscoNomeRecord } from "../painel-model";
import { titleCase } from "../../../utils/utils";
import { idToRiscoClassificacao } from "../painel-utils";
import { ColorSquare } from "../../../components/ColorSquare";
import { useConfig } from "../../../provider/useConfig";
import { useFontScale } from "../../../hooks/useFontScale";

interface HistoricoRow {
  id: number;
  horario: string;
  nomePaciente: string;
  classificacao: keyof typeof riscoColorRecord;
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

type RiscoClassificacao = keyof typeof riscoColorRecord;

export function HistoricoTable({ historico }: HistoricoTableProps) {
  const [sort, setSort] = useState(["horario"]);

  const { config } = useConfig();

  const fontSizes = useFontScale(config?.fontSize || 5);

  const rows: HistoricoRow[] = historico.map((item, index) => {
    const classificacao = idToRiscoClassificacao(item.classificacao);

    const classificacaoValida =
      classificacao in riscoColorRecord
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
          header: <Text fontSize={fontSizes.small}>Horário</Text>,
          sortable: true,
          render: (item) => (
            <Text fontSize={fontSizes.small}>{item.horario}</Text>
          ),
        },
        {
          name: "nomePaciente",
          header: <Text fontSize={fontSizes.small}>Nome do Paciente</Text>,
          sortable: true,
          render: (item) => (
            <Text fontSize={fontSizes.small} fontWeight="bold">
              {item.nomePaciente}
            </Text>
          ),
        },
        {
          name: "classificacao",
          header: <Text fontSize={fontSizes.small}>Classificação</Text>,
          render: (item) => (
            <HFlow alignItems="center">
              <ColorSquare
                color={riscoColorRecord[item.classificacao]}
                size={fontSizes.base}
              />
              <Text fontSize={fontSizes.small}>
                {riscoNomeRecord[item.classificacao]}
              </Text>
            </HFlow>
          ),
        },
        {
          name: "tipoServico",
          header: <Text fontSize={fontSizes.small}>Atendimento</Text>,
          render: (item) => (
            <Text fontSize={fontSizes.small}>
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

import { VFlow, Text, HFlow } from "bold-ui";
import { PageContent } from "../components/layout/PageContent";
import { ChamadaPaciente, riscoRecord } from "./painel-model";
import { titleCase } from "../utils/utils";
import { formatDatePainel, idToRiscoClassificacao } from "./painel-utils";
import { useWebSocket } from "../hooks/useWebSocket";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { useEffect, useState } from "react";
import { useConfig } from "../provider/config/useConfig";
import { useAuth } from "../provider/auth/useAuth";
import { Box } from "../components/layout/Box";
import { ColorSquare } from "../components/ColorSquare";
import { HistoricoTable } from "./components/HistoricoTable";

export default function PainelChamadasView() {
  const { config } = useConfig();
  const { serverUrl } = useAuth();

  const voiceVolume = config?.voiceVolume ?? 1;
  const { speak } = useTextToSpeech();

  const { data: chamadaPaciente } = useWebSocket<ChamadaPaciente>(
    `${serverUrl}/ws`,
    "/topic/chamadaPaciente"
  );

  const [nowFormatted, setNowFormatted] = useState<string>(
    titleCase(formatDatePainel(new Date()))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setNowFormatted(titleCase(formatDatePainel(new Date())));
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chamadaPaciente) {
      speak(chamadaPaciente.nomePaciente);
    }
  }, [chamadaPaciente, voiceVolume, speak, config?.voiceVolume]);

  return chamadaPaciente ? (
    <PageContent type="filled" style={{ margin: "2em" }}>
      <VFlow>
        <Text fontSize={1.6} fontWeight="bold">
          {nowFormatted}
        </Text>
        <VFlow vSpacing={0}>
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Text fontSize={6.8} fontWeight="bold">
              {titleCase(chamadaPaciente?.nomePaciente)}
            </Text>
          </Box>
          <div style={{ display: "flex", width: "100%" }}>
            <Box style={{ margin: "0", padding: "1rem 2rem" }}>
              <VFlow>
                <Text fontSize={2} fontWeight="bold">
                  Classificação de risco
                </Text>

                {(() => {
                  const riscoId = idToRiscoClassificacao(
                    chamadaPaciente?.classificacao ?? ""
                  );
                  const risco = riscoRecord[riscoId];
                  return (
                    <HFlow alignItems="center">
                      <ColorSquare color={risco.color} size={3.2} />
                      <Text fontSize={2}>{risco.nome}</Text>
                    </HFlow>
                  );
                })()}
              </VFlow>
            </Box>
            <Box style={{ margin: "0", flex: "1", padding: "1rem 2rem" }}>
              <VFlow>
                <Text fontSize={2} fontWeight="bold">
                  Atendimento
                </Text>
                <Text fontSize={2}>
                  {titleCase(chamadaPaciente?.tipoServico?.join(" e "))}
                </Text>
              </VFlow>
            </Box>
          </div>
        </VFlow>

        <VFlow>
          <Text fontSize={2} fontWeight="bold">
            Histórico de chamadas
          </Text>
          {chamadaPaciente?.historico?.length > 0 && (
            <HistoricoTable historico={chamadaPaciente.historico} />
          )}
        </VFlow>
      </VFlow>
    </PageContent>
  ) : (
    <PageContent type="filled" style={{ marginTop: "25rem" }}>
      <VFlow
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text fontSize={2} fontWeight="bold">
          Nenhum paciente foi chamado ainda. Aguardando próximas chamadas.
        </Text>
      </VFlow>
    </PageContent>
  );
}

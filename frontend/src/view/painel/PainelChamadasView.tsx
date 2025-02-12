import { VFlow, Text, HFlow } from "bold-ui";
import { PageContent } from "../../components/layout/PageContent";
import {
  ChamadaPaciente,
  riscoColorRecord,
  riscoNomeRecord,
} from "./painel-model";
import { titleCase } from "../../utils/utils";
import { formatDatePainel, idToRiscoClassificacao } from "./painel-utils";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";
import { useEffect, useState } from "react";
import { useConfig } from "../../provider/useConfig";
import { Box } from "../../components/layout/Box";
import { ColorSquare } from "../../components/ColorSquare";
import { HistoricoTable } from "./components/HistoricoTable";
import { useFontScale } from "../../hooks/useFontScale";

export default function PainelChamadasView() {
  const { config, serverUrl } = useConfig();

  const fontSizes = useFontScale(config?.fontSize || 1);

  const voiceVolume = config?.voiceVolume ?? 1;
  const { speak } = useTextToSpeech();

  const { data: chamadaPaciente } = useWebSocket<ChamadaPaciente>(
    `${serverUrl}/ws`,
    "/topic/chamadaPaciente",
    "chamadaPaciente"
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
      speak(chamadaPaciente?.nomePaciente, { volume: config?.voiceVolume });
    }
  }, [chamadaPaciente, voiceVolume, speak, config?.voiceVolume]);

  return chamadaPaciente ? (
    <PageContent type="filled" style={{ margin: "2em" }}>
      <VFlow>
        <Text fontSize={fontSizes.small} fontWeight="bold">
          {nowFormatted}
        </Text>
        <VFlow vSpacing={0}>
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Text fontSize={fontSizes.xlarge} fontWeight="bold">
              {titleCase(chamadaPaciente?.nomePaciente)}
            </Text>
          </Box>
          <div style={{ display: "flex", width: "100%" }}>
            <Box style={{ margin: "0", padding: "1rem 2rem" }}>
              <VFlow>
                <Text fontSize={fontSizes.base} fontWeight="bold">
                  Classificação de risco
                </Text>
                <HFlow alignItems="center">
                  <ColorSquare
                    color={
                      riscoColorRecord[
                        idToRiscoClassificacao(chamadaPaciente.classificacao)
                      ]
                    }
                    size={fontSizes.medium}
                  />
                  <Text fontSize={fontSizes.base}>
                    {
                      riscoNomeRecord[
                        idToRiscoClassificacao(chamadaPaciente.classificacao)
                      ]
                    }
                  </Text>
                </HFlow>
              </VFlow>
            </Box>
            <Box style={{ margin: "0", flex: "1", padding: "1rem 2rem" }}>
              <VFlow>
                <Text fontSize={fontSizes.base} fontWeight="bold">
                  Atendimento
                </Text>
                <Text fontSize={fontSizes.base}>
                  {titleCase(chamadaPaciente?.tipoServico?.join(" e "))}
                </Text>
              </VFlow>
            </Box>
          </div>
        </VFlow>

        <VFlow style={{ marginTop: "1rem" }}>
          <Text fontSize={fontSizes.small} fontWeight="bold">
            Histórico de chamadas
          </Text>
          {chamadaPaciente?.historico &&
            chamadaPaciente.historico.length > 0 && (
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
        <Text fontSize={fontSizes.medium} fontWeight="bold">
          Sem dados a serem exibidos. Realize chamadas de pacientes.
        </Text>
      </VFlow>
    </PageContent>
  );
}

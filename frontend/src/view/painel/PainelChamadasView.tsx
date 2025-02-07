import { VFlow, Text, useTheme, HFlow, Grid, Cell } from "bold-ui";
import { PageContent } from "../../components/layout/PageContent";
import { ChamadaPaciente, painelColorRecord } from "./painel-model";
import { tittleCase } from "../../utils/utils";
import { ColorSquare } from "../../components/ColorSquare";
import { idToRiscoClassificacao } from "./painel-utils";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";
import { useEffect } from "react";
import { useConfig } from "../../provider/useConfig";

export default function PainelChamadasView() {
  const { config, serverUrl } = useConfig();

  const fontSize = config?.fontSize || 1;
  const theme = useTheme();
  const { speak } = useTextToSpeech();

  const { data: chamadaPaciente } = useWebSocket<ChamadaPaciente>(
    `${serverUrl}/ws`,
    "/topic/chamadaPaciente",
    "chamadaPaciente"
  );

  useEffect(() => {
    if (chamadaPaciente) {
      speak(chamadaPaciente?.nomePaciente, { volume: config?.voiceVolume });
    }
  }, [chamadaPaciente, config?.voiceVolume, speak]);

  const tipoServico = chamadaPaciente?.tipoServico?.join(" e ");

  return chamadaPaciente ? (
    <>
      <PageContent type="filled">
        <VFlow
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HFlow alignItems="center">
            <Text fontSize={fontSize * 3.6}>
              {tittleCase(chamadaPaciente?.nomePaciente)}
            </Text>
            <ColorSquare
              color={
                painelColorRecord[
                  idToRiscoClassificacao(chamadaPaciente.classificacao)
                ]
              }
              size={fontSize * 0.08}
            />
          </HFlow>
          <Text fontSize={fontSize * 2}>{tittleCase(tipoServico)}</Text>
        </VFlow>
      </PageContent>
      <div
        style={{
          width: "100vw",
          height: "0.1rem",
          backgroundColor: theme.pallete.gray.c70,
          margin: "2rem 0",
        }}
      />
      <VFlow>
        <Text fontSize={fontSize * 2} fontWeight="bold">
          Historico de chamadas
        </Text>
        {/* deve ficar tudo em um page container */}
        {chamadaPaciente?.historico.map((historico, index) => (
          <Grid tabIndex={index}>
            <Cell size={1}>
              <Text fontSize={fontSize}>
                {new Date(historico?.horario).toLocaleTimeString("pt-BR", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: undefined,
                })}
              </Text>
            </Cell>
            <Cell size={2}>
              <Text fontSize={fontSize} fontWeight="bold">
                {tittleCase(historico?.nomePaciente)}
              </Text>
            </Cell>
            <Cell size={2}>
              <ColorSquare
                color={
                  painelColorRecord[
                    idToRiscoClassificacao(historico.classificacao)
                  ]
                }
                size={fontSize * 0.03}
              />
            </Cell>
          </Grid>
        ))}
      </VFlow>
    </>
  ) : (
    <PageContent type="filled" style={{ marginTop: "25rem" }}>
      <VFlow
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text fontSize={fontSize * 0.8}>
          Sem dados a serem exibidos. Realize chamadas de pacientes.
        </Text>
      </VFlow>
    </PageContent>
  );
}

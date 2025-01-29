import { VFlow, Text, useTheme, HFlow, Grid, Cell } from "bold-ui";
import { PageContent } from "../../components/layout/PageContent";
import { ChamadaPaciente, painelColorRecord } from "./painel-model";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { tittleCase } from "../../utils/utils";
import { ColorSquare } from "../../components/ColorSquare";
import { idToRiscoClassificacao } from "./painel-utils";
import { getCache, setCache } from "./useCache";

export default function PainelChamadasView() {
  const fontSize = 2;
  const theme = useTheme();

  const savedChamadaPaciente = getCache<ChamadaPaciente>("chamadaPaciente");
  const [chamadaPaciente, setChamadaPaciente] = useState<
    ChamadaPaciente | undefined
  >(savedChamadaPaciente || undefined);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8081/ws/frontend");

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      stompClient.subscribe("/topic/frontendMessages", (message) => {
        const receivedMessage: ChamadaPaciente = JSON.parse(message.body);
        console.log(receivedMessage);
        setChamadaPaciente(receivedMessage);
        setCache("chamadaPaciente", receivedMessage);
      });
    };

    stompClient.activate();

    // TODO: Ainda em hardcode, mas será alterado para receber do backend
    stompClient.connectHeaders = {
      Authorization: `Bearer tokennnn`,
    };

    return () => {
      stompClient.deactivate();
    };
  }, []);

  // TODO: Revisar se esse & fica legal
  const tipoServico = chamadaPaciente?.tipoServico?.join(" & ");

  return chamadaPaciente ? (
    <>
      <PageContent type="filled" style={{ marginTop: "8rem" }}>
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
              multiplier={fontSize}
            />
          </HFlow>
          <Text fontSize={fontSize * 2}>{tittleCase(tipoServico)}</Text>
        </VFlow>
      </PageContent>
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: theme.pallete.gray.c70,
          margin: "16px 0",
        }}
      />
      <VFlow>
        <Text fontSize={fontSize * 2} fontWeight="bold">
          Historico de chamadas
        </Text>

        {chamadaPaciente?.historico.map((historico, index) => (
          <Grid tabIndex={index}>
            <Cell size={1}>
              <Text fontSize={fontSize}>
                {new Date(historico?.horario).toLocaleTimeString("pt-BR", {
                  hour12: false,
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
                multiplier={fontSize * 0.4}
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

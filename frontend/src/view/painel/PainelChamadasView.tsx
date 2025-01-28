import { VFlow, Text, useTheme, HFlow } from "bold-ui";
import { PageContent } from "../../components/layout/PageContent";
import { ColorSquare } from "../../components/ColorSquare";
import { ChamadaPaciente, painelColorRecord } from "./painel-model";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { capitalize } from "../../utils/utils";

export default function PainelChamadasView() {
  const fontSize = 2;
  const theme = useTheme();
  // TODO: Ainda em hardcode, mas será alterado para receber do backend
  const historico = ["Chamada 1", "Chamada 2", "Chamada 3", "Chamada 4"];
  const horarios = ["10:00", "10:30", "11:00", "11:30"];

  const [chamadaPaciente, setChamadaPaciente] = useState<ChamadaPaciente>();

  useEffect(() => {
    const socket = new SockJS("http://localhost:8081/ws/frontend");

    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      stompClient.subscribe("/topic/frontendMessages", (message) => {
        const receivedMessage: ChamadaPaciente = JSON.parse(message.body);
        setChamadaPaciente(receivedMessage);
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

  return (
    <>
      <PageContent type="filled" style={{ marginTop: "5rem" }}>
        <VFlow
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HFlow alignItems="center">
            <Text fontSize={fontSize * 4.5}>
              {capitalize(chamadaPaciente?.nomePaciente)}
            </Text>
            {/* TODO: REMOVER ALTERAR DEPOIS ESSE PAINEL COLOR */}
            {/* <ColorSquare color={painelColorRecord[1]} multiplier={2.5} /> */}
          </HFlow>
          <Text fontSize={fontSize * 1.5}>
            {chamadaPaciente?.classificacao}
          </Text>
          <Text fontSize={fontSize * 2}>{chamadaPaciente?.sala}</Text>
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

        {historico.map((chamada, index) => (
          <HFlow hSpacing={2.2} key={index}>
            <Text fontSize={fontSize}>{horarios[index]}</Text>
            <Text fontSize={fontSize} fontWeight="bold">
              {chamada}
            </Text>
            <ColorSquare color={painelColorRecord[1]} multiplier={1} />
          </HFlow>
        ))}
      </VFlow>
    </>
  );
}

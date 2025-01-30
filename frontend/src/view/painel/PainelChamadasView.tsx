import { VFlow, Text, useTheme, HFlow } from "bold-ui";
import { PageContent } from "../../components/layout/PageContent";
import { ColorSquare } from "../../components/ColorSquare";
import { painelColorRecord } from "./painel-model";

export default function PainelChamadasView() {
  // Tudo em hardcoded, ate ter as informacoes persistidas no banco
  const fontSize = 2;
  const theme = useTheme();
  const historico = ["Chamada 1", "Chamada 2", "Chamada 3", "Chamada 4"];
  const horarios = ["10:00", "10:30", "11:00", "11:30"];
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
            <Text fontSize={fontSize * 4.5}>Rick Sanches</Text>
            <ColorSquare color={painelColorRecord[3]} multiplier={2.5} />
          </HFlow>
          <Text fontSize={fontSize * 1.5}>Classificacao de Risco</Text>
          <Text fontSize={fontSize * 2}>Sala 2</Text>
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
          <HFlow hSpacing={2.2}>
            <Text key={index} fontSize={fontSize}>
              {horarios[index]}
            </Text>
            <Text key={index} fontSize={fontSize} fontWeight="bold">
              {chamada}
            </Text>
            <ColorSquare color={painelColorRecord[1]} multiplier={1} />
          </HFlow>
        ))}
      </VFlow>
    </>
  );
}

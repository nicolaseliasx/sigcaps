import { Button, HFlow, Text, TextField, VFlow } from "bold-ui";
import { PageContent } from "../../components/layout/PageContent";
import { Box } from "../../components/layout/Box";
import { useState } from "react";
import { Config } from "./config-model";
import { useWebSocket } from "../../hooks/useWebSocket";
import { getCache } from "../../hooks/useCache";
import { TokenGenerator } from "../../components/TokenGenerator";

interface ConfiguracoesViewProps {
  serverUrl: string;
}

export function ConfiguracoesView({ serverUrl }: ConfiguracoesViewProps) {
  // TODO: Ele nao ta dando refetch quando atualiza
  const config = getCache<Config>("appConfig");
  const [inputUrl, setInputUrl] = useState(config?.serverAddrs || "");
  const [inputVoice, setInputVoice] = useState(config?.voiceVolume || "");
  const [inputFont, setInputFont] = useState(config?.fontSize || "");
  const [nomeInstalacao, setNomeInstalacao] = useState(
    config?.nomeInstalacao || ""
  );

  const { sendMessage } = useWebSocket();

  const handleSubmit = () => {
    // TODO: Validar os inputs / devem ser preenchidos / aviso de sucesso caso isConnection for verdadeiro
    sendMessage("/app/config/save", {
      nomeInstalacao: nomeInstalacao,
      fontSize: inputFont,
      serverAddrs: inputUrl,
      voiceVolume: inputVoice,
    });
    // posso dar um reload na pagina aqui e enviar um aviso talvez
  };

  return (
    <>
      <PageContent type="filled">
        <Text fontSize={1.5} fontWeight="bold">
          Configurações da instalação
        </Text>

        <Box style={{ marginTop: "1rem" }}>
          <VFlow>
            <HFlow
              style={{ justifyContent: "space-between", marginTop: "1rem" }}
            >
              <Box>
                <VFlow>
                  <Text fontSize={1.2} fontWeight="bold">
                    Nome da Instalacao
                  </Text>
                  <TextField
                    placeholder="Ex: Unidade Saude 1"
                    value={nomeInstalacao}
                    onChange={(e) => setNomeInstalacao(e.target.value)}
                    clearable={false}
                  />
                </VFlow>
              </Box>
              <Box>
                <VFlow>
                  <Text fontSize={1.2} fontWeight="bold">
                    URL do Servidor
                  </Text>
                  <TextField
                    placeholder="Ex: http://meuservidor.com:8080"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    clearable={false}
                  />
                </VFlow>
              </Box>
              <Box>
                <VFlow>
                  <Text fontSize={1.2} fontWeight="bold">
                    Tamanho da fonte
                  </Text>
                  <TextField
                    placeholder="1 a 100"
                    value={inputFont}
                    onChange={(e) => setInputFont(e.target.value)}
                    clearable={false}
                  />
                </VFlow>
              </Box>
              <Box>
                <VFlow>
                  <Text fontSize={1.2} fontWeight="bold">
                    Volume do leitor de voz
                  </Text>
                  <TextField
                    placeholder="1 a 100"
                    value={inputVoice}
                    onChange={(e) => setInputVoice(e.target.value)}
                    clearable={false}
                  />
                </VFlow>
              </Box>
            </HFlow>
            <Box style={{ marginTop: "2rem" }}>
              <TokenGenerator serverUrl={serverUrl} />
            </Box>
            <Button onClick={handleSubmit}>Salvar</Button>
          </VFlow>
        </Box>
      </PageContent>
    </>
  );
}

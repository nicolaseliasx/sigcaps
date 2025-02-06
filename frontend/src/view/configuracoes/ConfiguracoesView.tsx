import { Button, HFlow, Text, TextField, VFlow } from "bold-ui";
import { PageContent } from "../../components/layout/PageContent";
import { Box } from "../../components/layout/Box";
import { useState } from "react";
import { Config } from "./config-model";
import { useWebSocket } from "../../hooks/useWebSocket";
import { getCache } from "../../hooks/useCache";
import { TokenGenerator } from "./components/TokenGenerator";
import { validateConfig, ValidationErrors } from "./config-validator";
import { useAlert } from "../../hooks/useAlert";

interface ConfiguracoesViewProps {
  serverUrl: string;
}

export function ConfiguracoesView({ serverUrl }: ConfiguracoesViewProps) {
  const { data: config } = useWebSocket<Config>(
    `${serverUrl}/ws`,
    "/topic/config/load",
    "appConfig"
  );

  const appConfig = getCache<Config>("appConfig") || config;
  const [inputUrl, setInputUrl] = useState(appConfig?.serverAddrs || "");
  const [inputVoice, setInputVoice] = useState(appConfig?.voiceVolume || "");
  const [inputFont, setInputFont] = useState(appConfig?.fontSize || "");
  const [nomeInstalacao, setNomeInstalacao] = useState(
    appConfig?.nomeInstalacao || ""
  );

  const { alert, AlertRenderer } = useAlert();

  const [errors, setErrors] = useState<ValidationErrors>({});

  const { sendMessage } = useWebSocket();

  const handleSubmit = () => {
    const validationErrors = validateConfig({
      nomeInstalacao,
      inputUrl,
      inputFont,
      inputVoice,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    sendMessage("/app/config/save", {
      nomeInstalacao: nomeInstalacao,
      fontSize: inputFont,
      serverAddrs: inputUrl,
      voiceVolume: inputVoice,
    });

    alert("success", "Configurações salvas com sucesso!");
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
                    Nome da Instalação
                  </Text>
                  <TextField
                    placeholder="Ex: Unidade Saude 1"
                    value={nomeInstalacao}
                    onChange={(e) => setNomeInstalacao(e.target.value)}
                    clearable={false}
                    error={errors.nomeInstalacao}
                  />
                </VFlow>
              </Box>
              <Box>
                <VFlow>
                  <Text fontSize={1.2} fontWeight="bold">
                    URL do Servidor
                  </Text>
                  <TextField
                    placeholder="Ex: http://127.0.0.1:8080"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    clearable={false}
                    error={errors.inputUrl}
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
                    error={errors.inputFont}
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
                    error={errors.inputVoice}
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
        <AlertRenderer />
      </PageContent>
    </>
  );
}

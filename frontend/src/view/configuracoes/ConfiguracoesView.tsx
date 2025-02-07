import { Button, HFlow, Text, TextField, VFlow } from "bold-ui";
import { PageContent } from "../../components/layout/PageContent";
import { Box } from "../../components/layout/Box";
import { useState } from "react";
import { Config } from "./config-model";
import { getCache } from "../../hooks/useCache";
import { TokenGenerator } from "./components/TokenGenerator";
import { validateConfig, ValidationErrors } from "./config-validator";
import { useAlert } from "../../hooks/useAlert";
import { ServerUrlConfig } from "./components/ServerUrlConfig";
import { useConfig } from "../../provider/useConfig";

export function ConfiguracoesView() {
  const { config, setConfig, serverUrl, token } = useConfig();

  const appConfig = getCache<Config>("appConfig") || config;
  const [inputUrl, setInputUrl] = useState(appConfig?.serverAddrs || "");
  const [inputVoice, setInputVoice] = useState(appConfig?.voiceVolume || "");
  const [inputFont, setInputFont] = useState(appConfig?.fontSize || "");
  const [nomeInstalacao, setNomeInstalacao] = useState(
    appConfig?.nomeInstalacao || ""
  );

  const { alert, AlertRenderer } = useAlert();

  const [errors, setErrors] = useState<ValidationErrors>({});

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

    setConfig({
      nomeInstalacao: nomeInstalacao,
      fontSize: Number(inputFont),
      voiceVolume: Number(inputVoice),
      serverAddrs: inputUrl,
    });

    handleSaveConfig(serverUrl, {
      nomeInstalacao: nomeInstalacao,
      fontSize: Number(inputFont),
      voiceVolume: Number(inputVoice),
      serverAddrs: inputUrl,
    });
  };

  const handleSaveConfig = async (serverUrl: string, config: Config) => {
    try {
      const response = await fetch(`${serverUrl}/api/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setErrors({});
        alert("success", "Configurações salvas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert("danger", "Erro ao salvar configurações");
    }
  };

  return (
    <PageContent type="filled" fluid>
      <Text fontSize={1.5} fontWeight="bold">
        Configurações da instalação
      </Text>

      <Box style={{ marginTop: "1rem" }}>
        <VFlow>
          <HFlow style={{ justifyContent: "space-between", marginTop: "1rem" }}>
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
          <VFlow>
            <Box>
              <ServerUrlConfig initialValue={inputUrl} onChange={setInputUrl} />
            </Box>
            <Box>
              <TokenGenerator serverUrl={serverUrl} />
            </Box>
          </VFlow>

          <Button onClick={handleSubmit}>Salvar</Button>
        </VFlow>
      </Box>
      <AlertRenderer />
    </PageContent>
  );
}

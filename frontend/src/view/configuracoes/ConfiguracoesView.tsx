import { Button, Text, TextField, VFlow } from "bold-ui";
import { PageContent } from "../../components/layout/PageContent";
import { Box } from "../../components/layout/Box";
import { useState } from "react";
import { ChangeCredentials, Config } from "./config-model";
import { getCache } from "../../hooks/useCache";
import { TokenGenerator } from "./components/TokenGenerator";
import { validateConfig, ValidationErrors } from "./config-validator";
import { useAlert } from "../../hooks/useAlert";
import { ServerUrlConfig } from "./components/ServerUrlConfig";
import { useConfig } from "../../provider/useConfig";
import { ModalAlterarCredenciais } from "./components/ModalAlterarCredenciais";
import { useFontScale } from "../../hooks/useFontScale";

export function ConfiguracoesView() {
  const { config, setConfig, serverUrl, token } = useConfig();

  const fontSizes = useFontScale(config?.fontSize || 1);

  const appConfig = getCache<Config>("appConfig") || config;
  const [inputUrl, setInputUrl] = useState(appConfig?.serverAddrs || "");
  const [inputVoice, setInputVoice] = useState(appConfig?.voiceVolume || "");
  const [inputFont, setInputFont] = useState(appConfig?.fontSize || "");
  const [nomeInstalacao, setNomeInstalacao] = useState(
    appConfig?.nomeInstalacao || ""
  );

  const { alert, AlertRenderer } = useAlert();

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [errorsChangeUser, setErrorsChangeUser] = useState<string>("");

  const [openModalCredenciais, setOpenModalCredenciais] =
    useState<boolean>(false);

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

  const handleSaveCredenciais = async (
    changeCredentials: ChangeCredentials
  ) => {
    try {
      const response = await fetch(`${serverUrl}/api/auth/change`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(changeCredentials),
      });

      console.log("response", response);

      if (response.ok) {
        setErrorsChangeUser("");
        setOpenModalCredenciais(false);
        alert("success", "Novas credenciais salvas com sucesso!");
      }

      if (response.status === 401) {
        setErrorsChangeUser("Credenciais inválidas");
        alert("danger", "Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro ao salvar as novas credenciais:", error);
      alert("danger", "Erro ao salvar as novas credenciais");
    }
  };

  return (
    <PageContent type="filled" fluid>
      <Box>
        <Text fontSize={fontSizes.base} fontWeight="bold">
          Configurações da instalação
        </Text>
        <VFlow style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
            <Box style={{ flex: 1 }}>
              <Text fontSize={fontSizes.xsmall} fontWeight="bold">
                Nome da Instalação
              </Text>
              <TextField
                placeholder="Ex: Unidade Saude 1"
                value={nomeInstalacao}
                onChange={(e) => setNomeInstalacao(e.target.value)}
                clearable={false}
                error={errors.nomeInstalacao}
                style={{ fontSize: `${fontSizes.xsmall}rem` }}
              />
            </Box>
            <Box style={{ flex: 1 }}>
              <Text fontSize={fontSizes.xsmall} fontWeight="bold">
                Tamanho da fonte
              </Text>
              <TextField
                placeholder="1 a 100"
                value={inputFont}
                onChange={(e) => setInputFont(e.target.value)}
                clearable={false}
                error={errors.inputFont}
                style={{ fontSize: `${fontSizes.xsmall}rem` }}
              />
            </Box>
          </div>
          <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
            <Box style={{ flex: 1 }}>
              <Text fontSize={fontSizes.xsmall} fontWeight="bold">
                Volume do leitor de voz
              </Text>
              <TextField
                placeholder="1 a 100"
                value={inputVoice}
                onChange={(e) => setInputVoice(e.target.value)}
                clearable={false}
                error={errors.inputVoice}
                style={{ fontSize: `${fontSizes.xsmall}rem` }}
              />
            </Box>
            <Box style={{ flex: 1 }}>
              <VFlow>
                <Text fontSize={fontSizes.xsmall} fontWeight="bold">
                  Credenciais de acesso
                </Text>
                <Button
                  size="small"
                  onClick={() => setOpenModalCredenciais(true)}
                >
                  <Text fontSize={fontSizes.xsmall}>
                    Alterar credenciais de acesso
                  </Text>
                </Button>
                <ModalAlterarCredenciais
                  isModalOpen={openModalCredenciais}
                  onClose={() => {
                    setOpenModalCredenciais(false);
                    setErrorsChangeUser("");
                  }}
                  onSubmit={handleSaveCredenciais}
                  errors={errorsChangeUser}
                />
              </VFlow>
            </Box>
          </div>

          <VFlow>
            <Box>
              <ServerUrlConfig initialValue={inputUrl} onChange={setInputUrl} />
            </Box>
            <Box>
              <TokenGenerator serverUrl={serverUrl} />
            </Box>
          </VFlow>

          <Button onClick={handleSubmit}>
            <Text fontSize={fontSizes.xsmall}>Salvar</Text>
          </Button>
        </VFlow>
      </Box>
      <AlertRenderer />
    </PageContent>
  );
}

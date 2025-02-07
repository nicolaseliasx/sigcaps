import { Button, Text, Tooltip, VFlow } from "bold-ui";
import { useState, useEffect } from "react";
import { PageContent } from "../../components/layout/PageContent";
import { Box } from "../../components/layout/Box";
import { TokenGenerator } from "./components/TokenGenerator";
import { ServerUrlConfig } from "./components/ServerUrlConfig";
import { useAlert } from "../../hooks/useAlert";

interface InitialConfigViewProps {
  setServerUrl: (url: string) => void;
}

export function InitialConfigView({ setServerUrl }: InitialConfigViewProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [hasConnection, setHasConnection] = useState(false);

  const { alert, AlertRenderer } = useAlert();

  useEffect(() => {
    const storedUrl = localStorage.getItem("serverUrl");
    if (storedUrl) {
      setServerUrl(storedUrl);
    }
  }, [setServerUrl]);

  const handleSaveUrl = async () => {
    const serverUrl = inputUrl.trim();
    if (serverUrl) {
      localStorage.setItem("serverUrl", serverUrl);
      setServerUrl(serverUrl);
      handleGetConfig(serverUrl);
    }
  };

  const handleGetConfig = async (serverUrl: string) => {
    try {
      const response = await fetch(`${serverUrl}/api/config`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("appConfig", JSON.stringify(data));

        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao configurações:", error);
      alert("danger", "Erro ao configurações");
    }
  };

  return (
    <PageContent type="filled">
      <VFlow>
        <Text fontSize={1.5} fontWeight="bold">
          Configuração inicial da instalação
        </Text>
        <Box>
          <Box>
            <ServerUrlConfig
              initialValue={inputUrl}
              onChange={setInputUrl}
              setHasConnection={setHasConnection}
            />
          </Box>
          <Box style={{ marginTop: "2rem" }}>
            <TokenGenerator serverUrl={inputUrl} setHasToken={setHasToken} />
          </Box>
          <Tooltip text="Para salvar as Configurações Iniciais do servidor, é necessário ter um token de autenticação e uma conexão bem sucedida.">
            <Button
              onClick={handleSaveUrl}
              disabled={inputUrl === "" || !hasToken || !hasConnection}
              style={{ marginTop: "1rem" }}
            >
              Salvar
            </Button>
          </Tooltip>
        </Box>
      </VFlow>
      <AlertRenderer />
    </PageContent>
  );
}

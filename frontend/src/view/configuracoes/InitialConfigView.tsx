import { TextField, Button, Text, VFlow } from "bold-ui";
import { useState, useEffect } from "react";
import { PageContent } from "../../components/layout/PageContent";
import { Box } from "../../components/layout/Box";
import { TokenGenerator } from "./components/TokenGenerator";
import { urlValidator } from "./config-validator";

interface InitialConfigViewProps {
  setServerUrl: (url: string) => void;
}

export function InitialConfigView({ setServerUrl }: InitialConfigViewProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [urlErros, setUrlErros] = useState("");

  useEffect(() => {
    const storedUrl = localStorage.getItem("serverUrl");
    if (storedUrl) {
      setServerUrl(storedUrl);
    }
  }, [setServerUrl]);

  const handleSaveUrl = () => {
    // TODO: ESSE FLUXO TA BEM RUIM REVISAR
    const hasUrlError = urlValidator(inputUrl);
    if (hasUrlError) {
      setUrlErros(hasUrlError);
      return;
    }

    const serverUrl = inputUrl.trim();
    if (serverUrl) {
      localStorage.setItem("serverUrl", serverUrl);
      setServerUrl(serverUrl);
    }
  };

  return (
    <PageContent type="filled">
      <VFlow>
        <Text fontSize={1.5} fontWeight="bold">
          Configuração inicial da instalação
        </Text>
        <Box style={{ marginTop: "1rem" }}>
          <Box>
            <VFlow>
              <Text fontSize={1.2} fontWeight="bold">
                Configuração do Servidor
              </Text>
              <Text fontSize={1}>URL do Servidor </Text>
              <TextField
                placeholder="Ex: http://127.0.0.1:8080"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                clearable={false}
                style={{ maxWidth: "30rem" }}
                error={urlErros}
              />
            </VFlow>
          </Box>
          <Box style={{ marginTop: "2rem" }}>
            <TokenGenerator serverUrl={inputUrl} />
          </Box>
          {/* falta condicional do token */}
          <Button
            onClick={handleSaveUrl}
            disabled={inputUrl === ""}
            style={{ marginTop: "1rem" }}
          >
            Salvar
          </Button>
        </Box>
      </VFlow>
    </PageContent>
  );
}

import { TextField, Button, Text, VFlow } from "bold-ui";
import { useState, useEffect } from "react";
import { PageContent } from "../../components/layout/PageContent";
import { Box } from "../../components/layout/Box";

interface InitialConfigViewProps {
  setServerUrl: (url: string) => void;
}

export function InitialConfigView({ setServerUrl }: InitialConfigViewProps) {
  const [inputUrl, setInputUrl] = useState("");

  useEffect(() => {
    const storedUrl = localStorage.getItem("serverUrl");
    if (storedUrl) {
      setServerUrl(storedUrl);
    }
  }, [setServerUrl]);

  const handleSaveUrl = () => {
    // TODO: Validar URL
    const serverUrl = inputUrl.trim();
    if (serverUrl) {
      localStorage.setItem("serverUrl", serverUrl);
      setServerUrl(serverUrl);
    }
  };

  return (
    <PageContent type="filled">
      <Box>
        <VFlow>
          <Text fontSize={1.5} fontWeight="bold">
            Configuração do Servidor
          </Text>
          <Text fontSize={1.2}>URL do Servidor </Text>
          <TextField
            placeholder="Ex: http://127.0.0.1:8080"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            clearable={false}
            style={{ maxWidth: "30rem" }}
          />
          <Button onClick={handleSaveUrl} disabled={inputUrl === ""}>
            Salvar
          </Button>
        </VFlow>
      </Box>
    </PageContent>
  );
}

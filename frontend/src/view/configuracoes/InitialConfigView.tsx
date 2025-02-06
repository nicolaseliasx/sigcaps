import { TextField, Button, Text, Grid, Cell } from "bold-ui";
import { useState, useEffect } from "react";
import { PageContent } from "../../components/layout/PageContent";

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
      <Grid>
        <Cell size={12}>
          <Text fontSize={1.5} fontWeight="bold">
            Configuração do Servidor
          </Text>
        </Cell>
        <Cell size={12}>
          <Text fontSize={1.2}>URL do Servidor</Text>
        </Cell>
        <Cell size={6}>
          {/* TODO: revisar esse placeholder */}
          <TextField
            placeholder="Ex: http://meuservidor.com:8080"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            clearable={false}
          />
        </Cell>
        <Cell size={6} />
        <Cell size={12}>
          <Button onClick={handleSaveUrl}>Salvar</Button>
        </Cell>
      </Grid>
    </PageContent>
  );
}

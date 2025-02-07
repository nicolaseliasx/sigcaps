import { useState } from "react";
import { TextField, Text, VFlow, Button, HFlow, Tag } from "bold-ui";
import { urlValidator } from "../config-validator";
import { useAlert } from "../../../hooks/useAlert";

interface ServerUrlConfigProps {
  initialValue: string;
  onChange: (url: string) => void;
  setHasConnection?: (has: boolean) => void;
}

export function ServerUrlConfig({
  initialValue,
  onChange,
  setHasConnection,
}: ServerUrlConfigProps) {
  const { alert, AlertRenderer } = useAlert();

  const [inputUrl, setInputUrl] = useState(initialValue);
  const [urlErrors, setUrlErrors] = useState("");
  const [conection, setConection] = useState("");

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setInputUrl(newUrl);
    const error = urlValidator(newUrl);
    setUrlErrors(error);
    onChange(newUrl);
  };

  const handleTestConnection = async () => {
    try {
      const response = await fetch(`${inputUrl}/api/health/status`, {
        method: "GET",
      });
      await response;

      if (response.ok) {
        if (setHasConnection) setHasConnection(true);
        setConection("sucesso");
        alert("success", "Conexão bem sucessida");
      } else {
        setConection("falha");
        alert("danger", "Conexão falhou");
      }
    } catch (error) {
      console.error("Conexão falhou:", error);
      setConection("falha");
      alert("danger", "Conexão falhou");
    }
  };

  return (
    <VFlow>
      <Text fontSize={1.2} fontWeight="bold">
        Configuração do Servidor
      </Text>
      <Text fontSize={1}>URL do Servidor</Text>
      <TextField
        placeholder="Ex: http://127.0.0.1:8080"
        value={inputUrl}
        onChange={handleUrlChange}
        clearable={false}
        style={{ maxWidth: "30rem" }}
        error={urlErrors}
      />

      <HFlow>
        <Button size="small" onClick={handleTestConnection}>
          Testar conexão
        </Button>
        {conection == "falha" && (
          <Tag type="danger">
            <Text color="inherit">Conexão falhou</Text>
          </Tag>
        )}
        {conection == "sucesso" && (
          <Tag type="success">
            <Text color="inherit">Conexão bem sucessida</Text>
          </Tag>
        )}
      </HFlow>

      <AlertRenderer />
    </VFlow>
  );
}

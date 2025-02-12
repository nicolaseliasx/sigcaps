import { useState } from "react";
import { TextField, Text, VFlow, Button, HFlow, Icon } from "bold-ui";
import { urlValidator } from "../config-validator";
import { useAlert } from "../../../hooks/useAlert";
import { useFontScale } from "../../../hooks/useFontScale";
import { useConfig } from "../../../provider/useConfig";

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

  const { config } = useConfig();
  const fontSizes = useFontScale(config?.fontSize || 1);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setInputUrl(newUrl);
    const error = urlValidator(newUrl);
    setUrlErrors(error);
    onChange(newUrl);
  };

  const handleTestConnection = async () => {
    try {
      if (inputUrl == "") {
        setUrlErrors("URL do servidor não pode ser vazia.");
        alert("danger", "URL do servidor não pode ser vazia.");
        return;
      }
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
        alert("danger", "Conexão mal sucedida.");
      }
    } catch (error) {
      console.error("Conexão mal sucedida:", error);
      setConection("falha");
      alert("danger", "Conexão mal sucedida.");
    }
  };

  return (
    <VFlow>
      <Text fontSize={fontSizes.small} fontWeight="bold">
        Configuração do Servidor
      </Text>
      <Text fontSize={fontSizes.xsmall}>URL do Servidor</Text>
      {/* PROBLEMA RELACIONADO AO TAMANHO DA FONTE DOS ERRORS NAO CONSEGUI PASSAR STYLE VER CM ANDRÉ*/}
      <TextField
        placeholder="Ex: http://127.0.0.1:8080"
        value={inputUrl}
        onChange={handleUrlChange}
        clearable={false}
        style={{
          maxWidth: "50%",
          fontSize: `${fontSizes.xsmall}rem`,
        }}
        error={urlErrors}
      />

      <HFlow>
        <Button size="small" onClick={handleTestConnection}>
          <Text fontSize={fontSizes.xsmall}>Testar conexão com servidor</Text>
        </Button>
        {conection == "falha" && (
          <HFlow alignItems="center">
            <Icon icon="banOutline" fill="danger" size={fontSizes.xsmall} />
            <Text
              color="danger"
              style={{ margin: -8 }}
              fontSize={fontSizes.xsmall}
            >
              Conexão mal sucedida.
            </Text>
          </HFlow>
        )}
        {conection == "sucesso" && (
          <HFlow alignItems="center">
            <Icon
              icon="checkCircleOutline"
              fill="success"
              size={fontSizes.xsmall}
            />
            <Text
              color="success"
              style={{ margin: -8 }}
              fontSize={fontSizes.xsmall}
            >
              Conexão bem sucedida.
            </Text>
          </HFlow>
        )}
      </HFlow>

      <AlertRenderer />
    </VFlow>
  );
}

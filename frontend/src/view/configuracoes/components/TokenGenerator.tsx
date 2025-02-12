import {
  VFlow,
  Text,
  HFlow,
  Tooltip,
  Icon,
  TextField,
  Button,
  Tag,
} from "bold-ui";
import { Box } from "../../../components/layout/Box";
import { useState } from "react";
import { useAlert } from "../../../hooks/useAlert";
import { urlValidator } from "../config-validator";
import { useConfig } from "../../../provider/useConfig";
import { useFontScale } from "../../../hooks/useFontScale";

interface TokenGeneratorProps {
  serverUrl: string;
  setHasToken?: (has: boolean) => void;
}

export function TokenGenerator({
  serverUrl,
  setHasToken,
}: TokenGeneratorProps) {
  const { token, setToken } = useConfig();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [credentialsError, setCredentialsError] = useState("");

  const [urlErros, setUrlErros] = useState("");

  const { alert, AlertRenderer } = useAlert();

  const { config } = useConfig();
  const fontSizes = useFontScale(config?.fontSize || 1);

  const handleGenerateToken = async () => {
    if (!user || !password) {
      return;
    }

    const hasUrlError = urlValidator(serverUrl);
    if (hasUrlError) {
      setUrlErros(hasUrlError);
      return;
    } else {
      setUrlErros("");
    }

    try {
      const response = await fetch(`${serverUrl}/api/auth/generateToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: user,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        setToken(data.token);
        if (setHasToken) setHasToken(data.token);
        setCredentialsError("");
        alert("success", "Chave gerado com sucesso");
        setUser("");
        setPassword("");
      } else {
        setCredentialsError("Usuario ou senha inválidos");
        alert("danger", "Credenciais inválidas");
      }
    } catch (error) {
      console.log("Erro ao gerar chave:", error);
      console.error("Erro ao gerar chave:", error);
      alert("danger", "Erro ao gerar chave");
    }
  };

  return (
    <VFlow>
      <HFlow>
        <Text fontSize={fontSizes.small} fontWeight="bold">
          Configurações autenticação{" "}
          <Tooltip text="Uma chave de autenticação é uma credencial gerada pelo servidor para identificar e autorizar usuários em requisições.">
            <Icon icon="infoCircleFilled" size={1} />
          </Tooltip>
        </Text>
        {urlErros && (
          <Tag type="danger">
            <Text color="inherit" fontSize={fontSizes.xsmall}>
              {urlErros}
            </Text>
          </Tag>
        )}
      </HFlow>
      <HFlow hSpacing={2}>
        <VFlow vSpacing={0}>
          <Text fontSize={fontSizes.xsmall} fontWeight="bold">
            Usuario
          </Text>
          <TextField
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            clearable={false}
            error={credentialsError}
            disabled={token !== ""}
            style={{ fontSize: `${fontSizes.xsmall}rem` }}
          />
        </VFlow>
        <VFlow vSpacing={0}>
          <Text fontSize={fontSizes.xsmall} fontWeight="bold">
            Senha
          </Text>
          <TextField
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            clearable={false}
            type="password"
            error={credentialsError ? " " : undefined}
            disabled={token !== ""}
            style={{ fontSize: `${fontSizes.xsmall}rem` }}
          />
        </VFlow>
        <Box>
          <HFlow>
            <Text fontSize={fontSizes.xsmall} fontWeight="bold">
              Status da chave:
            </Text>
            {token ? (
              <Tag type="success" icon="checkCircleFilled">
                <Text color="inherit" fontSize={fontSizes.xsmall}>
                  Chave registrada
                </Text>
              </Tag>
            ) : (
              <Tag icon="banFilled">
                <Text color="inherit" fontSize={fontSizes.xsmall}>
                  Chave não registrada
                </Text>
              </Tag>
            )}
          </HFlow>
        </Box>
      </HFlow>
      <Tooltip
        text={
          token !== null
            ? "Já existe um token registrado. Não é necessário gerá-lo novamente."
            : "Para gerar um token de autenticação, é necessário preencher os campos de usuário e senha."
        }
      >
        <Button
          size="small"
          kind="primary"
          onClick={handleGenerateToken}
          disabled={user === "" || password === "" || token !== ""}
        >
          <Text fontSize={fontSizes.xsmall} style={{ color: "white" }}>
            Gerar chave
          </Text>
        </Button>
      </Tooltip>
      <AlertRenderer />
    </VFlow>
  );
}

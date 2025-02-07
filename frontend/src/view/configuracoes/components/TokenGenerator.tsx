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
      const response = await fetch(`${serverUrl}/api/auth/login`, {
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
        alert("success", "Token gerado com sucesso");
      } else {
        setCredentialsError("Usuario ou senha inválidos");
        alert("danger", "Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro ao gerar token:", error);
      alert("danger", "Erro ao gerar token");
    }
  };

  return (
    <VFlow>
      <HFlow>
        <Text fontSize={1.2} fontWeight="bold">
          Configurações token{" "}
          <Tooltip text="Um token de autenticação é uma credencial gerada pelo servidor para identificar e autorizar usuários em requisições.">
            <Icon icon="infoCircleFilled" size={1} />
          </Tooltip>
        </Text>
        {urlErros && (
          <Tag type="danger">
            <Text color="inherit">{urlErros}</Text>
          </Tag>
        )}
      </HFlow>
      <HFlow hSpacing={2}>
        <VFlow>
          <Text fontSize={1} fontWeight="bold">
            Usuario
          </Text>
          <TextField
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            clearable={false}
            error={credentialsError}
          />
        </VFlow>
        <VFlow>
          <Text fontSize={1} fontWeight="bold">
            Senha
          </Text>
          <TextField
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            clearable={false}
            type="password"
            error={credentialsError ? " " : undefined}
          />
        </VFlow>
        <Box>
          <HFlow>
            <Text fontSize={1.2} fontWeight="bold">
              Status do token:
            </Text>
            {token ? (
              <Tag type="success" icon="checkCircleFilled">
                <Text color="inherit">Token registrado</Text>
              </Tag>
            ) : (
              <Tag icon="banFilled">
                <Text color="inherit">Token não registrado</Text>
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
          disabled={user === "" || password === "" || token !== null}
        >
          Gerar token
        </Button>
      </Tooltip>
      <AlertRenderer />
    </VFlow>
  );
}

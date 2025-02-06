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

interface TokenGeneratorProps {
  serverUrl: string;
}

export function TokenGenerator({ serverUrl }: TokenGeneratorProps) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [credentialsError, setCredentialsError] = useState("");
  const [token, setToken] = useState(localStorage.getItem("authToken"));

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
    }

    try {
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      <Button
        size="small"
        kind="primary"
        onClick={handleGenerateToken}
        disabled={user === "" || password === ""}
      >
        Gerar token
      </Button>
      <AlertRenderer />
    </VFlow>
  );
}

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
import { Box } from "./layout/Box";
import { useState } from "react";

interface TokenGeneratorProps {
  serverUrl: string;
}

export function TokenGenerator({ serverUrl }: TokenGeneratorProps) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  const handleGenerateToken = async () => {
    if (!user || !password) {
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
      } else {
        alert(data.mensagem || "Erro ao autenticar");
      }
    } catch (error) {
      console.error("Erro ao gerar token:", error);
    }
  };

  return (
    <VFlow>
      <Text fontSize={1.2} fontWeight="bold">
        Configurações token{" "}
        <Tooltip text="Um token de autenticação é uma credencial gerada pelo servidor para identificar e autorizar usuários em requisições.">
          <Icon icon="infoCircleFilled" size={1} />
        </Tooltip>
      </Text>
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
        disabled={user === "" || password === "" || token !== null}
      >
        Gerar token
      </Button>
    </VFlow>
  );
}

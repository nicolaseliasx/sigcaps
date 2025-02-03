import {
  Button,
  HFlow,
  Icon,
  Tag,
  Text,
  TextField,
  Tooltip,
  VFlow,
} from "bold-ui";
import { PageContent } from "../../components/layout/PageContent";
import { Box } from "../../components/layout/Box";
import { useState } from "react";
import { Config, Token } from "./config-model";
import { useWebSocket } from "../../hooks/useWebSocket";

interface ConfiguracoesViewProps {
  serverUrl: string;
}

export function ConfiguracoesView({ serverUrl }: ConfiguracoesViewProps) {
  const { data: config } = useWebSocket<Config>(
    `${serverUrl}/ws/frontend`,
    "/topic/config/load",
    "appConfig"
  );

  const { data, sendMessage } = useWebSocket<Token>(
    `${serverUrl}/ws/frontend`,
    "/user/queue/generateToken",
    "token"
  );

  const handleSubmit = () => {
    // TODO: Validar os inputs / devem ser preenchidos / aviso de sucesso caso isConnection for verdadeiro
    sendMessage("/app/config/save", {
      fontSize: inputFont,
      serverAddrs: inputUrl,
      voiceVolume: inputVoice,
    });
    // falta um aviso de sucesso
  };

  const handleGenerateToken = () => {
    sendMessage("/app/generateToken", {
      username: user,
      password: password,
    });
  };

  // TODO: Revisar os TextField ver se tem uma forma de fazer um input
  const [inputUrl, setInputUrl] = useState(config?.serverAddrs || "");
  const [inputVoice, setInputVoice] = useState(config?.voiceVolume || "");
  const [inputFont, setInputFont] = useState(config?.fontSize || "");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  console.log(data);

  return (
    <>
      <PageContent type="filled">
        <Text fontSize={1.5} fontWeight="bold">
          Configurações da instalação
        </Text>

        <Box style={{ marginTop: "1rem" }}>
          <VFlow>
            <HFlow>
              <Box>
                <VFlow>
                  <Text fontSize={1.2} fontWeight="bold">
                    Tamanho da fonte
                  </Text>
                  <TextField
                    placeholder="1 a 100"
                    value={inputFont}
                    onChange={(e) => setInputFont(e.target.value)}
                    clearable={false}
                  />
                </VFlow>
              </Box>
              <Box>
                <VFlow>
                  <Text fontSize={1.2} fontWeight="bold">
                    Volume do leitor de voz
                  </Text>
                  <TextField
                    placeholder="1 a 100"
                    value={inputVoice}
                    onChange={(e) => setInputVoice(e.target.value)}
                    clearable={false}
                  />
                </VFlow>
              </Box>
              <Box>
                <VFlow>
                  <Text fontSize={1.2} fontWeight="bold">
                    URL do Servidor
                  </Text>
                  <TextField
                    placeholder="Ex: http://meuservidor.com:8080"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    clearable={false}
                  />
                </VFlow>
              </Box>
            </HFlow>
            <Box>
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
                      {config !== null && config?.token !== null ? (
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
                  disabled={
                    user === "" || password === "" || config?.token !== null
                  }
                >
                  Gerar token
                </Button>
              </VFlow>
            </Box>
            <Button onClick={handleSubmit}>Salvar</Button>
          </VFlow>
        </Box>
      </PageContent>
    </>
  );
}

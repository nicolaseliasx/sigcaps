# Documentação da API do SIGCAPS

Bem-vindo à documentação da API do Sistema Inteligente de Gestão de Chamadas de Pacientes (SIGCAPS). Este guia ajudará você a entender como interagir com os recursos da API para integrar sua aplicação com o SIGCAPS.

## 1\. Visão Geral

O SIGCAPS (Sistema Inteligente de Gestão de Chamadas de Pacientes para Atenção Primária em Saúde) é uma solução computacional robusta e acessível, destinada a automatizar e otimizar o processo de chamada de pacientes em Unidades Básicas de Saúde (UBS). Seu objetivo principal é criar uma solução tecnológica para otimizar este processo, facilitando sua integração com sistemas como o Prontuário Eletrônico do Cidadão (PEC) e outros sistemas de gestão em saúde.

O sistema foi concebido com uma arquitetura moderna cliente-servidor, que emprega interfaces de programação de aplicações (APIs) RESTful para gerenciamento e configuração, e tecnologias de comunicação em tempo real (WebSockets) para suas funcionalidades dinâmicas de chamada de pacientes. O SIGCAPS efetiva a chamada automatizada de pacientes com exibição em painéis configuráveis e anúncios por leitura em voz alta, priorizando a acessibilidade e a inclusão.

Esta API permite que aplicações terceiras autenticadas:

* Enviem comandos para chamar pacientes.
* Gerenciem configurações do sistema SIGCAPS.

## 2\. Acessando a Documentação Interativa da API REST (Swagger UI)

A principal referência para os endpoints da API REST, seus parâmetros, e modelos de dados (DTOs) é a interface Swagger UI, que é gerada automaticamente pela aplicação SIGCAPS quando ela está em execução.

* **URL da Swagger UI:** `http://localhost:8081/swagger-ui.html`
    * *(Observação: Se você estiver executando a aplicação SIGCAPS em uma porta diferente da `8081` ou com um caminho de contexto específico (ex: `/sigcaps`), ajuste o URL conforme necessário. Por exemplo: `http://localhost:SUA_PORTA/SEU_CONTEXTO/swagger-ui.html`)*

Nesta interface interativa, você pode:

* Explorar todos os endpoints REST disponíveis (ex: para autenticação, configuração do sistema, health check).
* Ver os detalhes de cada endpoint, incluindo métodos HTTP (GET, POST, PUT), parâmetros obrigatórios e opcionais.
* Visualizar os esquemas dos DTOs (Data Transfer Objects) usados nas requisições e respostas.
* **Testar os endpoints diretamente pelo navegador**, o que é útil para verificar a conectividade e o formato esperado dos dados.

## 3\. Acessando a Especificação OpenAPI (JSON)

Para desenvolvedores ou ferramentas que necessitam da especificação técnica bruta da API REST em formato OpenAPI 3.0 (JSON), ela está disponível em:

* **URL da Especificação JSON:** `http://localhost:8081/v3/api-docs`
    * *(Observação: Ajuste a porta e o caminho de contexto, se aplicável, como mencionado acima.)*

## 4. Autenticação na API (Detalhado)

Para interagir com a maioria dos endpoints da API do SIGCAPS (exceto os endpoints públicos como os de documentação `/v3/api-docs/**`, `/swagger-ui/**` e o health check `/api/health/status`), uma aplicação terceira precisa se autenticar. O SIGCAPS utiliza um mecanismo de autenticação para garantir que apenas clientes autorizados possam enviar dados ou modificar configurações.

Este processo envolve uma chave de acesso inicial (`accessKey`), a geração de uma "contra-chave" (`clientSignature`) pela aplicação cliente, e, subsequentemente, a obtenção e uso de um Token JWT (JSON Web Token) para as requisições subsequentes.

**Fluxo de Autenticação para Aplicações Terceiras:**

1.  **Obtenção da `accessKey` Inicial:**

    * Na primeira inicialização do SIGCAPS, o sistema gera automaticamente uma `accessKey` única. Esta chave é armazenada de forma segura no banco de dados do SIGCAPS.
    * Um administrador do sistema SIGCAPS é responsável por obter esta `accessKey` (por exemplo, através de consulta direta ao banco de dados ou por um futuro mecanismo administrativo seguro) e fornecê-la à aplicação terceira que necessita de integração]. Esta chave é o primeiro segredo compartilhado.

2.  **Geração da `secretKey` Derivada (Implementado pela Aplicação Terceira):**

    * A aplicação terceira, de posse da `accessKey` original, deve gerar uma primeira chave secreta intermediária, referida como `secretKey` derivada.
    * **Algoritmo para gerar a `secretKey`:**
        * **Cálculo HMAC:** Utilize o algoritmo HMAC-SHA256.
        * **Dado a ser assinado (input para o HMAC):** É a concatenação da `accessKey` original com o sufixo estático `"-sigcaps"`. (Exemplo: Se a `accessKey` for `suaAccessKeyOriginal123`, o dado a ser assinado será `suaAccessKeyOriginal123-sigcaps`).
        * **Chave para a operação HMAC:** A própria `accessKey` original.
        * **Codificação do Resultado:** O resultado binário da assinatura HMAC-SHA256 deve ser codificado em Base64 URL-safe (sem padding) para formar a `secretKey` derivada.

3.  **Geração da `clientSignature` (Contra-Chave Final - Implementado pela Aplicação Terceira):**

    * Utilizando a `secretKey` derivada (gerada no passo anterior) como chave, a aplicação terceira deve calcular uma nova assinatura HMAC-SHA256. Esta segunda assinatura é a `clientSignature` final, ou "contra-chave".
    * **Algoritmo para gerar a `clientSignature`:**
        * **Cálculo HMAC:** Utilize o algoritmo HMAC-SHA256.
        * **Dado a ser assinado (input para o HMAC):** Uma string fixa, o desafio `SIGCAPS-AUTH`.
        * **Chave para a operação HMAC:** A `secretKey` derivada no passo anterior.
        * **Codificação do Resultado:** O resultado binário desta segunda assinatura HMAC-SHA256 também deve ser codificado em Base64 URL-safe (sem padding). O resultado é a `clientSignature`.

4.  **Obtenção do Token JWT:**

    * A aplicação terceira realiza uma requisição `POST` para o endpoint de autenticação do SIGCAPS: `/auth/authenticate`.
    * O corpo desta requisição deve conter a `clientSignature` gerada no passo anterior.
    * O `AuthController` do SIGCAPS recebe esta `clientSignature` e o `AuthService` valida se o cálculo está correto em relação à `accessKey` original armazenada.
    * Se a `clientSignature` for válida, o SIGCAPS (através do `TokenService`) gera um Token JWT e um `refreshToken`. Estes são retornados no corpo da resposta da requisição.

5.  **Usando o Token JWT:**

    * Após obter o Token JWT, a aplicação terceira deve incluí-lo em todas as suas requisições subsequentes aos endpoints protegidos do SIGCAPS.
    * O token JWT deve ser enviado no cabeçalho `Authorization` da requisição HTTP, precedido pelo esquema `Bearer`.
    * **Formato do Cabeçalho:** `Authorization: Bearer <SEU_TOKEN_JWT>`.
    * O `RestJwtFilter` do SIGCAPS interceptará essas requisições, validará o JWT (presença, formato e validade usando o `TokenService`), e configurará o contexto de segurança do Spring se o token for válido.
    * O mesmo JWT deve ser usado para autenticar conexões WebSocket, conforme detalhado na próxima seção.

<!-- end list -->

* **Renovação de Token:**
    * O JWT tem um tempo de expiração. Quando expirar, a aplicação terceira pode usar o `refreshToken` (obtido junto com o JWT inicial) para solicitar um novo par de JWT/refreshToken.
    * Para isso, deve-se fazer uma requisição ao endpoint `/auth/refresh`, enviando o `refreshToken`.

*Para detalhes exatos sobre os corpos de requisição e resposta dos endpoints `/auth/authenticate` e `/auth/refresh`, consulte a Swagger UI.*

## 5. Comunicação via WebSockets (STOMP)

O SIGCAPS utiliza WebSockets, com o protocolo STOMP (Simple Text Oriented Messaging Protocol) como uma camada de subprotocolo, para facilitar a comunicação em tempo real. Isso é fundamental para a funcionalidade de chamada de pacientes, assegurando que os painéis de exibição (front-end do SIGCAPS) e outros clientes interessados recebam atualizações instantaneamente.

### 5.1 Endpoint de Conexão WebSocket

* **URL para Conexão Inicial:** As aplicações cliente devem estabelecer uma conexão WebSocket com o servidor SIGCAPS no seguinte endpoint:
    * `/ws`
    * **Exemplo de URL completa:** `ws://localhost:8081/ws`

### 5.2 Autenticação na Conexão WebSocket

* **Obrigatório o uso de Token JWT:** Para estabelecer uma conexão STOMP bem-sucedida com o servidor SIGCAPS, a aplicação cliente **deve** se autenticar.
* **Método de Autenticação:** O Token JWT (obtido conforme detalhado na Seção 4: Autenticação na API) precisa ser enviado durante a fase de `CONNECT` do protocolo STOMP.
    * O token deve ser incluído em um cabeçalho da mensagem `CONNECT` do STOMP. O cabeçalho padrão esperado pelo `WebSocketJwtInterceptor` do SIGCAPS é:
        * `Authorization: Bearer <SEU_TOKEN_JWT>`
    * Bibliotecas cliente STOMP (como StompJS) geralmente permitem a especificação de cabeçalhos de conexão (ex: `connectHeaders`).
* **Validação:** O `WebSocketJwtInterceptor` no back-end do SIGCAPS interceptará o frame `CONNECT`, extrairá o token JWT do cabeçalho `Authorization` e o validará usando o `TokenService`. Se o token estiver ausente, for inválido ou expirado, a conexão STOMP será rejeitada e não será estabelecida.

### 5.3 Tópicos Principais para Interação via STOMP

Uma vez que a conexão STOMP autenticada é estabelecida, as aplicações podem interagir com o SIGCAPS enviando mensagens para destinos específicos (geralmente prefixados com `/app` para mensagens direcionadas a métodos `@MessageMapping` no servidor) ou subscrevendo-se a tópicos (geralmente prefixados com `/topic` para broadcasts do servidor).

* **Envio de Chamada de Paciente (Realizado por uma Aplicação Terceira):**

    * **Destino STOMP para Envio:** `/app/chamadaPaciente`
    * **Propósito:** Aplicações externas (como o PEC) enviam uma mensagem para este destino para solicitar que o SIGCAPS processe e anuncie uma nova chamada de paciente.
    * **Corpo da Mensagem:** Um objeto JSON representando o `ChamadaPacienteDto`. Este DTO deve conter os detalhes do paciente a ser chamado. Os campos principais incluem:
        * `nomePaciente` (String): Nome completo ou nome social do cidadão.
        * `classificacao` (Integer): Um valor numérico representando a classificação de risco do paciente. A interpretação exata deste valor deve ser consistente com a lógica do SIGCAPS (ex: mapeamento para cores/prioridades).
        * `tipoServico` (String): Descrição do tipo de atendimento ou serviço para o qual o paciente está sendo direcionado (ex: "Consulta Médica", "Vacinação", "Triagem").
    * **Processamento no Back-end:** O `ChamadaPacientesWebSocketController` recebe esta mensagem. O `ChamadaPacienteService` então processa a chamada, registra-a no histórico e publica as informações da chamada para os clientes inscritos no tópico `/topic/chamadaPaciente`.

* **Recebimento de Novas Chamadas no Painel (Subscrição pelo Front-end SIGCAPS ou Outros Clientes):**

    * **Tópico STOMP para Subscrição:** `/topic/chamadaPaciente`
    * **Propósito:** Aplicações cliente (principalmente o painel de exibição do SIGCAPS) devem se inscrever neste tópico para receber atualizações em tempo real sempre que uma nova chamada de paciente for processada e publicada pelo servidor.
    * **Mensagem Recebida:** O formato da mensagem publicada neste tópico conterá os detalhes da chamada processada, permitindo que o painel exiba o nome do paciente, tipo de atendimento, classificação e também atualize o histórico de chamadas recentes.

* **Recebimento de Atualizações de Configuração (Subscrição pelo Front-end SIGCAPS ou Outros Clientes):**

    * **Tópico STOMP para Subscrição:** `/topic/config/load`
    * **Propósito:** Clientes (como o painel de exibição do SIGCAPS) podem se inscrever neste tópico para receber notificações quando as configurações do sistema (ex: tamanho da fonte do painel, volume da voz) forem alteradas.
    * **Gatilho:** Quando um administrador atualiza as configurações do SIGCAPS através da API REST (endpoint `/api/config`), o `ConfigService` no back-end, após salvar as novas configurações, publica o objeto `ConfigDto` atualizado neste tópico
    * **Mensagem Recebida:** Um objeto JSON representando o `ConfigDto` com as configurações mais recentes do sistema. Isso permite que os painéis de exibição ajustem sua aparência e comportamento dinamicamente sem a necessidade de recarregar a página

<!-- end list -->

### 5.4 Exemplo de Envio de Chamada de Paciente via WebSocket (JavaScript)

Este exemplo prático demonstra como uma aplicação cliente escrita em JavaScript pode utilizar as bibliotecas SockJS e StompJS para se conectar ao endpoint WebSocket do SIGCAPS, autenticar a conexão com um Token JWT e enviar uma mensagem para chamar um cidadão.

**Pré-requisitos:**

* A biblioteca `SockJS-client` e uma biblioteca `StompJS` (como `@stomp/stompjs` para versões mais recentes ou o `stomp.js` mais tradicional que usa `Stomp.over(socket)`) devem estar incluídas no seu projeto front-end.
* A variável `chamadasPacientesServerUrl` deve estar definida com a URL base do seu servidor SIGCAPS (ex: `http://localhost:8081`).
* Uma função como `getCookie('jwt')` (ou um método similar) deve estar disponível para recuperar o Token JWT armazenado após a autenticação via API REST.
* O objeto `chamadaPaciente` (passado como argumento para a função) deve conter os dados do paciente a ser chamado, conforme esperado pelo `ChamadaPacienteDto` no back-end.

<!-- end list -->

```javascript
// Exemplo de função JavaScript para chamar um cidadão via WebSocket/STOMP

// Assumindo que SockJS e StompJs (ex: @stomp/stompjs para versões mais recentes 
// ou a variável global 'Stomp' para versões mais antigas) estão carregados/importados.

const chamarCidadao = (chamadaPaciente) => { // 'chamadaPaciente' é um objeto com os dados do paciente
  // URL base do servidor SIGCAPS, ex: 'http://localhost:8081'
  const serverUrl = chamadasPacientesServerUrl; 
  const socketUrl = `${serverUrl}/ws`; // Endpoint WebSocket do SIGCAPS

  // 1. Obter o Token JWT (adapte para seu método de armazenamento de token)
  const token = getCookie('jwt'); 
  if (!token) {
    console.error('Token JWT não encontrado. A chamada não será enviada.');
    // Adicione aqui sua lógica de notificação de erro ao usuário, se aplicável
    // Ex: suaFuncaoDeAlerta('Erro de autenticação: Token JWT ausente.', 'erro');
    return;
  }

  // 2. Definir os cabeçalhos para a conexão STOMP, incluindo o token de autorização
  const connectHeaders = {
    'Authorization': `Bearer ${token}`,
    // Outros cabeçalhos customizados podem ser adicionados aqui, se necessário
  };

  // 3. Criar o cliente STOMP
  // A forma de criar o cliente pode variar um pouco dependendo da versão do StompJS.
  // Exemplo para Stomp.js sobre SockJS (mais tradicional):
  const socket = new SockJS(socketUrl);
  const stompClient = Stomp.over(socket);

  // Opcional: Habilitar logs de debug do cliente STOMP para ajudar no desenvolvimento
  stompClient.debug = (str) => {
    console.log('STOMP DEBUG:', str);
  };

  // 4. Conectar ao servidor STOMP
  stompClient.connect(
    connectHeaders, // Cabeçalhos de conexão (incluindo autenticação)
    (frame) => { // Callback de sucesso na conexão
      console.log('Conectado ao servidor STOMP do SIGCAPS com sucesso. Frame:', frame);

      // 5. Preparar a mensagem (payload) para enviar
      // Certifique-se que a estrutura da mensagem corresponde ao ChamadaPacienteDto esperado pelo backend
      const mensagemParaEnviar = {
        nomePaciente: chamadaPaciente.cidadaoNomeSocial || chamadaPaciente.cidadaoNome,
        // 'classificacao' deve ser o índice numérico esperado pelo backend.
        // O exemplo original do usuário usava: Object.values(ClassificacaoRisco).indexOf(chamadaPaciente.classificacao)
        // Adapte conforme a representação da 'classificacao' no seu objeto 'chamadaPaciente'.
        classificacao: chamadaPaciente.classificacao, 
        tipoServico: chamadaPaciente.tipoServico,
      };

      // 6. Enviar a mensagem para o destino no servidor
      // O destino '/app/chamadaPaciente' corresponde ao @MessageMapping("/chamadaPaciente") no controller do backend.
      stompClient.send('/app/chamadaPaciente', {}, JSON.stringify(mensagemParaEnviar));
      console.log('Mensagem de chamada de paciente enviada:', mensagemParaEnviar);

      // 7. Desconectar (opcional, dependendo do ciclo de vida da sua aplicação)
      // Se você só precisa enviar uma mensagem e depois fechar, desconecte.
      // Para comunicação contínua (ex: receber atualizações), mantenha a conexão ativa.
      stompClient.disconnect(() => {
        console.log('Desconectado do servidor STOMP do SIGCAPS.');
      });
    },
    (error) => { // Callback de erro na conexão ou durante a sessão
      console.error('Erro na conexão ou comunicação STOMP com SIGCAPS:', error);
      // Adicione aqui sua lógica de notificação de erro ao usuário
      // Ex: suaFuncaoDeAlerta('Erro ao tentar chamar o cidadão via WebSocket. Verifique a conexão e autenticação.', 'erro');
      // O objeto 'error' pode ser uma string, um frame de erro STOMP, ou um CloseEvent do WebSocket, dependendo da causa.
    }
  );
};

// --- Exemplo de como você poderia chamar esta função ---
// const dadosPacienteExemplo = {
//   cidadaoNome: "José da Silva",
//   cidadaoNomeSocial: "Maria Silva", // Nome social tem precedência se existir
//   classificacao: 0, // Supondo que 0 = Alta Prioridade, 1 = Média, etc. (verificar a definição exata)
//   tipoServico: "Atendimento Clínico Geral"
// };
// chamarCidadao(dadosPacienteExemplo);
```

**Explicação do Código de Exemplo:**

1.  **Obtenção do Token JWT:** O token JWT, previamente obtido através do fluxo de autenticação REST (Seção 4), é recuperado (neste exemplo, de um cookie). É essencial para autenticar a conexão WebSocket.
2.  **Cabeçalhos de Conexão:** O token JWT é incluído no cabeçalho `Authorization` com o prefixo ` Bearer  ` para autenticar a conexão STOMP.
3.  **Criação do Cliente STOMP:** Uma instância do cliente STOMP é criada sobre uma conexão SockJS. SockJS é usado para fornecer fallbacks caso WebSockets nativos não estejam disponíveis ou sejam bloqueados por proxies, garantindo maior compatibilidade.
4.  **Conexão:** O método `stompClient.connect()` é chamado, passando os cabeçalhos de autenticação. Um callback de sucesso é executado quando a conexão é estabelecida.
5.  **Preparação da Mensagem:** Um objeto JavaScript (`mensagemParaEnviar`) é criado com os dados do paciente. A estrutura deste objeto deve corresponder ao DTO (`ChamadaPacienteDto`) esperado pelo back-end do SIGCAPS, incluindo campos como `nomePaciente`, `classificacao` (um valor numérico representando a classificação de risco), e `tipoServico`.
6.  **Envio da Mensagem:** Após a conexão bem-sucedida, `stompClient.send()` é usado para enviar a mensagem (serializada como JSON) para o destino `/app/chamadaPaciente` no servidor. Este destino é geralmente mapeado para um método em um controller no back-end (usando `@MessageMapping`).
7.  **Desconexão:** No exemplo fornecido, o cliente se desconecta após enviar a mensagem. Em cenários onde a aplicação cliente precisa de comunicação bidirecional contínua ou para receber atualizações do servidor (como as atualizações de chamadas no painel SIGCAPS), a conexão deve ser mantida ativa e a desconexão gerenciada conforme o ciclo de vida da aplicação.
8.  **Tratamento de Erro:** Callbacks são fornecidos para lidar tanto com o sucesso na conexão quanto com erros que possam ocorrer durante a tentativa de conexão ou durante a sessão de comunicação STOMP. É importante implementar um tratamento de erro robusto na aplicação cliente.

Este exemplo ilustra o fluxo básico para uma aplicação cliente interagir com a funcionalidade de chamada de pacientes do SIGCAPS via WebSockets. Adapte-o conforme as necessidades específicas e as bibliotecas/frameworks utilizados no seu projeto cliente.

## 6. Modelos de Dados (DTOs) Principais

A seguir, uma breve descrição dos principais DTOs (Data Transfer Objects) utilizados na comunicação com a API do SIGCAPS. Para a estrutura exata dos campos, seus tipos de dados e se são obrigatórios, consulte o código-fonte do SIGCAPS (as classes Java correspondentes) e a seção "Schemas" na Swagger UI (para DTOs usados em APIs REST).

* **`ChamadaPacienteDto`** (usado em WebSockets para o destino `/app/chamadaPaciente`):

    * Representa os dados de um paciente a ser chamado pelo sistema.
    * **Campos principais:**
        * `nomePaciente` (String): Nome completo ou nome social do cidadão a ser chamado.
        * `classificacao` (Integer): Um valor numérico que representa a classificação de risco do paciente. A interpretação exata deste índice (ex: 0 para 'Vermelho/Alta Prioridade', 1 para 'Amarelo/Média Prioridade', etc.) deve ser consistente entre a aplicação cliente e a lógica do servidor SIGCAPS.
        * `tipoServico` (String): Uma descrição textual do tipo de atendimento ou serviço para o qual o paciente está sendo direcionado (ex: "Consulta Médica", "Vacinação", "Triagem", "Exames"). 

* **`ConfigDto`** (usado na API REST `/api/config` e no tópico WebSocket `/topic/config/load`):

    * Representa as configurações do sistema SIGCAPS que podem ser gerenciadas externamente.
    * **Campos principais:**
        * `tamanhoFonte` (Integer): Define o tamanho da fonte a ser utilizado no painel de exibição das chamadas.
        * `volumeVoz` (Integer): Controla o volume da leitura em voz alta das chamadas (ex: um valor entre 0 e 100).
        * `nomeInstalacao` (String): O nome da unidade de saúde ou da instalação que será exibido no painel de chamadas.

* **DTOs de Autenticação** (usados nos endpoints REST `/auth/authenticate` e `/auth/refresh`):

    * **Para Requisição a `/auth/authenticate`:**
        * Espera um corpo contendo a `clientSignature` (String) gerada pela aplicação cliente, conforme o fluxo de autenticação detalhado na Seção 4.
    * **Para Resposta de `/auth/authenticate` e `/auth/refresh`:**
        * Retorna um objeto JSON contendo:
            * `token` (String): O Token JWT (JSON Web Token) para ser usado em requisições subsequentes.
            * `refreshToken` (String): O token de atualização que pode ser usado para obter um novo JWT quando o token principal expirar.
    * **Para Requisição a `/auth/refresh`:**
        * Espera um corpo contendo o `refreshToken` (String) previamente obtido.

## 7\. Considerações Finais

Esta documentação fornece um guia essencial para desenvolvedores que desejam integrar suas aplicações com o sistema SIGCAPS. Compreender e implementar corretamente o fluxo de autenticação é o primeiro passo crítico para uma integração bem-sucedida.

* **Swagger UI como Referência Principal para REST:** Para todos os detalhes sobre os endpoints da API REST, incluindo parâmetros exatos, tipos de dados, exemplos de requisições e respostas, a interface Swagger UI (acessível em `http://localhost:8081/swagger-ui.html` quando o SIGCAPS está em execução) deve ser sua fonte de consulta primária e mais atualizada.

* **Comunicação WebSocket:** A comunicação via WebSockets/STOMP é assíncrona. As aplicações cliente devem ser desenvolvidas para lidar com o ciclo de vida da conexão (estabelecer, manter, tratar erros, reconectar se necessário) e processar as mensagens recebidas dos tópicos de forma eficiente e robusta.

* **Tratamento de Erros:** Implemente um tratamento de erros adequado em sua aplicação cliente para lidar com possíveis falhas de comunicação, erros de autenticação, ou respostas inesperadas da API.

* **Evolução da API:** APIs podem evoluir. Fique atento a possíveis atualizações ou versionamentos da API do SIGCAPS em futuras versões do sistema.

O objetivo do SIGCAPS é oferecer uma ferramenta flexível e poderosa para melhorar a gestão de chamadas em unidades de saúde. Esperamos que esta documentação facilite a sua jornada de integração.

-----

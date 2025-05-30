# SIGCAPS: Sistema Inteligente de Gestão de Chamadas de Pacientes para Atenção Primária em Saúde

Este é o SIGCAPS, um sistema projetado para otimizar o fluxo de chamadas de pacientes em unidades de atenção primária à saúde.

## Como Executar a Aplicação SIGCAPS 🚀

Siga os passos abaixo para configurar e executar o SIGCAPS em seu ambiente de desenvolvimento local.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu sistema com as versões especificadas ou superiores:

* **Java JDK:** Versão 17
* **Apache Maven:** Versão 3.9.3
* **Docker:** Versão estável mais recente recomendada.
* **Docker Compose:** Versão estável mais recente recomendada (geralmente incluído na instalação do Docker).

-----

### Passos para Execução

1.  **Compilar o Projeto:**
    Abra um terminal ou prompt de comando, navegue até o diretório raiz do projeto SIGCAPS (onde se encontra o arquivo `pom.xml` principal) e execute o seguinte comando Maven para limpar e compilar todos os módulos do projeto:

    ```bash
    mvn clean install
    ```

    Este comando irá baixar as dependências necessárias, compilar o código-fonte e empacotar a aplicação.

2.  **Iniciar os Serviços de Dependência (Banco de Dados MongoDB):**
    O SIGCAPS utiliza um banco de dados MongoDB para persistência de dados, como a chave de autenticação de aplicações e o histórico de chamadas. Este banco de dados é configurado para ser executado via Docker Compose.
    No diretório raiz do projeto (onde se encontra o arquivo `docker-compose.yml`), execute:

    ```bash
    docker compose up -d
    ```

    O comando `up` inicia os contêineres definidos no arquivo `docker-compose.yml` (incluindo o MongoDB). A flag `-d` executa os contêineres em modo "detached" (em segundo plano). Aguarde alguns instantes para que o banco de dados seja inicializado completamente.

3.  **Executar o Backend da Aplicação SIGCAPS:**
    Após a compilação do projeto e com o banco de dados em execução, você pode iniciar o backend da aplicação SIGCAPS. No diretório raiz do projeto, execute o seguinte comando:

    ```bash
    mvn spring-boot:run -pl backend
    ```

4.  **Acessar a Aplicação (Front-end/Painel de Chamadas):**
    Uma vez que o backend esteja em execução, o painel de chamadas do SIGCAPS (front-end) estará acessível através do seu navegador web no seguinte endereço:

    * `http://localhost:8081/`
      *(Observação: A porta `8081` é a padrão configurada no projeto SIGCAPS. Se você a alterou nas configurações da aplicação, utilize a porta correspondente.)*

-----

### Acessando a Chave de Acesso (`accessKey`) para Aplicações Terceiras

Para que aplicações de terceiros possam se integrar e autenticar com a API do SIGCAPS, elas necessitam de uma `accessKey` (chave de acesso). Conforme descrito na documentação da API, esta chave é gerada automaticamente pelo SIGCAPS na primeira inicialização do backend e armazenada no banco de dados MongoDB.

Para obter esta chave em um ambiente de desenvolvimento local (após o passo 2 e 3 acima terem sido executados pelo menos uma vez):

1.  **Acesse o contêiner do MongoDB via Docker:**
    Abra um novo terminal e execute o seguinte comando para acessar o shell do MongoDB (mongosh) dentro do contêiner:

    ```bash
    docker exec -it sigcaps-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
    ```

    *(Este comando assume que o nome do seu serviço MongoDB no arquivo `docker-compose.yml` é `sigcaps-mongodb` e que as credenciais de usuário/senha para acesso administrativo são `admin`/`admin123` para o banco de dados `admin`.)*

2.  **Consulte a coleção `auth_keys` para encontrar a `accessKey`:**
    Dentro do shell `mongosh` (que aparecerá após o comando anterior), execute o seguinte comando para listar as chaves de acesso armazenadas:

    ```javascript
    db.auth_keys.find().pretty()
    ```

    A `accessKey` estará presente em um dos campos do(s) documento(s) retornado(s) nesta coleção. Esta é a chave que deve ser fornecida de forma segura para as aplicações terceiras iniciarem o processo de autenticação e obterem um token JWT, conforme detalhado no arquivo `DOCUMENTATION.md`.

-----

### Consultando a Documentação Detalhada da API

Para informações completas sobre como usar a API do SIGCAPS, incluindo os fluxos de autenticação detalhados, todos os endpoints disponíveis, a comunicação via WebSockets e os modelos de dados, consulte o arquivo:

* **`DOCUMENTATION.md`** (localizado na raiz deste projeto).

Este arquivo contém todas as instruções necessárias para que desenvolvedores de aplicações terceiras possam integrar seus sistemas com o SIGCAPS.

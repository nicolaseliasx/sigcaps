import { BrowserRouter, Route, Routes } from "react-router-dom";
import PainelChamadasView from "./view/painel/PainelChamadasView";
import { ConfiguracoesView } from "./view/configuracoes/ConfiguracoesView";
import { Navbar } from "./components/Navbar";

function App() {
<<<<<<< HEAD
  const [serverUrl, setServerUrl] = useState(
    localStorage.getItem("serverUrl") || ""
  );

  const {
    data: config,
    sendMessage,
    isConnected,
  } = useWebSocket<Config>(
    `${serverUrl}/ws`,
    "/topic/config/load",
    "appConfig"
  );

  useEffect(() => {
    if (isConnected && !config && serverUrl) {
      sendMessage("/app/config/load", {});
    }
  }, [isConnected, config, serverUrl, sendMessage]);

  const defaultConfig: Config = {
    nomeInstalacao: "",
    fontSize: 2,
    serverAddrs: serverUrl,
    voiceVolume: 1,
  };

=======
>>>>>>> bff3aacf4c48cebcae0db6edee6d441224785e95
  return (
    <BrowserRouter>
      <Navbar
        nomeInstalacao={config?.nomeInstalacao ?? defaultConfig.nomeInstalacao}
      />
      <div style={{ marginTop: "3rem", overflow: "hidden" }}>
        <Routes>
<<<<<<< HEAD
          {!serverUrl && !config ? (
            <>
              <Route
                path="*"
                element={<InitialConfigView setServerUrl={setServerUrl} />}
              />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={
                  <PainelChamadasView config={config ?? defaultConfig} />
                }
              />
              <Route
                path="/configuracoes"
                element={<ConfiguracoesView serverUrl={serverUrl} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
=======
          <Route path="/" element={<PainelChamadasView />} />
          <Route path="/configuracoes" element={<ConfiguracoesView />} />
>>>>>>> bff3aacf4c48cebcae0db6edee6d441224785e95
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

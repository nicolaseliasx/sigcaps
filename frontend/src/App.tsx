import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PainelChamadasView from "./view/painel/PainelChamadasView";
import { ConfiguracoesView } from "./view/configuracoes/ConfiguracoesView";
import { Navbar } from "./components/Navbar";
import { Config } from "./view/configuracoes/config-model";
import { useWebSocket } from "./hooks/useWebSocket";
import { useEffect, useState } from "react";
import { InitialConfigView } from "./view/configuracoes/InitialConfigView";

function App() {
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

  return (
    <BrowserRouter>
      <Navbar nomeInstalacao={config?.nomeInstalacao} />
      <div style={{ marginTop: "3rem", overflow: "hidden" }}>
        <Routes>
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
                element={<PainelChamadasView serverUrl={serverUrl} />}
              />
              <Route
                path="/configuracoes"
                element={<ConfiguracoesView serverUrl={serverUrl} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

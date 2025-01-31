import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import PainelChamadasView from "./view/painel/PainelChamadasView";
import ConfiguracoesView from "./view/configuracoes/ConfiguracoesView";
import { Navbar } from "./components/Navbar";
import { useEffect, useState } from "react";
import { InitialConfigView } from "./view/configuracoes/InitialConfigView";
import { useWebSocket } from "./hooks/useWebSocket";
import { Config } from "./view/configuracoes/config-model";

function App() {
  // TODO: Alterar isso para um hook useCache
  const [serverUrl, setServerUrl] = useState(
    localStorage.getItem("serverUrl") || ""
  );

  const {
    data: config,
    sendMessage,
    isConnected,
  } = useWebSocket<Config>(
    `${serverUrl}/ws/frontend`,
    "/topic/config/load",
    "appConfig"
  );

  // TODO: isso ta trigando sem parar
  useEffect(() => {
    if (isConnected && !config && serverUrl) {
      console.log("Requesting config...");
      sendMessage("/app/config/load", {});
    }
  }, [isConnected, config, serverUrl, sendMessage]);

  // TODO: Isso so existe pq config pode ser null como remover?
  const defaultConfig: Config = {
    fontSize: 2,
    serverAddrs: serverUrl,
    voiceVolume: 1,
  };

  console.log(config);

  return (
    <BrowserRouter>
      <Navbar />
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
                element={
                  <PainelChamadasView config={config ?? defaultConfig} />
                }
              />
              <Route path="/configuracoes" element={<ConfiguracoesView />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

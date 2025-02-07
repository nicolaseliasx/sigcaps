import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PainelChamadasView from "./view/painel/PainelChamadasView";
import { ConfiguracoesView } from "./view/configuracoes/ConfiguracoesView";
import { Navbar } from "./components/Navbar";
import { InitialConfigView } from "./view/configuracoes/InitialConfigView";
import { ConfigProvider } from "./provider/ConfigProvider";
import { useConfig } from "./provider/useConfig";

function AppContent() {
  const { config, serverUrl, setServerUrl } = useConfig();

  return (
    <BrowserRouter>
      <Navbar nomeInstalacao={config?.nomeInstalacao} />
      <div style={{ marginTop: "3rem", overflow: "hidden" }}>
        <Routes>
          {!serverUrl && !config ? (
            <Route
              path="*"
              element={<InitialConfigView setServerUrl={setServerUrl} />}
            />
          ) : (
            <>
              <Route path="/" element={<PainelChamadasView />} />
              <Route path="/configuracoes" element={<ConfiguracoesView />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <AppContent />
    </ConfigProvider>
  );
}

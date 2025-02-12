import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ConfiguracoesView } from "./view/configuracoes/ConfiguracoesView";
import { Navbar } from "./components/Navbar";
import { InitialConfigView } from "./view/configuracoes/InitialConfigView";
import { ConfigProvider } from "./provider/ConfigProvider";
import { useConfig } from "./provider/useConfig";
import PainelChamadasView from "./view/painel/PainelChamadasView";
import { VFlow } from "bold-ui";
import { useFontScale } from "./hooks/useFontScale";

function AppContent() {
  const { config, serverUrl, setServerUrl } = useConfig();
  const fontSizes = useFontScale(config?.fontSize || 1);

  return (
    <BrowserRouter>
      <VFlow vSpacing={fontSizes.small}>
        <Navbar nomeInstalacao={config?.nomeInstalacao} />

        <div style={{ marginTop: `${fontSizes.small}rem`, overflow: "hidden" }}>
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
      </VFlow>
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

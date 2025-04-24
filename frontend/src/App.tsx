import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ConfigProvider } from "./provider/ConfigProvider";
import { useConfig } from "./provider/useConfig";
import PainelChamadasView from "./view/PainelChamadasView";
import { ThemeProvider, VFlow } from "bold-ui";
import { useZoom } from "./hooks/useZoom";

function AppContent() {
  const { config } = useConfig();
  const fontSize = config?.fontSize || 2;
  const zoomLevel = useZoom(fontSize);

  return (
    <BrowserRouter>
      <VFlow vSpacing={fontSize} style={{ zoom: zoomLevel }}>
        <Navbar />
        {/* melhorar o calculo de espacamento entre navbar e conteudo */}
        <div style={{ marginTop: `${fontSize}rem`, overflow: "hidden" }}>
          <Routes>
            <Route path="/" element={<PainelChamadasView />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </VFlow>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ConfigProvider>
  );
}

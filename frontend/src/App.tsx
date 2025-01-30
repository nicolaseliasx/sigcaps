import { BrowserRouter, Route, Routes } from "react-router-dom";
import PainelChamadasView from "./view/painel/PainelChamadasView";
import ConfiguracoesView from "./view/configuracoes/ConfiguracoesView";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ marginTop: "3rem" }}>
        <Routes>
          <Route path="/" element={<PainelChamadasView />} />
          <Route path="/configuracoes" element={<ConfiguracoesView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

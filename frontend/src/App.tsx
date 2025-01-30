import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PainelChamadasView from "./view/painel/PainelChamadasView";
import ConfiguracoesView from "./view/configuracoes/ConfiguracoesView";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <div style={{ marginTop: "3rem" }}>
          <Routes>
            <Route path="/" element={<PainelChamadasView />} />
            <Route path="/configuracoes" element={<ConfiguracoesView />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

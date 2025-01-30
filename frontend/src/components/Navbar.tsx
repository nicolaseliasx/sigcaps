import { HFlow, Button } from "bold-ui";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundColor: "#0051A2",
        color: "#fff",
        padding: "0.8rem 0.8rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        boxShadow: "0 5rem 8rem rgba(0, 0, 0, 0.1)",
        marginLeft: -12,
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
        SIGCAPS
      </h1>

      <HFlow hSpacing={2} style={{ marginRight: 30, textoColor: "#fff" }}>
        <Button
          kind="normal"
          size="large"
          skin="ghost"
          style={{ color: "#fff", fontSize: "1.2rem" }}
          onClick={() => navigate("/")}
        >
          Painel
        </Button>
        <Button
          kind="normal"
          size="large"
          skin="ghost"
          style={{ color: "#fff", fontSize: "1.2rem" }}
          onClick={() => navigate("/configuracoes")}
        >
          Configurações
        </Button>
      </HFlow>
    </div>
  );
}

export default Navbar;

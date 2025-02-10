import {
  useTheme,
  HFlow,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button,
  Text,
} from "bold-ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConfig } from "../provider/useConfig";

interface NavbarProps {
  nomeInstalacao?: string;
}

export function Navbar({ nomeInstalacao }: NavbarProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { config } = useConfig();
  const fontSize = config?.fontSize ?? 1;

  const [anchorRef, setAnchorRef] = useState<HTMLButtonElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: theme.pallete.primary.main,
        padding: "0.3rem",
        boxShadow: theme.shadows.outer[40],
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <HFlow justifyContent="flex-end" style={{ marginRight: "2rem" }}>
        <Text style={{ color: "white" }} fontSize={fontSize * 1.5}>
          {nomeInstalacao}
        </Text>
        <Button innerRef={setAnchorRef} onClick={handleToggleMenu} skin="ghost">
          <Text style={{ color: "white" }}>▼</Text>
        </Button>

        <Dropdown
          anchorRef={anchorRef}
          open={isMenuOpen}
          onClose={handleCloseMenu}
          popperProps={{ placement: "bottom-end" }}
        >
          <DropdownMenu>
            <DropdownItem onClick={() => navigate("/")}>Painel</DropdownItem>
            <DropdownItem onClick={() => navigate("/configuracoes")}>
              Configurações
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </HFlow>
    </div>
  );
}

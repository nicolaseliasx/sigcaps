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
import { useFontScale } from "../hooks/useFontScale";

interface NavbarProps {
  nomeInstalacao?: string;
}

export function Navbar({ nomeInstalacao }: NavbarProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { config } = useConfig();
  const fontSizes = useFontScale(config?.fontSize || 1);

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
        zIndex: 2001,
      }}
    >
      <HFlow justifyContent="flex-end" style={{ marginRight: "2rem" }}>
        <Text style={{ color: "white" }} fontSize={fontSizes.medium}>
          {nomeInstalacao}
        </Text>
        <Button innerRef={setAnchorRef} onClick={handleToggleMenu} skin="ghost">
          <Text style={{ color: "white" }} fontSize={fontSizes.base}>
            ▼
          </Text>
        </Button>

        <Dropdown
          anchorRef={anchorRef}
          open={isMenuOpen}
          onClose={handleCloseMenu}
          popperProps={{ placement: "bottom-end" }}
        >
          <DropdownMenu>
            <DropdownItem onClick={() => navigate("/")}>
              <Text fontSize={fontSizes.xsmall}>Painel</Text>
            </DropdownItem>
            <DropdownItem onClick={() => navigate("/configuracoes")}>
              <Text fontSize={fontSizes.xsmall}>Configurações</Text>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </HFlow>
    </div>
  );
}

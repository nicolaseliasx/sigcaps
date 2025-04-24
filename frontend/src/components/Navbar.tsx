import { useTheme, HFlow, Text } from "bold-ui";

import { useConfig } from "../provider/useConfig";

export function Navbar() {
  const theme = useTheme();
  const { config } = useConfig();

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
        <Text style={{ color: "white" }} fontSize={3.2}>
          {config?.installationName ?? " - "}
        </Text>
      </HFlow>
    </div>
  );
}

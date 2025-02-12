import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Alert, AlertType, Text } from "bold-ui";
import { useConfig } from "../provider/useConfig";
import { useFontScale } from "./useFontScale";

export interface AlertItem {
  id: string;
  type: AlertType;
  message: React.ReactNode;
}

export const useAlert = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const { config } = useConfig();
  const fontSizes = useFontScale(config?.fontSize || 1);

  const alert = (type: AlertType, message: React.ReactNode, timeout = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newAlert: AlertItem = { id, type, message };

    setAlerts((prev) => [...prev, newAlert]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, timeout);
  };

  const AlertRenderer: React.FC = () =>
    createPortal(
      <div
        style={{
          position: "fixed",
          top: 100 * fontSizes.xxsmall,
          right: 30 * fontSizes.xxsmall,
          zIndex: 2000,
        }}
      >
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type}
            style={{ fontSize: `${fontSizes.xsmall}rem` }}
          >
            {alert.message}
            <Text fontSize={fontSizes.xsmall} color="success"></Text>
          </Alert>
        ))}
      </div>,
      document.body
    );

  return { alert, AlertRenderer };
};

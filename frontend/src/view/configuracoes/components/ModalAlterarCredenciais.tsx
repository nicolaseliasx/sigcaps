import {
  Button,
  HFlow,
  Modal,
  ModalBody,
  Text,
  VFlow,
  TextField,
} from "bold-ui";
import { useState } from "react";
import { ChangeCredentials } from "../config-model";
import { useConfig } from "../../../provider/useConfig";
import { useFontScale } from "../../../hooks/useFontScale";

interface ModalAlterarCredenciaisProps {
  isModalOpen: boolean;
  onClose(): void;
  onSubmit(changeCredentials: ChangeCredentials): void;
  errors: string;
}

export function ModalAlterarCredenciais(props: ModalAlterarCredenciaisProps) {
  const { isModalOpen, onClose, onSubmit, errors } = props;

  const [currentUser, setCurrentUser] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUser, setNewUser] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { config } = useConfig();
  const fontSizes = useFontScale(config?.fontSize || 1);

  const handleSubmit = () => {
    onSubmit({ currentUser, currentPassword, newUser, newPassword });
    setCurrentUser("");
    setCurrentPassword("");
    setNewUser("");
    setNewPassword("");
  };

  return (
    <Modal
      size="large"
      open={isModalOpen}
      closeOnBackdropClick={true}
      onClose={onClose}
    >
      <ModalBody>
        <VFlow>
          <Text fontSize={fontSizes.base} fontWeight="bold">
            Alterar Credenciais de Acesso
          </Text>
          <Text fontSize={fontSizes.xsmall}>
            Para alterar suas credenciais, insira o usuário e senha atuais e, em
            seguida, informe os novos dados de acesso.
          </Text>

          <VFlow>
            <Text fontSize={fontSizes.small} fontWeight="bold">
              Credenciais Atuais
            </Text>
            <HFlow hSpacing={2}>
              <VFlow vSpacing={0}>
                <Text fontSize={fontSizes.xsmall} fontWeight="bold">
                  Usuário Atual
                </Text>
                <TextField
                  placeholder="Usuário Atual"
                  clearable={false}
                  value={currentUser}
                  onChange={(e) => setCurrentUser(e.target.value)}
                  error={errors}
                  style={{ fontSize: `${fontSizes.xsmall}rem` }}
                />
              </VFlow>
              <VFlow vSpacing={0}>
                <Text fontSize={fontSizes.xsmall} fontWeight="bold">
                  Senha Atual
                </Text>
                <TextField
                  type="password"
                  placeholder="Senha Atual"
                  clearable={false}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={errors ? " " : undefined}
                  style={{ fontSize: `${fontSizes.xsmall}rem` }}
                />
              </VFlow>
            </HFlow>
          </VFlow>

          <VFlow>
            <Text fontSize={fontSizes.small} fontWeight="bold">
              Novas Credenciais
            </Text>
            <HFlow hSpacing={2}>
              <VFlow vSpacing={0}>
                <Text fontSize={fontSizes.xsmall} fontWeight="bold">
                  Novo Usuário
                </Text>
                <TextField
                  placeholder="Novo Usuário"
                  clearable={false}
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  style={{ fontSize: `${fontSizes.xsmall}rem` }}
                />
              </VFlow>
              <VFlow vSpacing={0}>
                <Text fontSize={fontSizes.xsmall} fontWeight="bold">
                  Nova Senha
                </Text>
                <TextField
                  type="password"
                  placeholder="Nova Senha"
                  clearable={false}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ fontSize: `${fontSizes.xsmall}rem` }}
                />
              </VFlow>
            </HFlow>
          </VFlow>

          <HFlow justifyContent="flex-end">
            <Button onClick={onClose} kind="normal">
              <Text fontSize={fontSizes.xsmall}>Cancelar</Text>
            </Button>
            <Button onClick={handleSubmit} kind="danger">
              <Text fontSize={fontSizes.xsmall} style={{ color: "white" }}>
                Alterar
              </Text>
            </Button>
          </HFlow>
        </VFlow>
      </ModalBody>
    </Modal>
  );
}

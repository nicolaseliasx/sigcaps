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
          <Text fontSize={1.5} fontWeight="bold">
            Alterar Credenciais de Acesso
          </Text>
          <Text fontSize={1}>
            Para alterar suas credenciais, insira o usuário e senha atuais e, em
            seguida, informe os novos dados de acesso.
          </Text>

          <VFlow>
            <Text fontSize={1.2} fontWeight="bold">
              Credenciais Atuais
            </Text>
            <HFlow hSpacing={2}>
              <VFlow vSpacing={0}>
                <Text fontSize={1} fontWeight="bold">
                  Usuário Atual
                </Text>
                <TextField
                  placeholder="Usuário Atual"
                  clearable={false}
                  value={currentUser}
                  onChange={(e) => setCurrentUser(e.target.value)}
                  error={errors}
                />
              </VFlow>
              <VFlow vSpacing={0}>
                <Text fontSize={1} fontWeight="bold">
                  Senha Atual
                </Text>
                <TextField
                  type="password"
                  placeholder="Senha Atual"
                  clearable={false}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={errors ? " " : undefined}
                />
              </VFlow>
            </HFlow>
          </VFlow>

          <VFlow>
            <Text fontSize={1.2} fontWeight="bold">
              Novas Credenciais
            </Text>
            <HFlow hSpacing={2}>
              <VFlow vSpacing={0}>
                <Text fontSize={1} fontWeight="bold">
                  Novo Usuário
                </Text>
                <TextField
                  placeholder="Novo Usuário"
                  clearable={false}
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                />
              </VFlow>
              <VFlow vSpacing={0}>
                <Text fontSize={1} fontWeight="bold">
                  Nova Senha
                </Text>
                <TextField
                  type="password"
                  placeholder="Nova Senha"
                  clearable={false}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </VFlow>
            </HFlow>
          </VFlow>

          <HFlow justifyContent="flex-end">
            <Button onClick={onClose} kind="normal">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} kind="danger">
              Alterar
            </Button>
          </HFlow>
        </VFlow>
      </ModalBody>
    </Modal>
  );
}

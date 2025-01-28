package br.ufsc.sigcaps.model;

import lombok.Data;

@Data
public class ChamadaPacienteDto {
	private String nomePaciente;
	private String classificacao;
	private String sala;
	private String horario;
}

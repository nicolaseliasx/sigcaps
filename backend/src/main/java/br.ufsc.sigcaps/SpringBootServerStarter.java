package br.ufsc.sigcaps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class SpringBootServerStarter {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootServerStarter.class, args);
	}

}

package unpsjb.labprog.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class BackendApplication {

	@GetMapping("/")
	public ResponseEntity<Object> home() {
		return Response.response(
				HttpStatus.OK,
				"Server Online",
				"Hola Labprog!");
	}

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}

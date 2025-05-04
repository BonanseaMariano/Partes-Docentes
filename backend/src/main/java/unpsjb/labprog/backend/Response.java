package unpsjb.labprog.backend;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class Response {

	public static ResponseEntity<Object> response(HttpStatus status, String message, Object responseObj) {
		Map<String, Object> map = new HashMap<>();

		map.put("status", status.value());
		map.put("message", message);
		map.put("data", responseObj);

		return new ResponseEntity<>(map, HttpStatus.OK);
	}

	public static ResponseEntity<Object> ok(Object responseObj) {
		return response(HttpStatus.OK, "OK", responseObj);
	}

	public static ResponseEntity<Object> ok(Object responseObj, String msj) {
		return response(HttpStatus.OK, msj, responseObj);
	}

	public static ResponseEntity<Object> notFound() {
		return response(HttpStatus.NOT_FOUND, "Not found", null);
	}

	public static ResponseEntity<Object> notFound(String msj) {
		return response(HttpStatus.NOT_FOUND, msj, null);
	}

	public static ResponseEntity<Object> error(Object responseObj, String msj) {
		return response(HttpStatus.BAD_REQUEST, msj, responseObj);
	}

	public static ResponseEntity<Object> dbError(String msj) {
		return response(HttpStatus.CONFLICT, msj, null);
	}

	public static ResponseEntity<Object> unprocessableEntity(String msj) {
		return response(HttpStatus.UNPROCESSABLE_ENTITY, msj, null);
	}
}
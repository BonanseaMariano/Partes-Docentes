package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.service.PersonaService;
import unpsjb.labprog.backend.model.Persona;

/**
 * Controlador REST para la gestión de personas
 */
@RestController
@RequestMapping("personas")
public class PersonaPresenter {

    @Autowired
    private PersonaService service;

    @GetMapping
    public ResponseEntity<Object> findAll() {
        return Response.ok(service.findAll());
    }

    @GetMapping("/{dni}")
    public ResponseEntity<Object> findByDni(@PathVariable int dni) {
        Persona personaOrNull = service.findByDni(dni);
        return (personaOrNull != null) ? Response.ok(personaOrNull)
                : Response.notFound("Persona dni " + dni + " no encontrada");
    }

    @GetMapping("/cuil/{cuil}")
    public ResponseEntity<Object> findByCuil(@PathVariable String cuil) {
        Persona personaOrNull = service.findByCuil(cuil);
        return (personaOrNull != null) ? Response.ok(personaOrNull)
                : Response.notFound("Persona cuil " + cuil + " no encontrada");
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Persona aPersona) {
        try {
            Persona savedPersona = service.save(aPersona);
            // Formatear el mensaje según lo requerido en Persona.feature
            String mensaje = String.format("%s %s con DNI %d ingresado/a correctamente",
                    savedPersona.getNombre(),
                    savedPersona.getApellido(),
                    savedPersona.getDni());

            return Response.ok(mensaje);
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede utilizar ese dni porque ya existe otra persona con el mismo");
        }
    }

    @PutMapping
    public ResponseEntity<Object> update(@RequestBody Persona aPersona) {
        if (aPersona.getDni() <= 0) {
            return Response.error(aPersona, "debe especificar un dni valido para poder modificar una persona.");
        }
        try {
            Persona updatedPersona = service.save(aPersona);
            // Formatear el mensaje según lo requerido en Persona.feature
            String mensaje = String.format("%s %s con DNI %d actualizado/a correctamente",
                    updatedPersona.getNombre(),
                    updatedPersona.getApellido(),
                    updatedPersona.getDni());
            return Response.ok(mensaje);
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede utilizar ese codigo porque ya existe otra obra con el mismo");
        }
    }
}
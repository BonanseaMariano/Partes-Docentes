package unpsjb.labprog.backend.business.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.business.repository.CargoRepository;
import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.dto.HorarioDTO;
import unpsjb.labprog.backend.dto.HorarioDTO.HoraEspacioCurricular;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Horario;
import unpsjb.labprog.backend.model.enums.DiaSemana;
import unpsjb.labprog.backend.model.enums.Turno;

/**
 * Servicio para gestionar los horarios de espacios curriculares Sigue el
 * principio de responsabilidad única (SRP)
 */
@Service
public class HorarioService {

    private final CargoRepository cargoRepository;
    private final DesignacionRepository designacionRepository;

    public HorarioService(CargoRepository cargoRepository, DesignacionRepository designacionRepository) {
        this.cargoRepository = cargoRepository;
        this.designacionRepository = designacionRepository;
    }

    /**
     * Obtiene los horarios de espacios curriculares para un turno y fecha
     * específicos
     *
     * @param turno Turno para filtrar las divisiones
     * @param fecha Fecha para verificar la vigencia de cargos y designaciones
     * @return HorarioDTO con la grilla de horarios organizada por día y hora
     */
    public HorarioDTO obtenerHorariosPorTurnoYFecha(Turno turno, LocalDate fecha) {
        // Buscar cargos de tipo ESPACIO_CURRICULAR vigentes para el turno y fecha
        List<Cargo> cargosVigentes = cargoRepository.findEspaciosCurricularesByTurnoAndFechaVigente(turno, fecha);

        // Crear la grilla de horarios
        Map<DiaSemana, List<HoraEspacioCurricular>> grilla = inicializarGrilla();

        // Procesar cada cargo vigente
        for (Cargo cargo : cargosVigentes) {
            // Buscar designación activa para este cargo en la fecha especificada
            LocalDateTime fechaHora = fecha.atStartOfDay();
            List<Designacion> designacionesActivas = designacionRepository
                    .findDesignacionActivaPorCargoYFecha(cargo.getId(), fechaHora);

            if (!designacionesActivas.isEmpty()) {
                // Tomar la primera designación activa (debería ser única)
                Designacion designacionActiva = designacionesActivas.get(0);

                // Procesar los horarios del cargo
                for (Horario horario : cargo.getHorarios()) {
                    String nombreDocente = obtenerNombreCompleto(designacionActiva.getPersona());
                    String nombreDivision = obtenerNombreDivision(cargo);

                    HoraEspacioCurricular horaEspacio = new HoraEspacioCurricular(
                            horario.getHora(),
                            cargo.getNombre(),
                            nombreDivision,
                            nombreDocente
                    );

                    // Agregar a la grilla en el día y hora correspondiente
                    grilla.get(horario.getDia()).add(horaEspacio);
                }
            }
        }

        // Ordenar cada día por hora
        for (DiaSemana dia : DiaSemana.values()) {
            if (dia != DiaSemana.SABADO && dia != DiaSemana.DOMINGO) { // Solo días laborables
                grilla.get(dia).sort((h1, h2) -> Integer.compare(h1.getHora(), h2.getHora()));
            }
        }

        return new HorarioDTO(fecha, turno, grilla);
    }

    /**
     * Inicializa la grilla de horarios con listas vacías para cada día laboral
     * Los días se ordenan de lunes a viernes
     */
    private Map<DiaSemana, List<HoraEspacioCurricular>> inicializarGrilla() {
        Map<DiaSemana, List<HoraEspacioCurricular>> grilla = new LinkedHashMap<>();

        // Agregar los días en orden de lunes a viernes para mantener el orden en la respuesta JSON
        grilla.put(DiaSemana.LUNES, new ArrayList<>());
        grilla.put(DiaSemana.MARTES, new ArrayList<>());
        grilla.put(DiaSemana.MIERCOLES, new ArrayList<>());
        grilla.put(DiaSemana.JUEVES, new ArrayList<>());
        grilla.put(DiaSemana.VIERNES, new ArrayList<>());

        return grilla;
    }

    /**
     * Obtiene el nombre completo de una persona
     */
    private String obtenerNombreCompleto(unpsjb.labprog.backend.model.Persona persona) {
        StringBuilder nombreCompleto = new StringBuilder();

        if (persona.getNombre() != null) {
            nombreCompleto.append(persona.getNombre());
        }

        if (persona.getApellido() != null) {
            if (nombreCompleto.length() > 0) {
                nombreCompleto.append(" ");
            }
            nombreCompleto.append(persona.getApellido());
        }

        return nombreCompleto.toString();
    }

    /**
     * Obtiene el nombre descriptivo de la división
     */
    private String obtenerNombreDivision(Cargo cargo) {
        if (cargo.getDivision() == null) {
            return "Sin División";
        }

        StringBuilder nombreDivision = new StringBuilder();

        if (cargo.getDivision().getAnio() != null) {
            nombreDivision.append(cargo.getDivision().getAnio()).append("°");
        }

        if (cargo.getDivision().getNumDivision() != null) {
            if (nombreDivision.length() > 0) {
                nombreDivision.append(" ");
            }
            nombreDivision.append(cargo.getDivision().getNumDivision()).append("°");
        }

        if (cargo.getDivision().getOrientacion() != null && !cargo.getDivision().getOrientacion().trim().isEmpty()) {
            if (nombreDivision.length() > 0) {
                nombreDivision.append(" - ");
            }
            nombreDivision.append(cargo.getDivision().getOrientacion());
        }

        return nombreDivision.toString();
    }
}

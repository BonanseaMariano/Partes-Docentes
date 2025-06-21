package unpsjb.labprog.backend.business.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.business.repository.CargoRepository;
import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.dto.HorarioDTO;
import unpsjb.labprog.backend.dto.HorarioDTO.HoraEspacioCurricular;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Horario;
import unpsjb.labprog.backend.model.enums.DiaSemana;
import unpsjb.labprog.backend.model.enums.Turno;

/**
 * Servicio para la gestión de horarios de espacios curriculares. Proporciona
 * funcionalidades para obtener y organizar horarios por turno, año y fecha.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Service
public class HorarioService {

    private final CargoRepository cargoRepository;
    private final DesignacionRepository designacionRepository;
    private final LicenciaRepository licenciaRepository;

    /**
     * Constructor del servicio.
     *
     * @param cargoRepository repositorio de cargos
     * @param designacionRepository repositorio de designaciones
     * @param licenciaRepository repositorio de licencias
     */
    public HorarioService(CargoRepository cargoRepository, DesignacionRepository designacionRepository, LicenciaRepository licenciaRepository) {
        this.cargoRepository = cargoRepository;
        this.designacionRepository = designacionRepository;
        this.licenciaRepository = licenciaRepository;
    }

    /**
     * Obtiene los horarios de espacios curriculares para un turno específico en
     * una fecha determinada. Incluye verificación de licencias docentes y se
     * organiza por día de la semana (lunes a viernes).
     *
     * @param turno el turno para filtrar los horarios (mañana, tarde, noche)
     * @param fecha la fecha para verificar vigencia de cargos y designaciones
     * @return HorarioDTO con la grilla de horarios organizada por día y hora
     */
    public HorarioDTO obtenerHorariosPorTurnoYFecha(Turno turno, LocalDate fecha) {
        List<Cargo> cargosVigentes = cargoRepository.findEspaciosCurricularesByTurnoAndFechaVigente(turno, fecha);
        Map<DiaSemana, List<HoraEspacioCurricular>> grilla = inicializarGrilla();

        for (Cargo cargo : cargosVigentes) {
            List<Designacion> designacionesActivas = designacionRepository
                    .findDesignacionActivaPorCargoYFecha(cargo.getId(), fecha);

            if (!designacionesActivas.isEmpty()) {
                Designacion designacionActiva = designacionesActivas.get(designacionesActivas.size() - 1);

                for (Horario horario : cargo.getHorarios()) {
                    String nombreDocente = obtenerNombreCompleto(designacionActiva.getPersona());
                    String nombreDivision = obtenerNombreDivision(cargo);

                    boolean docenteDeLicencia = licenciaRepository.tienePersonaLicenciaActivaEnFecha(
                            designacionActiva.getPersona(), fecha);

                    HoraEspacioCurricular horaEspacio = new HoraEspacioCurricular(
                            horario.getHora(),
                            cargo.getNombre(),
                            nombreDivision,
                            nombreDocente,
                            docenteDeLicencia
                    );

                    grilla.get(horario.getDia()).add(horaEspacio);
                }
            }
        }

        for (DiaSemana dia : DiaSemana.values()) {
            if (dia != DiaSemana.SABADO && dia != DiaSemana.DOMINGO) {
                grilla.get(dia).sort((h1, h2) -> Integer.compare(h1.getHora(), h2.getHora()));
            }
        }

        return new HorarioDTO(fecha, turno, grilla);
    }

    /**
     * Obtiene los horarios de espacios curriculares para un turno y año
     * específicos en una fecha determinada. Incluye verificación de licencias
     * docentes y se organiza por día de la semana (lunes a viernes).
     *
     * @param turno el turno para filtrar los horarios (mañana, tarde, noche)
     * @param anio el año de la división para filtrar
     * @param fecha la fecha para verificar vigencia de cargos y designaciones
     * @return HorarioDTO con la grilla de horarios organizada por día y hora
     */
    public HorarioDTO obtenerHorariosPorTurnoAnioYFecha(Turno turno, Integer anio, LocalDate fecha) {
        List<Cargo> cargosVigentes = cargoRepository.findEspaciosCurricularesByTurnoAndAnioAndFechaVigente(turno, anio, fecha);
        Map<DiaSemana, List<HoraEspacioCurricular>> grilla = inicializarGrilla();

        for (Cargo cargo : cargosVigentes) {
            List<Designacion> designacionesActivas = designacionRepository
                    .findDesignacionActivaPorCargoYFecha(cargo.getId(), fecha);

            if (!designacionesActivas.isEmpty()) {
                Designacion designacionActiva = designacionesActivas.get(designacionesActivas.size() - 1);

                for (Horario horario : cargo.getHorarios()) {
                    String nombreDocente = obtenerNombreCompleto(designacionActiva.getPersona());
                    String nombreDivision = obtenerNombreDivision(cargo);

                    boolean docenteDeLicencia = licenciaRepository.tienePersonaLicenciaActivaEnFecha(
                            designacionActiva.getPersona(), fecha);

                    HoraEspacioCurricular horaEspacio = new HoraEspacioCurricular(
                            horario.getHora(),
                            cargo.getNombre(),
                            nombreDivision,
                            nombreDocente,
                            docenteDeLicencia
                    );

                    grilla.get(horario.getDia()).add(horaEspacio);
                }
            }
        }

        for (DiaSemana dia : DiaSemana.values()) {
            if (dia != DiaSemana.SABADO && dia != DiaSemana.DOMINGO) {
                grilla.get(dia).sort((h1, h2) -> Integer.compare(h1.getHora(), h2.getHora()));
            }
        }

        return new HorarioDTO(fecha, turno, grilla);
    }

    /**
     * Obtiene los horarios de espacios curriculares para un turno específico
     * con filtro opcional por año. Si no se especifica el año, se incluyen
     * todos los años disponibles para el turno.
     *
     * @param turno el turno para filtrar los horarios (mañana, tarde, noche)
     * @param anio el año de la división para filtrar (null para incluir todos
     * los años)
     * @param fecha la fecha para verificar vigencia de cargos y designaciones
     * @return HorarioDTO con la grilla de horarios organizada por día y hora
     */
    public HorarioDTO obtenerHorarios(Turno turno, Integer anio, LocalDate fecha) {
        List<Cargo> cargosVigentes;

        if (anio != null) {
            cargosVigentes = cargoRepository.findEspaciosCurricularesByTurnoAndAnioAndFechaVigente(turno, anio, fecha);
        } else {
            cargosVigentes = cargoRepository.findEspaciosCurricularesByTurnoAndFechaVigente(turno, fecha);
        }

        Map<DiaSemana, List<HoraEspacioCurricular>> grilla = inicializarGrilla();

        for (Cargo cargo : cargosVigentes) {
            List<Designacion> designacionesActivas = designacionRepository
                    .findDesignacionActivaPorCargoYFecha(cargo.getId(), fecha);

            if (!designacionesActivas.isEmpty()) {
                Designacion designacionActiva = designacionesActivas.get(designacionesActivas.size() - 1);

                for (Horario horario : cargo.getHorarios()) {
                    String nombreDocente = obtenerNombreCompleto(designacionActiva.getPersona());
                    String nombreDivision = obtenerNombreDivision(cargo);

                    boolean docenteDeLicencia = licenciaRepository.tienePersonaLicenciaActivaEnFecha(
                            designacionActiva.getPersona(), fecha);

                    HoraEspacioCurricular horaEspacio = new HoraEspacioCurricular(
                            horario.getHora(),
                            cargo.getNombre(),
                            nombreDivision,
                            nombreDocente,
                            docenteDeLicencia
                    );

                    grilla.get(horario.getDia()).add(horaEspacio);
                }
            }
        }

        for (DiaSemana dia : DiaSemana.values()) {
            if (dia != DiaSemana.SABADO && dia != DiaSemana.DOMINGO) {
                grilla.get(dia).sort((h1, h2) -> Integer.compare(h1.getHora(), h2.getHora()));
            }
        }

        return new HorarioDTO(fecha, turno, grilla);
    }

    /**
     * Obtiene los años disponibles para un turno y fecha específicos.
     * Proporciona una lista de años únicos que tienen espacios curriculares
     * activos.
     *
     * @param turno el turno para filtrar las divisiones
     * @param fecha la fecha para verificar vigencia de cargos y designaciones
     * @return lista de años únicos disponibles para el turno especificado
     */
    public List<Integer> obtenerAniosDisponibles(Turno turno, LocalDate fecha) {
        return cargoRepository.findAniosDisponiblesByTurnoAndFechaVigente(turno, fecha);
    }

    /**
     * Inicializa la grilla de horarios con listas vacías para cada día laboral.
     * Los días se organizan de lunes a viernes para mantener el orden en la
     * respuesta.
     *
     * @return mapa con días de la semana como clave y listas vacías de horarios
     * como valor
     */
    private Map<DiaSemana, List<HoraEspacioCurricular>> inicializarGrilla() {
        Map<DiaSemana, List<HoraEspacioCurricular>> grilla = new LinkedHashMap<>();

        grilla.put(DiaSemana.LUNES, new ArrayList<>());
        grilla.put(DiaSemana.MARTES, new ArrayList<>());
        grilla.put(DiaSemana.MIERCOLES, new ArrayList<>());
        grilla.put(DiaSemana.JUEVES, new ArrayList<>());
        grilla.put(DiaSemana.VIERNES, new ArrayList<>());

        return grilla;
    }

    /**
     * Construye el nombre completo de una persona concatenando nombre y
     * apellido. Maneja adecuadamente los valores nulos y espacios en blanco.
     *
     * @param persona la persona de la cual obtener el nombre completo
     * @return el nombre completo formateado como "Nombre Apellido"
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
     * Construye el nombre descriptivo de una división académica. Combina año,
     * número de división y orientación en un formato legible.
     *
     * @param cargo el cargo que contiene la información de la división
     * @return nombre descriptivo formateado como "Año° Número° - Orientación" o
     * "Sin División" si no existe
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

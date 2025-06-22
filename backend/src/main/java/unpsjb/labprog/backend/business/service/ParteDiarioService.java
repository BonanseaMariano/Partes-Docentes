package unpsjb.labprog.backend.business.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.dto.ParteDiarioDTO;
import unpsjb.labprog.backend.dto.ParteDiarioDTO.DocenteLicencia;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Servicio para la generación de partes diarios de licencias. Procesa las
 * licencias válidas para una fecha específica y genera reportes estructurados
 * con información de docentes y reemplazos.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Service
public class ParteDiarioService {

    @Autowired
    private LicenciaRepository licenciaRepository;

    @Autowired
    private DesignacionService designacionService;

    /**
     * Genera el parte diario de licencias para una fecha específica. Incluye
     * información de docentes con licencia y sus reemplazos asignados.
     *
     * @param fecha fecha para la cual generar el parte diario
     * @return parte diario estructurado con información de licencias
     */
    public ParteDiarioDTO generarParteDiario(LocalDate fecha) {
        List<Licencia> licenciasDelDia = licenciaRepository.findLicenciasValidasEnFecha(fecha);

        ParteDiarioDTO parteDiario = new ParteDiarioDTO();
        parteDiario.setFecha(fecha);

        List<DocenteLicencia> docentes = licenciasDelDia.stream()
                .map(this::mapearLicenciaADocente)
                .collect(Collectors.toList());

        parteDiario.setDocentes(docentes);

        return parteDiario;
    }

    /**
     * Convierte una entidad Licencia en un DTO de DocenteLicencia. Incluye
     * información del docente, tipo de licencia y reemplazos asignados.
     *
     * @param licencia licencia a mapear
     * @return DTO con datos del docente y su licencia
     */
    private DocenteLicencia mapearLicenciaADocente(Licencia licencia) {
        List<Designacion> reemplazos = designacionService.findDesignacionesReemplazoPorLicencia(licencia);

        DocenteLicencia docente = new DocenteLicencia();
        docente.setDni(licencia.getPersona().getDni());
        docente.setNombre(licencia.getPersona().getNombre());
        docente.setApellido(licencia.getPersona().getApellido());
        docente.setArticulo(licencia.getArticuloLicencia().getArticulo());
        docente.setDescripcion(licencia.getArticuloLicencia().getDescripcion());
        docente.setDesde(licencia.getPedidoDesde());
        docente.setHasta(licencia.getPedidoHasta());
        docente.setReemplazos(reemplazos);

        return docente;
    }
}

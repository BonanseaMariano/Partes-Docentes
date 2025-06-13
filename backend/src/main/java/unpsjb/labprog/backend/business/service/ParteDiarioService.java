package unpsjb.labprog.backend.business.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
 * Servicio especializado en la generación de partes diarios de licencias. Se
 * encarga de procesar las licencias válidas para una fecha específica y generar
 * el reporte estructurado correspondiente.
 */
@Service
public class ParteDiarioService {

    @Autowired
    private LicenciaRepository licenciaRepository;

    @Autowired
    private DesignacionService designacionService;

    /**
     * Genera el parte diario de licencias para una fecha específica
     *
     * @param fecha Fecha para la cual generar el parte diario
     * @return DTO con el parte diario estructurado
     */
    public ParteDiarioDTO generarParteDiario(LocalDate fecha) {
        // Convertir a LocalDateTime para la consulta
        LocalDateTime inicioDia = fecha.atStartOfDay();
        LocalDateTime finDia = fecha.atTime(23, 59, 59);

        // Buscar licencias válidas que contengan la fecha solicitada
        List<Licencia> licenciasDelDia = licenciaRepository.findLicenciasValidasEnFecha(inicioDia, finDia);

        // Crear DTO del parte diario
        ParteDiarioDTO parteDiario = new ParteDiarioDTO();
        parteDiario.setFecha(fecha);

        // Mapear licencias a DTOs de docentes
        List<DocenteLicencia> docentes = licenciasDelDia.stream()
                .map(this::mapearLicenciaADocente)
                .collect(Collectors.toList());

        parteDiario.setDocentes(docentes);

        return parteDiario;
    }

    /**
     * Convierte una entidad Licencia en un DTO de DocenteLicencia
     *
     * @param licencia La licencia a mapear
     * @return DocenteLicencia DTO con los datos mapeados
     */
    private DocenteLicencia mapearLicenciaADocente(Licencia licencia) {
        // Obtener las designaciones de reemplazo para esta licencia
        List<Designacion> reemplazos = designacionService.findDesignacionesReemplazoPorLicencia(licencia);

        DocenteLicencia docente = new DocenteLicencia();
        docente.setDni(licencia.getPersona().getDni());
        docente.setNombre(licencia.getPersona().getNombre());
        docente.setApellido(licencia.getPersona().getApellido());
        docente.setArticulo(licencia.getArticuloLicencia().getArticulo());
        docente.setDescripcion(licencia.getArticuloLicencia().getDescripcion());
        docente.setDesde(licencia.getPedidoDesde().toLocalDate());
        docente.setHasta(licencia.getPedidoHasta().toLocalDate());
        docente.setReemplazos(reemplazos);

        return docente;
    }
}

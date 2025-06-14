package unpsjb.labprog.backend.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;  // Añade esta importación
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.enums.Estado;

/**
 * Clase que representa una Licencia solicitada por un docente
 *
 * @see Persona
 * @see Designacion
 * @see ArticuloLicencia
 */
@Entity
@Table(name = "licencias")
@Getter
@Setter
@NoArgsConstructor
public class Licencia {

    /**
     * ID de la licencia, generado automáticamente
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "licencias_seq_gen")
    @SequenceGenerator(name = "licencias_seq_gen", sequenceName = "licencias_seq", initialValue = 1000, allocationSize = 1)
    private int id;

    /**
     * Fecha de la solicitud de la licencia
     */
    @NotNull
    @Column(name = "pedido_desde", nullable = false)
    private LocalDate pedidoDesde;

    /**
     * Fecha de la finalización de la licencia
     */
    @NotNull
    @Column(name = "pedido_hasta", nullable = false)
    private LocalDate pedidoHasta;

    /**
     * Si la licencia cuenta con certificado médico
     */
    @NotNull
    @Column(name = "certificado_medico", nullable = false)
    private Boolean certificadoMedico;

    // Relaciones
    /**
     * Persona que solicita la licencia
     */
    @NotNull
    @ManyToOne
    @JoinColumn(name = "persona_dni", nullable = false)
    private Persona persona;

    /**
     * Designaciones asociadas a la licencia
     */
    @NotNull
    @ManyToMany
    @JoinTable(name = "licencia_designacion", joinColumns = @JoinColumn(name = "licencia_id", nullable = false), inverseJoinColumns = @JoinColumn(name = "designacion_id", nullable = false))
    private List<Designacion> designaciones = new ArrayList<>();

    /**
     * Artículo de licencia asociado a la licencia
     */
    @NotNull
    @ManyToOne
    @JoinColumn(name = "articulo_licencia_id", nullable = false)
    private ArticuloLicencia articuloLicencia;

    /**
     * Estado de la licencia
     */
    @NotNull
    @Enumerated(EnumType.STRING)  // Usa el nombre del enum como valor en la DB
    @Column(name = "estado")
    private Estado estado;

    /**
     * Logs de la licencia, que contienen el historial de eventos relacionados
     * con la licencia.
     */
    @NotNull
    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, orphanRemoval = true)
    @JoinColumn(name = "log_id", nullable = false)
    private List<Log> logs = new ArrayList<>();
}

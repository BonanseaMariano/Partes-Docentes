package unpsjb.labprog.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
     * Fecha y hora de la solicitud de la licencia
     */
    @NotNull
    @Column(name = "pedido_desde", nullable = false)
    private LocalDateTime pedidoDesde;

    /**
     * Fecha y hora de la finalización de la licencia
     */
    @NotNull
    @Column(name = "pedido_hasta", nullable = false)
    private LocalDateTime pedidoHasta;

    /**
     * Domicilio de la licencia
     */
    @Column(length = 90)
    private String domicilio;

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
}
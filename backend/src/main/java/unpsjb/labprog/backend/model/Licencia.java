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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa una Licencia solicitada por un docente
 */
@Entity
@Table(name = "licencias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Licencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pedido_desde", nullable = false)
    private LocalDateTime pedidoDesde;

    @Column(name = "pedido_hasta", nullable = false)
    private LocalDateTime pedidoHasta;

    @Column(length = 90)
    private String domicilio;

    @Column(name = "certificado_medico")
    private Boolean certificadoMedico;

    // Relaciones
    @ManyToOne
    @JoinColumn(name = "persona_dni", nullable = false)
    private Persona persona;

    @ManyToMany
    @JoinTable(name = "licencia_designacion", joinColumns = @JoinColumn(name = "licencia_id"), inverseJoinColumns = @JoinColumn(name = "designacion_id"))
    private List<Designacion> designaciones = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "articulo_licencia_id", nullable = false)
    private ArticuloLicencia articuloLicencia;
}
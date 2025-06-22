package unpsjb.labprog.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad que representa un artículo de licencia del reglamento docente. Define
 * los tipos de licencias disponibles con su código y descripción.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Entity
@Table(name = "articulos_licencia")
@Getter
@Setter
@NoArgsConstructor
public class ArticuloLicencia {

    /**
     * Identificador único del artículo de licencia.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "articulosLicencia_seq_gen")
    @SequenceGenerator(name = "articulosLicencia_seq_gen", sequenceName = "articulosLicencia_seq", initialValue = 1000, allocationSize = 1)
    private int id;

    /**
     * Código del artículo de licencia (ej: "5A", "7B").
     */
    @NotNull
    @Column(length = 10, nullable = false, unique = true)
    private String articulo;

    /**
     * Descripción detallada del tipo de licencia.
     */
    @Column(length = 90)
    private String descripcion;

}

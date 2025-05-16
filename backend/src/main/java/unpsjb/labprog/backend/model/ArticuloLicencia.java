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
 * Clase que representa un Artículo de Licencia del reglamento docente
 */
@Entity
@Table(name = "articulos_licencia")
@Getter
@Setter
@NoArgsConstructor
public class ArticuloLicencia {

    /**
     * ID del artículo de licencia, generado automáticamente
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "articulosLicencia_seq_gen")
    @SequenceGenerator(name = "articulosLicencia_seq_gen", sequenceName = "articulosLicencia_seq", initialValue = 1000, allocationSize = 1)
    private int id;

    /**
     * Artículo de licencia, es unico y no nulo
     */
    @NotNull
    @Column(length = 10, nullable = false, unique = true)
    private String articulo;

    /**
     * Descripción del artículo de licencia
     */
    @Column(length = 90)
    private String descripcion;

}
package unpsjb.labprog.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Clase que representa una División en el sistema educativo
 */
@Entity
@Table(name = "divisiones")
@Getter
@Setter
@NoArgsConstructor
public class Division {

    /**
     * Enum para turno de la división
     */
    private enum Turno {
        Mañana,
        Tarde,
        Vespertino,
        Noche;
    }

    /**
     * ID de la división, generado automáticamente
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Año de la división
     */
    @NotNull
    @Column(nullable = false)
    private Integer anio;

    /**
     * Numero de la división
     */
    @NotNull
    @Column(nullable = false)
    private Integer numDivision;

    @Column(length = 90)
    private String orientacion;

    /**
     * Turno de la división
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Turno turno;
}
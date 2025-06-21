package unpsjb.labprog.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.enums.Turno;

/**
 * Entidad que representa una división académica del sistema educativo. Define
 * grupos de estudiantes organizados por año, número y turno.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Entity
@Table(name = "divisiones", uniqueConstraints = @UniqueConstraint(name = "uk_division", columnNames = {"anio",
    "numDivision",
    "turno"}))
@Getter
@Setter
@NoArgsConstructor
public class Division {

    /**
     * ID de la división, generado automáticamente
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "divisiones_seq_gen")
    @SequenceGenerator(name = "divisiones_seq_gen", sequenceName = "divisiones_seq", initialValue = 1000, allocationSize = 1)
    private int id;

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

    /**
     * Orientación de la división
     */
    @NotNull
    @Column(length = 90, nullable = false)
    private String orientacion;

    /**
     * Turno de la división
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Turno turno;
}

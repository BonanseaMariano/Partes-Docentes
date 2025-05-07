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
 * Representa una División en el sistema educativo, que corresponde a un grupo
 * académico
 * específico dentro de la institución.
 * <p>
 * Una división se conforma por la combinación de diferentes atributos que en
 * conjunto
 * la identifican de manera única:
 * <ul>
 * <li>Año académico (por ejemplo: 1°, 2°, etc.)</li>
 * <li>Número de división (por ejemplo: 1, 2, 3, etc.)</li>
 * <li>Turno (Mañana, Tarde, Vespertino, Noche)</li>
 * </ul>
 * <p>
 * Las divisiones son fundamentales para la organización académica, ya que a
 * ellas
 * se asocian cargos específicos como materias o espacios curriculares que serán
 * impartidos a los estudiantes de dicha división.
 * 
 * @see Cargo Cargos que pueden estar asociados a esta división
 * @see Turno Turnos posibles para una división
 */
@Entity
@Table(name = "divisiones", uniqueConstraints = @UniqueConstraint(name = "uk_division", columnNames = { "anio",
        "numDivision",
        "turno" }))
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
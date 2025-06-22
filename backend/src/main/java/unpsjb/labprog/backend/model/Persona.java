package unpsjb.labprog.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad que representa a una persona del sistema educativo. Contiene
 * información personal y puede tener designaciones y licencias asociadas.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Entity
@Table(name = "personas")
@Getter
@Setter
@NoArgsConstructor
public class Persona {

    /**
     * ID de la persona, generado automáticamente
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "personas_seq_gen")
    @SequenceGenerator(name = "personas_seq_gen", sequenceName = "personas_seq", initialValue = 1000, allocationSize = 1)
    private int id;

    /**
     * DNI de la persona
     */
    @NotNull
    @Column(unique = true, nullable = false)
    private Long dni;

    /**
     * CUIL de la persona, es único y no nulo
     */
    @NotNull
    @Column(length = 30, unique = true, nullable = false)
    private String cuil;

    /**
     * Nombre de la persona, no nulo
     */
    @NotNull
    @Column(length = 90, nullable = false)
    private String nombre;

    /**
     * Apellido de la persona, no nulo
     */
    @NotNull
    @Column(length = 90, nullable = false)
    private String apellido;

    /**
     * Título de la persona
     */
    @Column(length = 90)
    private String titulo;

    /**
     * Sexo de la persona, no nulo
     */
    @NotNull
    @Column(length = 1, nullable = false)
    private Character sexo;

    /**
     * Domicilio de la persona, opcional
     */
    @Column(length = 90)
    private String domicilio;

    /**
     * Teléfono de la persona, opcional
     */
    @Column(length = 30)
    private String telefono;

    // Relaciones
    /**
     * Designaciones asociadas a la persona
     */
    @OneToMany(mappedBy = "persona")
    @JsonIgnoreProperties("persona")
    private List<Designacion> designaciones = new ArrayList<>();

}

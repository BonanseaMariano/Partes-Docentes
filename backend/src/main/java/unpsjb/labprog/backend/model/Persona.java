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
 * Representa a una Persona en el sistema educativo, típicamente personal
 * docente
 * que puede ser asignado a diferentes cargos mediante designaciones.
 * <p>
 * Una persona se identifica de manera única por su DNI y/o CUIL, y contiene
 * información personal básica como nombre, apellido, domicilio y datos de
 * contacto.
 * <p>
 * Cada persona puede tener múltiples designaciones asignadas a lo largo del
 * tiempo,
 * representando los diferentes cargos y funciones que desempeña en la
 * institución.
 * <p>
 * La información almacenada en esta entidad incluye:
 * <ul>
 * <li>Datos identificatorios (DNI, CUIL)</li>
 * <li>Datos personales (nombre, apellido, sexo)</li>
 * <li>Formación académica (título)</li>
 * <li>Datos de contacto (domicilio, teléfono)</li>
 * </ul>
 * 
 * @see Designacion Entidad que vincula a la persona con cargos específicos
 * @see Cargo Cargos a los que puede ser asignada la persona
 * @see Licencia Licencias o permisos que puede solicitar la persona
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
     * Domicilio de la persona, no nulo
     */
    @NotNull
    @Column(length = 90, nullable = false)
    private String domicilio;

    /**
     * Teléfono de la persona, no nulo
     */
    @NotNull
    @Column(length = 30, nullable = false)
    private String telefono;

    // Relaciones

    /**
     * Designaciones asociadas a la persona
     */
    @OneToMany(mappedBy = "persona")
    @JsonIgnoreProperties("persona")
    private List<Designacion> designaciones = new ArrayList<>();

}
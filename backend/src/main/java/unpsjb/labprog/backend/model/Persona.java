package unpsjb.labprog.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Clase que representa a una Persona en el sistema (personal docente)
 * 
 * @see Designacion
 */
@Entity
@Table(name = "personas")
@Getter
@Setter
@NoArgsConstructor
public class Persona {

    /**
     * DNI de la persona, es su identificador
     */
    @Id
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
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
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa a una Persona en el sistema (personal docente)
 */
@Entity
@Table(name = "personas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Persona {

    // Atributos
    @Id
    @NotNull
    private Long dni;

    @NotNull
    @Pattern(regexp = "^\\d{2}-\\d{8}-\\d$|^\\d{11}$", message = "El CUIL debe tener formato XX-XXXXXXXX-X o XXXXXXXXXXX")
    @Column(length = 30, unique = true, nullable = false)
    private String cuil;

    @NotNull
    @Column(length = 90, nullable = false)
    private String nombre;

    @NotNull
    @Column(length = 90, nullable = false)
    private String apellido;

    @Column(length = 90)
    private String titulo;

    @Column(length = 1)
    private Character sexo;

    @Column(length = 90)
    private String domicilio;

    @Column(length = 30)
    private String telefono;

    // Relaciones
    @OneToMany(mappedBy = "persona")
    @JsonIgnoreProperties("persona")
    private List<Designacion> designaciones = new ArrayList<>();

}
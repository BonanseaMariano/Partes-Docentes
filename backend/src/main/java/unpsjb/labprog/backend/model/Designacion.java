package unpsjb.labprog.backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Clase que representa una Designación de un docente a un cargo
 * 
 * @see Cargo
 * @see Persona
 */
@Entity
@Table(name = "designaciones")
@Getter
@Setter
@NoArgsConstructor
public class Designacion {

    /**
     * ID de la designación, generado automáticamente
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Situación de la revista de la persona
     */
    @Column(name = "situacion_revista", length = 45, nullable = false)
    private String situacionRevista;

    /**
     * Fecha y hora de inicio de la designación
     */
    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    /**
     * Fecha y hora de finalización de la designación
     */
    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    // Relaciones
    /**
     * Persona a la que se le asigna la designación
     */
    @ManyToOne
    @JoinColumn(name = "persona_dni", nullable = false)
    @JsonIgnoreProperties("designaciones")
    private Persona persona;

    /**
     * Cargo al que se le asigna la designación
     */
    @ManyToOne
    @JoinColumn(name = "cargo_id", nullable = false)
    private Cargo cargo;

}
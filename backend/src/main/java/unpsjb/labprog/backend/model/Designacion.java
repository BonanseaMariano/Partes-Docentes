package unpsjb.labprog.backend.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad que representa la designación de una persona a un cargo específico.
 * Establece la relación entre docentes y los cargos que desempeñan.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Entity
@Table(name = "designaciones", uniqueConstraints = @UniqueConstraint(name = "uk_designacion", columnNames = {
    "persona_dni", "cargo_id", "situacion_revista"}))
@Getter
@Setter
@NoArgsConstructor
public class Designacion {

    /**
     * ID de la designación, generado automáticamente
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "designaciones_seq_gen")
    @SequenceGenerator(name = "designaciones_seq_gen", sequenceName = "designaciones_seq", initialValue = 1000, allocationSize = 1)
    private int id;

    /**
     * Situación de la revista de la persona, opcional
     */
    @Column(name = "situacion_revista", length = 45)
    private String situacionRevista;

    /**
     * Fecha de inicio de la designación, no puede ser nula
     */
    @NotNull
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    /**
     * Fecha de finalización de la designación, opcional
     */
    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    // Relaciones
    /**
     * Persona a la que se le asigna la designación, no puede ser nula
     */
    @NotNull
    @ManyToOne
    @JoinColumn(name = "persona_dni", nullable = false)
    @JsonIgnoreProperties("designaciones")
    private Persona persona;

    /**
     * Cargo al que se le asigna la designación
     */
    @NotNull
    @ManyToOne
    @JoinColumn(name = "cargo_id", nullable = false)
    private Cargo cargo;

}

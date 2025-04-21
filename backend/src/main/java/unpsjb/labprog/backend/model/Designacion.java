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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa una Designación de un docente a un cargo
 */
@Entity
@Table(name = "designaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Designacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "situacion_revista", length = 45, nullable = false)
    private String situacionRevista; // Titular, Suplente, etc.

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    // Relaciones
    @ManyToOne
    @JoinColumn(name = "persona_dni", nullable = false)
    @JsonIgnoreProperties("designaciones")
    private Persona persona;

    @ManyToOne
    @JoinColumn(name = "cargo_id", nullable = false)
    private Cargo cargo;

}
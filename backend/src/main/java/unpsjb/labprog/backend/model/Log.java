package unpsjb.labprog.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad que representa un registro de log del sistema. Almacena información
 * sobre eventos y validaciones de licencias.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Entity
@Table(name = "logs")
@Getter
@Setter
@NoArgsConstructor
public class Log {

    /**
     * ID del log, generado automáticamente
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    /**
     * Fecha y hora del evento registrado en el log
     */
    @NotNull
    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    /**
     * Descripción del evento registrado en el log
     */
    @NotNull
    @Column(name = "descripcion", nullable = false, length = 500)
    private String descripcion;
}

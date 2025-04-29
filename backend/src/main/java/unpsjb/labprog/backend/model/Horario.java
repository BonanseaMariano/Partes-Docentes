package unpsjb.labprog.backend.model;

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
 * Clase que representa un Horario asignado a un Cargo
 */
@Entity
@Table(name = "horarios")
@Getter
@Setter
@NoArgsConstructor
public class Horario {

    /**
     * ID del horario, generado automáticamente
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    /**
     * Día de la semana del horario
     */
    @NotNull
    @Column(length = 10, nullable = false)
    private String dia;

    /**
     * Hora del horario
     */
    @Column(nullable = false)
    private Integer hora;

}
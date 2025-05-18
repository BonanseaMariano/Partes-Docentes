package unpsjb.labprog.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.enums.DiaSemana;

/**
 * Clase que representa un Horario asignado a un Cargo
 */
@Entity
@Table(name = "horarios", uniqueConstraints = @UniqueConstraint(name = "uk_horario", columnNames = { "dia", "hora",
        "cargo" }))
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
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiaSemana dia;

    /**
     * Hora del horario
     */
    @Column(nullable = false)
    private Integer hora;

}
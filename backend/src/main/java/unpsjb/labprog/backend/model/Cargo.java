package unpsjb.labprog.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Clase que representa un Cargo en el sistema educativo
 * 
 * @see TipoDesignacion
 * @see Division
 * @see Horario
 */
@Entity
@Table(name = "cargos")
@Getter
@Setter
@NoArgsConstructor
public class Cargo {

    /**
     * Identificador único del cargo generado automáticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    /**
     * Nombre o título del cargo.
     */
    @NotNull
    @Column(nullable = false)
    private String nombre;

    /**
     * Carga horaria semanal asignada al cargo en horas.
     */
    @Column(name = "carga_horaria", columnDefinition = "integer default 0 check (carga_horaria >= 0)")
    @PositiveOrZero(message = "La carga horaria debe ser mayor o igual a cero")
    private Integer cargaHoraria = 0;

    /**
     * Fecha de inicio de vigencia del cargo.
     */
    @NotNull
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    /**
     * Fecha de finalización de vigencia del cargo.
     */
    @NotNull
    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    /**
     * Tipo de designación del cargo (ej. suplente, titular, interino).
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_designacion", nullable = false)
    private TipoDesignacion tipoDesignacion;

    /**
     * División a la que pertenece el cargo, si corresponde a un espacio curricular.
     * Este campo es opcional.
     */
    @ManyToOne
    @JoinColumn(name = "division_id")
    private Division division;

    /**
     * Colección de horarios asignados a este cargo.
     * Representa los días y horas en los que se debe cumplir con las obligaciones
     * del cargo.
     */
    @NotNull
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "cargo_id", nullable = false)
    private List<Horario> horarios = new ArrayList<>();
}
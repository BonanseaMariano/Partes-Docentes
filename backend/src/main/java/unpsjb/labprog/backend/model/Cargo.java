package unpsjb.labprog.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Clase que representa un Cargo en el sistema educativo
 */
@Entity
@Table(name = "cargos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 90)
    private String nombre;

    @Column(name = "carga_horaria")
    private Integer cargaHoraria;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    // Relaciones
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_designacion", nullable = false)
    private TipoDesignacion tipoDesignacion;

    @ManyToOne
    @JoinColumn(name = "division_id")
    private Division division; // Opcional, sólo para espacios curriculares

    @OneToMany
    private List<Horario> horarios = new ArrayList<>();

}
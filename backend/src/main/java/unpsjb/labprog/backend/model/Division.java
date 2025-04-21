package unpsjb.labprog.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa una División en el sistema educativo
 */
@Entity
@Table(name = "divisiones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Division {

    public enum Turno {
        MANIANA("Mañana"),
        TARDE("Tarde"),
        VESPERTINO("Vespertino"),
        NOCHE("Noche");

        private String descripcion;

        private Turno(String descripcion) {
            this.descripcion = descripcion;
        }

        public String getDescripcion() {
            return descripcion;
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer anio;

    @Column(nullable = false)
    private Integer numDivision;

    @Column(length = 90)
    private String orientacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Turno turno;
}
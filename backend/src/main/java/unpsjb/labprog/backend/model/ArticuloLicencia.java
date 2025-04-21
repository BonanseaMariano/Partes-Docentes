package unpsjb.labprog.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa un Artículo de Licencia del reglamento docente
 */
@Entity
@Table(name = "articulos_licencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticuloLicencia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 10, nullable = false, unique = true)
    private String articulo;
    
    @Column(length = 90, nullable = false)
    private String descripcion;
    
}
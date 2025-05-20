package unpsjb.labprog.backend.business.validator.articulos;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

/**
 * Fábrica que gestiona los validadores de artículos de licencia.
 * Permite obtener el validador específico para cada tipo de artículo.
 */
@Component
public class ArticuloValidatorFactory {

    @Autowired
    private List<ArticuloLicenciaValidator> validadores;

    private final Map<String, ArticuloLicenciaValidator> validadorPorArticulo = new HashMap<>();

    @PostConstruct
    public void init() {
        validadores.forEach(validador -> validadorPorArticulo.put(validador.getArticuloCode(), validador));
    }

    /**
     * Obtiene el validador específico para un artículo
     * 
     * @param articuloCode Código del artículo
     * @return Optional con el validador si existe, o empty si no hay validador
     *         específico
     */
    public Optional<ArticuloLicenciaValidator> getValidador(String articuloCode) {
        return Optional.ofNullable(validadorPorArticulo.get(articuloCode));
    }
}

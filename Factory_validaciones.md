# Sistema de Validaciones de Licencias con Patrón Factory

Este documento describe el sistema de validaciones de licencias basado en el patrón Factory, que permite aplicar múltiples reglas de negocio de forma modular y extensible.

## Características Principales

- **Carga dinámica**: Los validadores se cargan automáticamente usando reflexión
- **Cache de instancias**: Cada validador se carga una sola vez y se reutiliza
- **Patrón Singleton**: Todos los validadores son singleton para optimizar memoria
- **Extensibilidad**: Agregar nuevos validadores es tan simple como crear una clase
- **Separación de responsabilidades**: Cada validador maneja una regla específica
- **Manejo robusto de errores**: Fallos en validadores individuales no rompen el flujo

## Arquitectura del Sistema de Validaciones de Licencias

### Componentes Principales

1. **Validator<T>**: Interfaz base que define el contrato `validate(T entity)` para todos los validadores
2. **ValidatorFactory**: Factory principal que gestiona la carga, cache y creación de validadores de licencias
3. **LicenciaValidator**: Orquestador principal que coordina todas las validaciones de una licencia
4. **Validadores específicos**: Clases especializadas en validar reglas concretas (fechas, solapamientos, artículos específicos)
5. **GenericFechaValidator**: Validador genérico consolidado que maneja validaciones de fechas para cualquier entidad

### Convención de Nomenclatura

El ValidatorFactory utiliza una convención específica para localizar validadores:

**Patrón de búsqueda:**
```
unpsjb.labprog.backend.business.validator.licencia.validators.{CapitalizedName}Validator
```

**Ejemplos de transformación:**
- `"fecha"` → `FechaValidator` → Se resuelve a `GenericFechaValidator<Licencia>`  
- `"solapamiento"` → `SolapamientoValidator`
- `"designaciones"` → `DesignacionesValidator` 
- `"articulo5a"` → `Articulo5aValidator`
- `"articulo23a"` → `Articulo23aValidator`
- `"articulo36a"` → `Articulo36aValidator`

## Validadores de Licencias Implementados

### Validadores Básicos
- **GenericFechaValidator**: Valida que la fecha de inicio no sea posterior a la fecha de fin (consolidado para todas las entidades)
- **SolapamientoValidator**: Verifica que no existan solapamientos temporales entre licencias de la misma persona
- **DesignacionesValidator**: Verifica que existan designaciones activas durante el período de la licencia

### Validadores por Artículo Específico  
- **Articulo5aValidator**: Artículo 5A - Enfermedad (máximo 30 días por año, requiere certificado médico)
- **Articulo23aValidator**: Artículo 23A - Atención familiar (máximo 30 días por año)
- **Articulo36aValidator**: Artículo 36A - Asuntos particulares (máximo 2 días por mes, 6 días por año)

### Arquitectura de Validadores por Artículo

Los validadores de artículos específicos siguen un patrón común:

1. **Filtrado**: Solo procesan licencias del artículo correspondiente
2. **Cálculo de días**: Determinan los días solicitados en la licencia actual
3. **Consulta histórica**: Utilizan `DiasCalculadorUtil` para obtener días ya utilizados
4. **Validación de límites**: Verifican que no se superen los límites establecidos
5. **Mensajes específicos**: Proporcionan mensajes de error personalizados con datos del docente

## Funcionamiento del Sistema de Validaciones de Licencias

### Flujo Principal de Validación

El `LicenciaValidator` actúa como orquestador principal y ejecuta las validaciones en este orden:

```java
@Component
public class LicenciaValidator {
    @Autowired
    private ValidatorFactory validatorFactory;
    
    public void validar(Licencia licencia) throws BusinessLogicException {
        // 1. Validación básica de fechas
        Validator<Licencia> fechaValidator = validatorFactory.getValidator("fecha");
        if (fechaValidator != null) {
            fechaValidator.validate(licencia);
        }
        
        // 2. Validación de solapamiento con otras licencias
        Validator<Licencia> solapamientoValidator = validatorFactory.getValidator("solapamiento");
        if (solapamientoValidator != null) {
            solapamientoValidator.validate(licencia);
        }
        
        // 3. Validación de designaciones activas
        Validator<Licencia> designacionesValidator = validatorFactory.getValidator("designaciones");
        if (designacionesValidator != null) {
            designacionesValidator.validate(licencia);
        }
        
        // 4. Validaciones específicas por artículo (si aplica)
        if (licencia.getArticulo() != null) {
            String validatorName = licencia.getArticulo().getDescripcion().toLowerCase().replace(" ", "");
            Validator<Licencia> articuloValidator = validatorFactory.getValidator(validatorName);
            if (articuloValidator != null) {
                articuloValidator.validate(licencia);
            }
        }
    }
}
```

### Mecanismo del ValidatorFactory

El factory implementa un sistema de carga dinámica con cache:

```java
@Component
public class ValidatorFactory {
    private final Map<String, Validator<Licencia>> validatorCache = new HashMap<>();
    
    public Validator<Licencia> getValidator(String name) {
        // 1. Buscar en cache
        if (validatorCache.containsKey(name)) {
            return validatorCache.get(name);
        }
        
        // 2. Cargar dinámicamente si no existe
        Validator<Licencia> validator = loadValidator(name);
        
        // 3. Guardar en cache para futuras consultas
        if (validator != null) {
            validatorCache.put(name, validator);
        }
        
        return validator;
    }
    
    private Validator<Licencia> loadValidator(String name) {
        try {
            // Construir nombre de clase siguiendo convención
            String className = "unpsjb.labprog.backend.business.validator.licencia.validators." 
                             + capitalize(name) + "Validator";
            
            // Cargar clase usando reflexión
            Class<?> clazz = Class.forName(className);
            
            // Obtener instancia singleton
            Method getInstance = clazz.getMethod("getInstance");
            Validator<Licencia> validator = (Validator<Licencia>) getInstance.invoke(null);
            
            // Inyectar dependencias si es necesario
            injectDependencies(validator);
            
            return validator;
        } catch (Exception e) {
            // Manejo silencioso - permite que el flujo continúe
            return null;
        }
    }
}
```

## Uso del Sistema en el Servicio

El `LicenciaService` utiliza el validador principal para aplicar todas las reglas de negocio:

```java
@Service
public class LicenciaService {
    @Autowired
    private LicenciaValidator validator;
    
    public Licencia save(Licencia licencia) {
        try {
            // Aplicar todas las validaciones configuradas
            validator.validar(licencia);
            
            // Si no hay excepciones, la licencia es válida
            licencia.setEstado(Estado.VALIDO);
            
            // Crear log de éxito
            Log logExito = new Log();
            logExito.setFechaHora(LocalDateTime.now());
            logExito.setDescripcion("Licencia validada correctamente");
            licencia.getLogs().add(logExito);
            
        } catch (BusinessLogicException e) {
            // En caso de error, marcar como inválida y registrar el error
            licencia.setEstado(Estado.INVALIDO);
            
            Log logError = new Log();
            logError.setFechaHora(LocalDateTime.now());
            logError.setDescripcion(e.getMessage());
            licencia.getLogs().add(logError);
        }
        
        return repository.save(licencia);
    }
}
```

## Agregar Nuevos Validadores

Agregar un nuevo validador al sistema es un proceso simple que requiere únicamente crear la nueva clase siguiendo las convenciones establecidas:

### Paso 1: Crear la Clase del Validador

Crear una nueva clase en el paquete `validators` que implemente la interfaz `Validator<Licencia>`:

```java
package unpsjb.labprog.backend.business.validator.licencia.validators;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador para mi nueva regla de negocio.
 * Implementa el patrón Singleton requerido por el ValidatorFactory.
 */
public class MiNuevaReglaValidator implements Validator<Licencia> {
    
    // Singleton - Obligatorio para el sistema
    private static MiNuevaReglaValidator instance = null;
    
    private MiNuevaReglaValidator() {
        // Constructor privado para Singleton
    }
    
    public static MiNuevaReglaValidator getInstance() {
        if (instance == null) {
            instance = new MiNuevaReglaValidator();
        }
        return instance;
    }
    
    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        // Implementar lógica de validación específica
        if (/* condición de error */) {
            throw new BusinessLogicException("Mensaje de error descriptivo");
        }
    }
}
```

### Paso 2: Usar el Validador en LicenciaValidator

Modificar `LicenciaValidator` para invocar el nuevo validador:

```java
public void validar(Licencia licencia) throws BusinessLogicException {
    // ...validaciones existentes...
    
    // Agregar la nueva validación
    Validator<Licencia> miNuevaReglaValidator = validatorFactory.getValidator("minuevaregla");
    if (miNuevaReglaValidator != null) {
        miNuevaReglaValidator.validate(licencia);
    }
}
```

### Consideraciones Importantes

1. **Convención de nombres**: El nombre de la clase debe seguir el patrón `{CapitalizedName}Validator`
2. **Patrón Singleton**: Obligatorio para la integración con el ValidatorFactory
3. **Manejo de errores**: Usar `BusinessLogicException` para reportar errores de validación
4. **Mensajes descriptivos**: Incluir información específica sobre el error (datos del docente, fechas, etc.)
5. **Performance**: Los validadores son reutilizados, evitar estado mutable o sincronizar acceso


## Ventajas del Sistema

### Para el Desarrollo
- **Extensibilidad**: Agregar nuevos validadores requiere solo crear una clase, sin modificar código existente
- **Mantenibilidad**: Cada validador es independiente con una responsabilidad específica  
- **Testabilidad**: Los validadores pueden probarse de forma aislada usando mocks
- **Flexibilidad**: El sistema se adapta automáticamente a nuevos validadores sin configuración

### Para el Rendimiento
- **Cache inteligente**: Los validadores se cargan una sola vez y se reutilizan
- **Carga bajo demanda**: Solo se instancian los validadores que realmente se necesitan
- **Singleton optimizado**: Una instancia por validador reduce el uso de memoria

### Para la Robustez
- **Manejo silencioso de errores**: Si un validador no se encuentra, el flujo continúa
- **Separación de concerns**: Cada validador maneja una regla específica de negocio
- **Evolución gradual**: Validadores pueden agregarse o modificarse independientemente

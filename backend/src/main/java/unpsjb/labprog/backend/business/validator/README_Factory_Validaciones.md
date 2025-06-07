# Sistema de Validaciones con Patrón Factory

Este documento explica el nuevo sistema de validaciones implementado usando el patrón Factory con reflexión automática, inspirado en el ejemplo de `CommandFactory`.

## Características Principales

- **Carga lazy (bajo demanda)**: Los validadores se cargan solo cuando se necesitan
- **Cache de instancias**: Una vez cargado, el validador se mantiene en memoria
- **Patrón Singleton**: Cada validador implementa Singleton
- **Manejo de errores robusto**: Captura errores de reflexión y los maneja apropiadamente
- **Sin archivos de configuración**: Utiliza convenciones de nomenclatura

## Arquitectura

### Componentes Principales

1. **Validator<T>**: Interfaz base para todos los validadores
2. **ValidatorFactory**: Factory que gestiona la carga y cache de validadores
3. **LicenciaValidator**: Coordinador principal que usa el factory
4. **Validadores específicos**: Implementaciones concretas en el paquete `validators`

### Convenciones de Nomenclatura

El factory busca clases siguiendo este patrón:
```
unpsjb.labprog.backend.business.validator.licencia.validators.{CapitalizedName}Validator
```

Ejemplos:
- `"solapamiento"` → `SolapamientoValidator`
- `"designaciones"` → `DesignacionesValidator` 
- `"articulo5a"` → `Articulo5aValidator`

## Validadores Implementados

### Validadores Generales
- **FechaValidator**: Valida rangos de fechas
- **SolapamientoValidator**: Verifica solapamiento entre licencias
- **DesignacionesValidator**: Verifica designaciones activas

### Validadores de Artículos
- **Articulo5aValidator**: Artículo 5A - Enfermedad (máx 30 días/año, certificado médico)
- **Articulo23aValidator**: Artículo 23A - Atención familiar (máx 30 días/año)
- **Articulo36aValidator**: Artículo 36A - Asuntos particulares (máx 2 días/mes, 6 días/año)

## Uso del Sistema

El `LicenciaValidator` coordina todas las validaciones:

```java
@Service
public class LicenciaService {
    @Autowired
    private LicenciaValidator validator;
    
    public Licencia save(Licencia licencia) {
        try {
            validator.validar(licencia); // Aplica todas las reglas
            licencia.setEstado(Estado.VALIDO);
        } catch (BusinessLogicException e) {
            licencia.setEstado(Estado.INVALIDO);
            // Manejar error...
        }
        return repository.save(licencia);
    }
}
```

## Agregar Nuevos Validadores

Para agregar un nuevo validador:

1. Crear la clase en `validators/` siguiendo las convenciones:
```java
public class MiNuevoValidator implements Validator<Licencia> {
    private static MiNuevoValidator instance = null;
    
    private MiNuevoValidator() {}
    
    public static MiNuevoValidator getInstance() {
        if (instance == null)
            instance = new MiNuevoValidator();
        return instance;
    }
    
    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        // Lógica de validación
    }
}
```

2. Usar en LicenciaValidator:
```java
Validator<Licencia> miValidador = validatorFactory.getValidator("minuevo");
if (miValidador != null) {
    miValidador.validate(licencia);
}
```

## Ventajas del Sistema

1. **Extensibilidad**: Fácil agregar nuevos validadores sin modificar código existente
2. **Mantenibilidad**: Cada validador es independiente y reutilizable
3. **Performance**: Cache evita recrear instancias
4. **Flexibilidad**: Validadores se cargan dinámicamente según necesidad
5. **Testabilidad**: Cada validador puede probarse independientemente

## Migración desde Sistema Anterior

El sistema anterior basado en `LicenciaValidationRule` y Spring DI ha sido completamente reemplazado. Los tests existentes deberían seguir funcionando sin cambios ya que la interfaz pública del `LicenciaValidator.validar()` se mantiene igual.

## Notas de Implementación

- **Inyección de Dependencias**: Los validadores Singleton reciben dependencias vía setters después de la creación
- **Manejo de Errores**: El factory captura errores de reflexión y retorna null, permitiendo que el flujo continúe
- **Thread Safety**: Los validadores Singleton deben ser thread-safe
- **Convenciones**: Es importante seguir las convenciones de nomenclatura para que la reflexión funcione correctamente

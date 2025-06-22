# Sistema de Gestión de Novedades Docentes Secundarios
## Escuela 775 - Puerto Madryn, Chubut

**Autor:** Bonansea Camaño, Mariano Nicolás  
**Materia:** Laboratorio de Programación y Lenguajes  
**Universidad:** Universidad Nacional de la Patagonia San Juan Bosco  

---

## 📑 Índice

1. [Descripción General](#-descripción-general)
2. [Problema Planteado](#-problema-planteado)
3. [Objetivo Principal](#-objetivo-principal)
4. [Funcionalidades del Sistema](#-funcionalidades-del-sistema)
   - [4.1 Administración de Designaciones](#41-administración-de-designaciones)
   - [4.2 Administración del Personal](#42-administración-del-personal)
   - [4.3 Administración de Licencias](#43-administración-de-licencias)
   - [4.4 Sistema de Informes](#44-sistema-de-informes)
5. [Arquitectura del Sistema](#-arquitectura-del-sistema)
6. [Modelo de Dominio](#-modelo-de-dominio)
7. [Criterios de Satisfacción](#-criterios-de-satisfacción)
8. [Casos de Verificación](#-casos-de-verificación)
9. [Configuración del Entorno](#-configuración-del-entorno)
10. [Estructura del Proyecto](#-estructura-del-proyecto)
11. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
12. [Sistema de Validaciones Dinámicas](#-sistema-de-validaciones-dinámicas)

---

## 🎯 Descripción General

El **Sistema de Gestión de Novedades Docentes Secundarios** es una aplicación web desarrollada para la Escuela 775 de Puerto Madryn, Chubut, que permite administrar de manera integral las licencias docentes, designaciones y la generación automatizada del parte diario de novedades del personal.

El sistema está diseñado para cumplir con las normativas del Ministerio de Educación de la Provincia del Chubut y facilitar la gestión administrativa de la institución educativa.

---

## 🏫 Problema Planteado

La Escuela 775 de Puerto Madryn dicta materias de nivel secundario según las normativas del Ministerio de Educación del Chubut. La institución enfrenta los siguientes desafíos:

- **Gestión Manual de Licencias**: El proceso actual de administración de licencias docentes es manual y propenso a errores
- **Verificación de Cumplimiento**: Dificultad para verificar el cumplimiento de los requisitos normativos para otorgar licencias
- **Trazabilidad**: Falta de un sistema que permita rastrear el historial de novedades del personal
- **Generación de Reportes**: Proceso manual y complejo para generar el parte diario y reportes anuales
- **Control de Designaciones**: Necesidad de un sistema que valide las designaciones y evite solapamientos

---

## 🎯 Objetivo Principal

Proveer una **herramienta integral de gestión de novedades de licencias** solicitadas por los docentes, que permita:

- ✅ Generar automáticamente el "parte diario de novedades del personal"
- ✅ Administrar tipos de designación, divisiones y cargos
- ✅ Gestionar designaciones de docentes a cargos y espacios curriculares
- ✅ Verificar el cumplimiento de requisitos normativos para licencias
- ✅ Mantener trazabilidad completa de actividades y novedades
- ✅ Emitir planillas de novedades diarias y anuales

---

## 🔧 Funcionalidades del Sistema

### 4.1 Administración de Designaciones

#### **Tipos de Designación**
- Gestión completa (ABMC) de todos los cargos y espacios curriculares
- Registro histórico de cargos disponibles en la escuela
- Clasificación entre cargos directivos y espacios curriculares

#### **Divisiones**
- Administración de todas las divisiones de la escuela
- Información detallada: año, número, turno y vigencia
- Gestión de cambios en la estructura institucional

#### **Cargos**
- Asociación de tipos de designación con divisiones específicas
- Control de vigencia según planes curriculares
- Validación de asignaciones y espacios curriculares

### 4.2 Administración del Personal

- **Gestión de Personas**: ABMC completo del personal de la escuela
- **Designaciones**: Administración de asignaciones a cargos y espacios curriculares
- **Validaciones**: Verificación automática de consistencia de información
- **Suplencias**: Gestión especializada de reemplazos temporales
- **Historial**: Trazabilidad completa de designaciones del personal

### 4.3 Administración de Licencias

- **Proceso de Validación**: Sistema automático de verificación de requisitos
- **Control Normativo**: Cumplimiento de artículos del reglamento docente
- **Gestión de Períodos**: Administración precisa de fechas y duraciones
- **Alertas y Advertencias**: Notificaciones de inconsistencias
- **Registro de Decisiones**: Documentación de otorgamientos excepcionales

### 4.4 Sistema de Informes

- 📊 **Parte Diario de Licencias**: Reporte automático de novedades diarias
- 📈 **Informe Anual de Concepto**: Evaluación del personal por período
- 🗓️ **Mapa de Horarios**: Visualización de designaciones por división
- ⚠️ **Espacios Sin Cubrir**: Reporte de vacantes y licencias sin reemplazo

---

## 🏗️ Arquitectura del Sistema

El sistema utiliza una **arquitectura de microservicios** con las siguientes capas:

- **Frontend**: Angular 19.2.0 con diseño responsivo y componentes modernos
- **Backend**: Spring Boot 3 con API REST y validaciones automáticas
- **Base de Datos**: PostgreSQL para persistencia robusta y confiable

### Características Arquitectónicas

- **Separación de Responsabilidades**: Frontend y Backend completamente desacoplados
- **API REST**: Comunicación mediante endpoints RESTful estándar
- **Responsive Design**: Interfaz adaptable a diferentes dispositivos
- **Containerización**: Servicios aislados y replicables
- **Gestión Automatizada**: Scripts personalizados para operaciones comunes

---

## 📋 Modelo de Dominio

El sistema se basa en un modelo de dominio robusto que incluye las siguientes entidades principales:

- **Persona**: Información del personal docente y administrativo
- **TipoDesignacion**: Catálogo de cargos y espacios curriculares
- **Division**: Estructura organizacional de la escuela
- **Cargo**: Instancias específicas de designaciones
- **Designacion**: Asignación de personal a cargos
- **Licencia**: Solicitudes y otorgamientos de ausencias
- **Horario**: Distribución temporal de actividades

![Diagrama de Dominio](diagram.png)


## ⚙️ Configuración del Entorno

Para la instalación y configuración del entorno de desarrollo, siga el [INSTRUCTIVO OFICIAL](https://git.fi.mdn.unp.edu.ar/labprog/talleres/taller-restful-uix).

### Prerrequisitos
- **Docker y Docker Compose**: Para contenedorización y orquestación
- **Git**: Control de versiones
- **Sistema Operativo**: Linux/macOS/Windows con WSL2

### Instalación y Configuración

#### 1. Preparación del Entorno
```bash
# Clonar el repositorio del proyecto
git clone [URL_DEL_REPOSITORIO]
cd partes-doscente

# Dar permisos de ejecución al script de gestión
chmod +x lpl
```

#### 2. Construcción e Inicialización
```bash
# Construir las imágenes Docker
./lpl build

# Levantar todos los servicios
./lpl up

# Verificar que los servicios estén ejecutándose
docker compose ps
```

#### 3. Configuración de la Base de Datos y Datos Iniciales
```bash
# Ejecutar tests para cargar datos iniciales al sistema
./lpl test

# Si necesita limpiar los datos de prueba del sistema
./lpl staging limpiar
```

#### 4. Acceso a los Servicios
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **Base de Datos**: localhost:5432

### Gestión del Proyecto con Script LPL

El proyecto incluye un script `lpl` que facilita la gestión del entorno:

```bash
# Comandos principales
./lpl build          # Construir imágenes Docker
./lpl up             # Iniciar servicios
./lpl down           # Detener servicios
./lpl restart [servicio]  # Reiniciar servicio específico
./lpl logs [servicio]     # Ver logs
./lpl sh [contenedor]     # Acceder al shell del contenedor
./lpl test           # Ejecutar pruebas automatizadas
./lpl staging [script]    # Cargar scripts SQL
```

### Desarrollo Frontend

#### Acceso al Contenedor Frontend
```bash
# Conectar al contenedor del frontend
./lpl sh pd-frontend

# Dentro del contenedor, instalar dependencias
npm install
```

#### Librerías y Dependencias Incluidas

**Framework Principal:**
- **Angular 19.2.0**: Framework de desarrollo web
- **TypeScript 5.7.2**: Lenguaje de programación tipado

**UI/UX y Estilos:**
- **Bootstrap 5.3.5**: Framework CSS responsive
- **ng-bootstrap 18.0.0**: Componentes Bootstrap para Angular
- **Font Awesome 4.7.0**: Iconografía
- **Animate.css 4.1.1**: Animaciones CSS
- **AOS 2.3.4**: Animate On Scroll library
- **GSAP 3.13.0**: Animaciones avanzadas JavaScript

**Gráficos y Visualización:**
- **ApexCharts 4.7.0**: Librería de gráficos interactivos
- **ng-apexcharts 1.15.0**: Wrapper Angular para ApexCharts

**Generación de Reportes:**
- **jsPDF 3.0.1**: Generación de documentos PDF
- **html2canvas 1.4.1**: Captura de elementos HTML como imágenes

**Utilidades:**
- **RxJS 7.8.0**: Programación reactiva
- **@popperjs/core 2.11.8**: Posicionamiento de tooltips y popovers


### Desarrollo Backend

#### Acceso al Contenedor Backend
```bash
# Conectar al contenedor del backend
./lpl sh pd-backend

# Ejecutar comandos Maven
./lpl mvn clean install
./lpl mvn spring-boot:run
```

### Pruebas y Testing

```bash
# Ejecutar suite completa de pruebas
./lpl test

# Ver logs en tiempo real
./lpl logs

# Ver logs de un servicio específico
./lpl log pd-frontend
./lpl log pd-backend
```

### Solución de Problemas Comunes

#### Reiniciar Servicios
```bash
# Reiniciar todos los servicios
./lpl restart

# Reiniciar servicio específico
./lpl restart pd-frontend
./lpl restart pd-backend
```

#### Limpiar y Reconstruir
```bash
# Detener servicios
./lpl down

# Limpiar volúmenes y reconstruir
docker system prune -f
./lpl build
./lpl up
```

---

## 📁 Estructura del Proyecto

```
├── backend/              # API REST con Spring Boot
│   ├── src/main/java/    # Código fuente Java
│   ├── src/main/resources/ # Configuraciones
│   └── Dockerfile        # Imagen Docker backend
├── frontend/             # Aplicación Angular
│   ├── src/app/          # Componentes y servicios
│   ├── public/           # Recursos estáticos
│   └── Dockerfile        # Imagen Docker frontend
├── testing/              # Pruebas automatizadas
│   ├── features/         # Especificaciones Cucumber
│   └── step_defs/        # Implementación de pruebas
├── staging/              # Scripts de base de datos
└── docker-compose.yml    # Orquestación de servicios
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Java 17**: Lenguaje de programación principal
- **Spring Boot 3**: Framework de desarrollo
- **Spring Data JPA**: Persistencia de datos
- **PostgreSQL**: Base de datos relacional
- **Maven**: Gestión de dependencias

### Frontend
- **Angular 19.2.0**: Framework de desarrollo web moderno
- **TypeScript 5.7.2**: Lenguaje de programación tipado
- **Bootstrap 5.3.5**: Framework CSS responsive
- **ng-bootstrap 18.0.0**: Componentes Bootstrap nativos para Angular
- **RxJS 7.8.0**: Programación reactiva y manejo de streams

### UI/UX y Visualización
- **Font Awesome 4.7.0**: Biblioteca de iconos vectoriales
- **Animate.css 4.1.1**: Librería de animaciones CSS
- **AOS 2.3.4**: Animate On Scroll - animaciones al hacer scroll
- **GSAP 3.13.0**: GreenSock Animation Platform - animaciones avanzadas
- **ApexCharts 4.7.0**: Gráficos interactivos y dashboards
- **ng-apexcharts 1.15.0**: Integración Angular para ApexCharts

### Generación de Reportes
- **jsPDF 3.0.1**: Generación de documentos PDF en el cliente
- **html2canvas 1.4.1**: Captura de elementos DOM como imágenes
- **@popperjs/core 2.11.8**: Posicionamiento inteligente de elementos

### Testing y Quality Assurance
- **Cucumber**: Pruebas de comportamiento (BDD)

### DevOps y Contenedorización
- **Docker**: Contenedorización de aplicaciones
- **Docker Compose**: Orquestación de servicios
- **Script LPL**: Herramienta personalizada de gestión del proyecto
- **Git**: Control de versiones

---

## 🔧 Sistema de Validaciones Dinámicas

### Arquitectura de Validaciones con Patrón Factory y Command

El sistema implementa un **patrón Factory avanzado** combinado con **Chain of Responsibility** para la gestión dinámica de validaciones de reglas de negocio. Esta arquitectura permite:

#### **Características Principales:**
- ✨ **Carga en Caliente**: Los validadores se pueden agregar sin recompilación
- 🔄 **Reflexión Automática**: Detección automática de nuevos validadores
- 📊 **Cache Inteligente**: Optimización de memoria con patrón Singleton
- 🎯 **Configuración Externa**: Orden de validaciones configurable mediante archivos

#### **Componentes del Sistema:**

**1. Factory de Validadores**
```java
// Ejemplo de uso del Factory
LicenciaValidatorFactory factory = LicenciaValidatorFactory.getInstance();
Validator<Licencia> validator = factory.getValidator("articulo5a");
```

**2. Chain of Responsibility**
```java
// Configuración dinámica de cadena de validaciones
ValidationChain<Licencia> chain = new ValidationChain<>(false); // modo acumulativo
chain.addValidator(fechaValidator, "fecha")
     .addValidator(articuloValidator, "articulo")
     .addValidator(solapamientoValidator, "solapamiento");
```

**3. Configuración Externe en Caliente**
```properties
# archivo validation-config.properties
licencia.validation.order=fecha,designaciones,articulo,solapamiento
licencia.validation.stopOnFirstError=false
```

#### **Convenciones de Nomenclatura:**
El sistema utiliza convenciones automáticas para localizar validadores:

- **Patrón de clase**: `{CapitalizedName}Validator`
- **Ubicación**: `unpsjb.labprog.backend.business.validator.licencia.validators.*`
- **Método obligatorio**: `getInstance()` (patrón Singleton)

#### **Ejemplo: Agregar Nuevo Validador de Artículo**

**Paso 1: Crear la clase del validador**
```java
package unpsjb.labprog.backend.business.validator.licencia.validators;

public class Articulo42bValidator implements Validator<Licencia> {
    private static Articulo42bValidator instance = null;
    private static final int MAX_DIAS_POR_ANIO = 15;
    private static final String ARTICULO_CODE = "42B";
    
    private Articulo42bValidator() {}
    
    public static Articulo42bValidator getInstance() {
        if (instance == null) {
            instance = new Articulo42bValidator();
        }
        return instance;
    }
    
    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        if (!ARTICULO_CODE.equals(licencia.getArticuloLicencia().getArticulo())) {
            return; // No aplica para este artículo
        }
        
        // Implementar lógica específica del artículo 42B
        // Ejemplo: validar límites, condiciones especiales, etc.
    }
}
```

**Paso 2: Carga automática**
```java
// El factory detecta automáticamente el nuevo validador
Validator<Licencia> nuevo = factory.getValidator("articulo42b");
// ¡No requiere modificar código existente!
```

**Paso 3: Configuración dinámica (opcional)**
```properties
# Actualizar configuración para incluir nuevas validaciones
licencia.validation.order=fecha,designaciones,articulo,articulo42b,solapamiento
```

#### **Validadores Implementados:**

**Validadores Base:**
- `GenericFechaValidator`: Validación de rangos de fechas
- `SolapamientoValidator`: Detección de conflictos temporales
- `DesignacionesValidator`: Verificación de asignaciones activas

**Validadores por Artículo:**
- `Articulo5aValidator`: Licencia por enfermedad (30 días/año + certificado médico)
- `Articulo23aValidator`: Atención familiar (30 días/año)
- `Articulo36aValidator`: Asuntos particulares (2 días/mes, 6 días/año)

#### **Ventajas del Sistema:**

**Para Desarrollo:**
- 🚀 **Zero Downtime**: Agregar validadores sin reiniciar
- 🔧 **Mantenibilidad**: Cada validador es independiente y testeable
- 📈 **Escalabilidad**: Soporte para cientos de reglas complejas

**Para Rendimiento:**
- ⚡ **Lazy Loading**: Carga bajo demanda de validadores
- 💾 **Cache Eficiente**: Una instancia por validador en memoria
- 🎯 **Optimización**: Solo se cargan los validadores necesarios

---

*Este proyecto fue desarrollado como trabajo práctico para la materia Laboratorio de Programación y Lenguajes de la UNPSJB, enfocado en resolver las necesidades reales de gestión administrativa de la Escuela 775 de Puerto Madryn.*
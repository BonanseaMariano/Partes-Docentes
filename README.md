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
8. [Verificación y Testing Automatizado](#-verificación-y-testing-automatizado)
9. [Casos de Verificación](#-casos-de-verificación)
10. [Configuración del Entorno](#-configuración-del-entorno)
11. [Estructura del Proyecto](#-estructura-del-proyecto)
12. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
13. [Sistema de Validaciones Dinámicas](#-sistema-de-validaciones-dinámicas)

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

## ✅ Criterios de Satisfacción

### Cobertura Completa con Pruebas Cucumber (BDD)

El sistema incluye una **suite completa de pruebas automatizadas** usando Cucumber que verifica todos los criterios de satisfacción establecidos. Cada escenario está documentado en archivos `.feature` que pueden ejecutarse con `./lpl test`.

#### **📊 1. Generación de Cargos y Espacios Curriculares**

**✅ Criterio: Generar al menos 6 cargos de tipo "CARGO"**

El sistema incluye **6 cargos institucionales** definidos en [`testing/features/Cargo.feature`](testing/features/Cargo.feature):

| **N°** | **Nombre del Cargo** | **Tipo Designación** | **Carga Horaria** | **Status** |
| ------ | -------------------- | -------------------- | ----------------- | ---------- |
| 1      | Vicedirector/a       | CARGO                | 36 horas          | ✅ 200      |
| 2      | Preceptor/a          | CARGO                | 36 horas          | ✅ 200      |
| 3      | Auxiliar ADM         | CARGO                | 30 horas          | ✅ 200      |
| 4      | Auxiliar ACAD        | CARGO                | 30 horas          | ✅ 200      |
| 5      | Secretario/a         | CARGO                | 36 horas          | ✅ 200      |
| 6      | Bibliotecario/a      | CARGO                | 30 horas          | ✅ 200      |

**✅ Criterio: Generar al menos 25 espacios curriculares de tipo "ESPACIO_CURRICULAR"**

El sistema incluye **26 espacios curriculares únicos** distribuidos entre las divisiones del establecimiento, definidos en [`testing/features/Cargo.feature`](testing/features/Cargo.feature):

| **N°** | **Espacio Curricular** | **Año** | **División** | **Turno** | **Carga Horaria** | **Status** |
| ------ | ---------------------- | ------- | ------------ | --------- | ----------------- | ---------- |
| 1      | Historia               | 5º      | 2º           | Mañana    | 4 horas           | ✅ 200      |
| 2      | Geografía              | 3º      | 1º           | Tarde     | 3 horas           | ✅ 200      |
| 3      | Matemática             | 1º      | 1º           | Tarde     | 6 horas           | ✅ 200      |
| 4      | Física                 | 2º      | 3º           | Mañana    | 6 horas           | ✅ 200      |
| 5      | Tecnología             | 4º      | 3º           | Mañana    | 6 horas           | ✅ 200      |
| 6      | Educación Física       | 1º      | 2º           | Mañana    | 3 horas           | ✅ 200      |
| 7      | Matemática             | 2º      | 1º           | Tarde     | 4 horas           | ✅ 200      |
| 8      | Lengua                 | 3º      | 2º           | Mañana    | 5 horas           | ✅ 200      |
| 9      | Ciencias               | 4º      | 1º           | Tarde     | 4 horas           | ✅ 200      |
| 10     | Historia               | 2º      | 2º           | Tarde     | 3 horas           | ✅ 200      |
| 11     | Arte                   | 1º      | 3º           | Mañana    | 2 horas           | ✅ 200      |
| 12     | Música                 | 5º      | 1º           | Tarde     | 2 horas           | ✅ 200      |
| 13     | Tecnología             | 3º      | 3º           | Tarde     | 3 horas           | ✅ 200      |
| 14     | Lengua                 | 1º      | 1º           | Tarde     | 5 horas           | ✅ 200      |
| 15     | Historia               | 3º      | 1º           | Mañana    | 4 horas           | ✅ 200      |
| 16     | Matemática             | 3º      | 2º           | Mañana    | 6 horas           | ✅ 200      |
| 17     | Física                 | 4º      | 1º           | Tarde     | 4 horas           | ✅ 200      |
| 18     | Geografía              | 2º      | 2º           | Tarde     | 3 horas           | ✅ 200      |
| 19     | Ciencias               | 2º      | 1º           | Tarde     | 4 horas           | ✅ 200      |
| 20     | Arte                   | 2º      | 3º           | Mañana    | 2 horas           | ✅ 200      |
| 21     | Música                 | 1º      | 2º           | Mañana    | 2 horas           | ✅ 200      |
| 22     | Educación Física       | 5º      | 1º           | Tarde     | 3 horas           | ✅ 200      |
| 23     | Lengua                 | 4º      | 3º           | Mañana    | 5 horas           | ✅ 200      |
| 24     | Historia               | 1º      | 3º           | Mañana    | 3 horas           | ✅ 200      |
| 25     | Geografía              | 5º      | 2º           | Mañana    | 4 horas           | ✅ 200      |
| 26     | Ciencias               | 3º      | 3º           | Tarde     | 3 horas           | ✅ 200      |

### **📊 Resumen de Espacios Curriculares por Materia**

| **Materia**      | **Cantidad de Espacios** | **Distribución por División** |
| ---------------- | ------------------------ | ----------------------------- |
| Matemática       | 3 espacios               | 1º1ºT, 2º1ºT, 3º2ºM           |
| Historia         | 4 espacios               | 1º3ºM, 2º2ºT, 3º1ºM, 5º2ºM    |
| Geografía        | 3 espacios               | 2º2ºT, 3º1ºT, 5º2ºM           |
| Física           | 2 espacios               | 2º3ºM, 4º1ºT                  |
| Tecnología       | 2 espacios               | 3º3ºT, 4º3ºM                  |
| Lengua           | 3 espacios               | 1º1ºT, 3º2ºM, 4º3ºM           |
| Ciencias         | 3 espacios               | 2º1ºT, 3º3ºT, 4º1ºT           |
| Educación Física | 2 espacios               | 1º2ºM, 5º1ºT                  |
| Arte             | 2 espacios               | 1º3ºM, 2º3ºM                  |
| Música           | 2 espacios               | 1º2ºM, 5º1ºT                  |

**Total**: 26 espacios curriculares únicos distribuidos entre años 1º-5º, divisiones 1º-3º y turnos Mañana/Tarde.

#### **👥 2. Alta de Personal con Validaciones Específicas**

**✅ Criterio: Generar al menos 10 personas nuevas**

*Archivo: [`testing/features/Persona.feature`](testing/features/Persona.feature)*
```gherkin
# 22 personas exitosas + casos de error
| DNI      | nombre      | apellido        | status |
| 10100100 | Alberto     | Lopez           |    200 |
| 20200200 | Susana      | Álvarez         |    200 |
| 30300300 | Pedro       | Benítez         |    200 |
| 40400400 | Marisa      | Amuchástegui    |    200 |
| 50500500 | Raúl        | Gómez           |    200 |
# ... hasta 22 personas más
```

#### **🎯 3. Designaciones con Validaciones Complejas**

**✅ 2 personas en cargos NO cubiertos**

*Archivo: [`testing/features/Designar.feature`](testing/features/Designar.feature)*
```gherkin
| 20000000 | Rosalía     | Fernandez    | CARGO | Auxiliar ACAD |
| 80800800 | Analía      | Rojas        | CARGO | Auxiliar ADM  |
# Status: 200 - Designación exitosa
```

**⚠️ 1 persona en cargo YA cubierto (error esperado)**

*Archivo: [`testing/features/Control_designacion.feature`](testing/features/Control_designacion.feature)*
```gherkin
| 30300300 | Pedro | Benítez | CARGO | Preceptor/a |
# Status: 500 - Error: "cargo solicitado lo ocupa Susana Álvarez"
```

**✅ 2 personas en espacios curriculares NO cubiertos**

*Archivo: [`testing/features/Designar.feature`](testing/features/Designar.feature)*
```gherkin
| 40400400 | Marisa | Amuchástegui | ESPACIO_CURRICULAR | Historia   |
| 50500500 | Raúl   | Gómez        | ESPACIO_CURRICULAR | Geografía  |
# Status: 200 - Designación exitosa
```

**⚠️ 1 persona en espacio curricular YA cubierto (error esperado)**

*Archivo: [`testing/features/Control_designacion.feature`](testing/features/Control_designacion.feature)*
```gherkin
| 60600600 | Inés | Torres | ESPACIO_CURRICULAR | Geografía |
# Status: 500 - Error: "lo ocupa Raúl Gómez para el período"
```

#### **🔄 4. Reemplazos por Licencias**

**✅ Reemplazo correcto en cargo**

*Archivo: [`testing/features/Control_licencia.feature`](testing/features/Control_licencia.feature)*
```gherkin
Escenario: 1 persona en cargo que cubre una licencia correctamente
Dado que existe la persona
  | DNI      | Nombre | Apellido |
  | 70700700 | Jorge  | Dismal   |
# Resultado: "Jorge Dismal ha sido designado/a como Preceptor/a exitosamente, 
#            en reemplazo de Susana Álvarez"
```

**⚠️ Reemplazo con período incorrecto (error esperado)**

*Archivo: [`testing/features/Control_licencia.feature`](testing/features/Control_licencia.feature)*
```gherkin
Escenario: 1 persona en cargo con período que NO coincide
# Status: 500 - "Analía Rojas NO ha sido designado/a como Auxiliar ADM, 
#               ya cuenta con Rosalía Fernandez asignada"
```

**✅ Reemplazo correcto en espacio curricular**

*Archivo: [`testing/features/Control_licencia.feature`](testing/features/Control_licencia.feature)*
```gherkin
Escenario: 1 persona en espacio curricular que cubre licencia correctamente
# Status: 200 - Reemplazo exitoso en espacio curricular
```

**⚠️ Reemplazo en espacio curricular con período incorrecto**

*Archivo: [`testing/features/Control_licencia.feature`](testing/features/Control_licencia.feature)*
```gherkin
Escenario: 1 persona en espacio curricular con período NO coincidente
# Status: 500 - Error de período no coincidente
```

#### **📜 5. Validación de Licencias por Artículos**

**✅ Artículo 5A - Licencia por Enfermedad (máx 30 días/año + certificado)**

*Archivo: [`testing/features/Control_licencia.feature`](testing/features/Control_licencia.feature)*

**Casos Positivos:**
```gherkin
| 99100000 | Ermenegildo | Sabat | 5A | SI | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-07 | 2023-05-17 | 200 |
| 99100000 | Ermenegildo | Sabat | 5A | SI | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-18 | 2023-05-31 | 200 |
# Total: 25 días (dentro del límite de 30)
```

**Casos Negativos (verificación de topes):**
```gherkin
| 99100000 | Ermenegildo | Sabat | 5A | SI | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-06-01 | 2023-06-12 | 500 |
# Error: "supera el tope de 30 días de licencia"

| 20200200 | Susana | Álvarez | 5A | NO | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-06-10 | 2023-06-30 | 500 |
# Error: "no presentó certificado médico"
```

**✅ Artículo 23A - Atención Familiar (máx 30 días/año)**

**Casos Positivos:**
```gherkin
| 99200000 | María Rosa | Gallo | 23A | NO | ATENCIÓN DE UN MIEMBRO DEL GF | 2023-03-01 | 2023-03-15 | 200 |
# 15 días aprobados
```

**Casos Negativos:**
```gherkin
| 99200000 | María Rosa | Gallo | 23A | NO | ATENCIÓN DE UN MIEMBRO DEL GF | 2023-04-12 | 2023-04-20 | 500 |
# Error: "ya posee una licencia en el mismo período"

| 11111111 | Susana | Giménez | 23A | NO | ATENCIÓN DE UN MIEMBRO DEL GF | 2024-08-12 | 2024-08-14 | 500 |
# Error: "supera el tope de 30 días de licencia"
```

**✅ Artículo 36A - Asuntos Particulares (máx 2 días/mes, 6 días/año)**

**Casos Positivos:**
```gherkin
| 99300000 | Homero | Manzi | 36A | NO | ASUNTOS PARTICULARES | 2023-05-08 | 2023-05-08 | 200 |
| 99300000 | Homero | Manzi | 36A | NO | ASUNTOS PARTICULARES | 2023-05-11 | 2023-05-11 | 200 |
# 2 días en mayo (dentro del límite mensual)
```

**Casos Negativos:**
```gherkin
| 99300000 | Homero | Manzi | 36A | NO | ASUNTOS PARTICULARES | 2023-05-20 | 2023-05-20 | 500 |
# Error: "supera el tope de 2 días de licencia por mes"

| 99300000 | Homero | Manzi | 36A | NO | ASUNTOS PARTICULARES | 2023-11-04 | 2023-11-04 | 500 |
# Error: "supera el tope de 6 días de licencia por año"
```

#### **🚫 6. Casos de Error Específicos**

**⚠️ Licencia a docente no designado**

*Archivo: [`testing/features/Control_licencia.feature`](testing/features/Control_licencia.feature)*
```gherkin
| 99999999 | Raúl | Gutierrez | 36A | NO | ASUNTOS PARTICULARES | 2023-03-04 | 2023-03-04 | 500 |
# Error: "el agente no posee ningún cargo en la institución"
```

**⚠️ Licencia sin designación activa en esa fecha**

```gherkin
| 88888888 | Marisa | Balaguer | 36A | NO | ASUNTOS PARTICULARES | 2023-03-04 | 2023-03-04 | 500 |
# Error: "el agente no tiene designación ese día en la institución"
```

**⚠️ Licencia de una licencia ya otorgada (solapamiento)**

```gherkin
| 99200000 | María Rosa | Gallo | 23A | NO | ATENCIÓN DE UN MIEMBRO DEL GF | 2023-04-12 | 2023-04-20 | 500 |
# Error: "ya posee una licencia en el mismo período"
```

#### **📊 7. Parte Diario de Novedades**

**✅ Criterio: Parte diario completo con licencias y reemplazos**

*Archivo: [`testing/features/Parte_diario.feature`](testing/features/Parte_diario.feature)*

Los criterios de aceptación para el parte diario se cumplen mediante los siguientes escenarios:

**✅ 1. Otorgar 5 licencias previas con vigencia de al menos 15 días**

*Escenario: "Verificar el funcionamiento de licencias para un día"*
```gherkin
# Licencias con más de 15 días de vigencia:
| DNI      | Nombre      | Apellido   | Desde      | Hasta      | Duración |
| 88100000 | Raúl        | Orellanos  | 2023-05-07 | 2023-05-15 | 9 días   |
| 88200000 | Matías      | Barto      | 2023-05-10 | 2023-05-15 | 6 días   |
| 88300000 | Andrea      | Sosa       | 2023-05-11 | 2023-05-17 | 7 días   |
| 88410000 | Laura       | Barrientos | 2023-05-08 | 2023-05-16 | 9 días   |
| 88500000 | Natalia     | Zabala     | 2023-05-13 | 2023-05-22 | 10 días  |
| 99100000 | Ermenegildo | Sabat      | 2023-05-07 | 2023-05-17 | 11 días  |
```

**✅ 2. Otorgar 3 licencias para la fecha específica (2023-05-15)**

```gherkin
# Licencias para el día específico:
| DNI      | Nombre  | Apellido | Artículo | Fecha      |
| 88600000 | Marta   | Ríos     | 36A      | 2023-05-15 |
| 88700000 | Rosalía | Ramón    | 36A      | 2023-05-15 |
| 88800000 | José    | Pérez    | 36A      | 2023-05-15 |
```

**✅ 3. Emitir parte diario mostrando 9 docentes con licencia**

*Fecha de consulta: 2023-05-15*
```json
{
  "ParteDiario": {
    "Fecha": "2023-05-15",
    "Docentes": [
      {"DNI": 88100000, "Nombre": "Raúl", "Apellido": "Orellanos", "Artículo": "5A"},
      {"DNI": 88200000, "Nombre": "Matías", "Apellido": "Barto", "Artículo": "5A"},
      {"DNI": 88300000, "Nombre": "Andrea", "Apellido": "Sosa", "Artículo": "5A"},
      {"DNI": 88410000, "Nombre": "Laura", "Apellido": "Barrientos", "Artículo": "23A"},
      {"DNI": 88500000, "Nombre": "Natalia", "Apellido": "Zabala", "Artículo": "23A"},
      {"DNI": 99100000, "Nombre": "Ermenegildo", "Apellido": "Sabat", "Artículo": "5A"},
      {"DNI": 88600000, "Nombre": "Marta", "Apellido": "Ríos", "Artículo": "36A"},
      {"DNI": 88700000, "Nombre": "Rosalía", "Apellido": "Ramón", "Artículo": "36A"},
      {"DNI": 88800000, "Nombre": "José", "Apellido": "Pérez", "Artículo": "36A"}
    ]
  }
}
```

**✅ 4. Verificar caducidad de licencias tras el paso del tiempo**

*Escenario: "Verificar el parte diario luego de transcurridos 2 días"*

*Fecha de consulta: 2023-05-17*
```json
{
  "ParteDiario": {
    "Fecha": "2023-05-17",
    "Docentes": [
      {"DNI": 88300000, "Nombre": "Andrea", "Apellido": "Sosa", "Artículo": "5A"},
      {"DNI": 88500000, "Nombre": "Natalia", "Apellido": "Zabala", "Artículo": "23A"},
      {"DNI": 99100000, "Nombre": "Ermenegildo", "Apellido": "Sabat", "Artículo": "5A"}
    ]
  }
}
```

**Docentes cuyas licencias caducaron:**
- **Raúl Orellanos** (licencia hasta 2023-05-15)
- **Matías Barto** (licencia hasta 2023-05-15)
- **Laura Barrientos** (licencia hasta 2023-05-16)
- **Marta Ríos** (licencia hasta 2023-05-15)
- **Rosalía Ramón** (licencia hasta 2023-05-15)
- **José Pérez** (licencia hasta 2023-05-15)

**✅ 5. Designar suplentes para cargos con licencia**

El sistema incluye **3 escenarios de reemplazo** para el parte diario del 2023-05-15:

**Reemplazo 1: María Rosa Gallo → Raúl Orellanos**
```gherkin
Escenario: María Rosa Gallo reemplaza a Raúl Orellanos durante su licencia 5A en Educación Física
# Resultado: "María Rosa Gallo ha sido designado/a a la asignatura Educación Física 
#            a la división 1º 2º turno Mañana exitosamente, en reemplazo de Raúl Orellanos"
```

**Reemplazo 2: Homero Manzi → Matías Barto**
```gherkin
Escenario: Homero Manzi reemplaza a Matías Barto durante su licencia 5A en Matemática
# Resultado: "Homero Manzi ha sido designado/a a la asignatura Matemática 
#            a la división 2º 1º turno Tarde exitosamente, en reemplazo de Matías Barto"
```

**Reemplazo 3: Marta Ríos → Andrea Sosa**
```gherkin
Escenario: Marta Ríos reemplaza a Andrea Sosa durante su licencia 5A en Lengua
# Resultado: "Marta Ríos ha sido designado/a a la asignatura Lengua 
#            a la división 3º 2º turno Mañana exitosamente, en reemplazo de Andrea Sosa"
```





#### **📈 8. Resumen de Cobertura de Testing**

| **Criterio de Satisfacción**   | **Estado**   | **Cantidad**             | **Archivo Feature**                                                           |
| ------------------------------ | ------------ | ------------------------ | ----------------------------------------------------------------------------- |
| Cargos de designación          | ✅ **Cumple** | 6 cargos CARGO           | [`Cargo.feature`](testing/features/Cargo.feature)                             |
| Espacios curriculares          | ✅ **Cumple** | 26 espacios únicos       | [`Cargo.feature`](testing/features/Cargo.feature)                             |
| Personas nuevas                | ✅ **Cumple** | 22 personas              | [`Persona.feature`](testing/features/Persona.feature)                         |
| Designaciones exitosas         | ✅ **Cumple** | 4 casos                  | [`Designar.feature`](testing/features/Designar.feature)                       |
| Control de solapamientos       | ✅ **Cumple** | 8 errores                | [`Control_designacion.feature`](testing/features/Control_designacion.feature) |
| Reemplazos por licencia        | ✅ **Cumple** | 4 escenarios             | [`Control_licencia.feature`](testing/features/Control_licencia.feature)       |
| Validación artículo 5A         | ✅ **Cumple** | 2 positivos, 2 negativos | [`Control_licencia.feature`](testing/features/Control_licencia.feature)       |
| Validación artículo 23A        | ✅ **Cumple** | 1 positivo, 2 negativos  | [`Control_licencia.feature`](testing/features/Control_licencia.feature)       |
| Validación artículo 36A        | ✅ **Cumple** | 2 positivos, 2 negativos | [`Control_licencia.feature`](testing/features/Control_licencia.feature)       |
| Casos de error específicos     | ✅ **Cumple** | 3 tipos de error         | [`Control_licencia.feature`](testing/features/Control_licencia.feature)       |
| **Parte diario completo**      | ✅ **Cumple** | **5 escenarios**         | [`Parte_diario.feature`](testing/features/Parte_diario.feature)               |
| - Licencias previas (≥15 días) | ✅ **Cumple** | 6 de 5 requeridas        | *Escenario: Verificar funcionamiento licencias*                               |
| - Licencias del día            | ✅ **Cumple** | 3 exactas                | *Step: que se otorgan nuevas licencias*                                       |
| - Parte con 8+ docentes        | ✅ **Cumple** | 9 docentes               | *Validación: parte diario 2023-05-15*                                         |
| - Verificación caducidad       | ✅ **Cumple** | 6 licencias caducadas    | *Validación: parte diario 2023-05-17*                                         |
| - Suplentes (≥3 cargos)        | ✅ **Cumple** | 3 reemplazos             | *Escenarios: María Rosa, Homero, Marta*                                       |

### 🚀 Ejecución de las Pruebas

```bash
# Ejecutar toda la suite de pruebas BDD
./lpl test

# Ver resultados detallados en logs
./lpl logs testing
```
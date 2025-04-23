### Laboratorio de Programación y Lenguajes
### Trabajo Práctico
# Novedades Docentes Secundarios

Para la instalación y configuración del entorno de desarrollo es necesario seguir el siguiente 
<a href="https://git.fi.mdn.unp.edu.ar/labprog/talleres/taller-restful-uix" target="_blank">INSTRUCTIVO</a>

---

## Problema Planteado
La escuela 775 de la ciudad de Puerto Madryn Dicta materias de nivel secudario según las normativas del Ministerio de Educación de la  Provincia del Chubut.
La escuela cuenta con un espacio aúlico en el que se asignan las distintas divisiones de 1º a 6º año en la que se dictan durante la semana las distintas asignaturas según la currícula académica de cada año.
Los docentes mediante la asignación de cargos se les asigna el dictado de las distintas asignaturas (materias) para cada año en las distintas divisiones con un cronograma horario según la carga de la asignatura distribuida en los días de la semana.

Según las normas vigentes del Ministerio de Educación existe un reglamento o manual del docente entre los que se encuantra la reglamentación de los distíntos artículos de licencias que puede solicitar cada docente. Los mismos expresan las distintas reglas que deben respetar para poder ser otorgados.

## Objetivo de solución
Proveer una herramienta de gestión de novedades de licencias solicitadas por los docentes, permitiendo generar el "parte diario de novedades del personal".

La solución debe administrar los tipos de designación, las divisiones y los cargos que representan la cobertura completa de cargos y espacios curriculares de la escuela para cada división año y turno. La designación de docentes a los cargos y los espacios curriculares.

La misión principal de la aplicación será la de gestionar las novedades de las licencias solicitadas por el personal de la escuela, la verificación del cumplimiento y requisitos para otorgar la misma, la trazabilidad de actividades de novedades y la emisión de las planillas respectivas de novedades, tanto las diarias como las anuales para conformación del concepto del personal.

## La solución requiere
### Administración de Designaciones
La solución contará con una administración básica de altas bajas, modificaciones y consultas (_ABMC_) de:
1. **Tipos de designación** --> representa a todos los cargos y espacios curriculares disponibles o que han estado disponibles en la escuela.
1. **Divisiones** --> representa todas las divisiones que existen en la escuela indicando el año, numero, turno y vigencia de la misma.
1. **Cargo** --> es la gestión de asociación de los tipos de designación que existen en la escuela, tanto de cargos como de espacios curriculares. Si se trata de un espacio curricular se deberá asignar la división donde se dicta el espacio. Representa todas las instancias de cargos y espacios curriculares de la escuela. Se cuenta con vigencia que representa a los distintos planes o diseños curriculares implementados en los distintos años de la vida de la escuela.

### Administración del Personal
Para el correcto funcionamiento de información de la escuela es muy importante conocer el detalle de personas (personal) que trabaja o trabajó en la escuela, como así sus sucesivas designaciones a los cargos o espacios curriculares.

Para ello la aplicación deberá contar con la administración básica (ABMC) de Personas que representa al personal de la escuela.

También deberá contar con la gestión de designaciones de dichas personas a los cargos, que bien podrá ser un cargo o un espacio curricular. La gestión de designaciones se realizará mediante novedades de altas y bajas del personal.

La administración del personal deberá realizar todas las validaciones y verificaciones requeridas para garantizar la consistencia de información del personal que trabaja en la escuela.

En el caso de una suplencia se deberá administrar por este mismo mecanismo ingresando el alta de la nueva persona y asignando a un cargo. La aplicación nuevamente deberá garantizar la consistencia de la misma, en este caso en particular verificar que para la misma designación existe una licencia otorgada a la persona del cargo o espacio curricular.

### Administración de Licencias
El proceso de otorgamiento de una licencia estará sujeto primero a la correcta presentación de la misma y la debidas garantías validadas por la secretaría de la escuela. Una vez superada esta fase administrativa se procederá al ingreso de la licencia en el sistema, indicando la persona solicitante y el período solicitado.

Como resultado del ingreso la aplicación deberá correr el _*Proceso de validación de Licencia*_ que indica como resultado todas las verificaciones de consistencia del otorgamiento de la misma. La secretaría, pese a las advertencias del sistema, puede otorgar igualmente la licencia y el sistema deberá registrar dicha condición.

### Informes
La aplicación deberá como mínimo generar los siguientes informes:
+ Parte diario de licencias.
+ Informe anual de concepto del personal.
+ Mapa de horarios y designaciones por división.
+ Reporte de espacios curriculares sin cubrir, ya se por falta de designación como por licencia.

## Criterio de satisfacción
### Casos y ejemplos de verificación
La verificación de calidad se realizará utilizando las siguientes premisas para un conjunto de pruebas a realizar:
* Contar con todos los cargos y espacios curriculares actuales de la Escuela 775.
* Contar con todas las divisiones para todos los turnos que existen actualmente en la escuela 775.
* Genarar al menos 6 cargos de cargos.
* Generar al menos 25 cargos de espacios curriculares repartidas entre todas las divisiones.
* Generar el alta de al menos 10 personas nuevas a la escuela, contemplando las siguientes condiciones:
  + 2 personas en cargos de designación de cargo NO cubiertas en el período indicado.
  + 1 persona en un cargo que YA cuenta con una designación para el mismo período. Informar el error respectivo y abortar la transacción.
  + 2 personas en cargos de espacio curricular NO cubiertas en el período indicado.
  + 1 persona en cargo de espacio curricular que YA cuenta con designación por otra persona para el mismo período. Informar el error respectivo y abortar la transacción.
  + 1 persona en cargo que cubre una licencia de otra persona en la misma designación. Infomar que está correcto y que reemplaza al docente que solicitó licencia.
  + 1 persona en cargo que cubre una licencia de otra persona en la misma designación, pero que no coincide el mismo período. Infomar el error respectivo y abortar la transacción.
  + 1 persona en cargo de espacio curricular que cubre una licencia de otra persona en la misma designación. Infomar que está correcto y que reemplaza al docente que solicitó licencia.
  + 1 personas en cargo de espacio curricular que cubre una licencia de otra persona en la misma designación, pero que no coincide el mismo período. Infomar el error respectivo y abortar la transacción.
* Generar el otorgamiento de Licencias con las siguientes condiciones:
  + Distintas licencias según las reglas de los distintos artículos. la menos 1 Verificación positiva por cada artículo. al menos 2 verificaciones negativas por cada artículo, demostración la violación de las condiciones de los artículos. Por ejemplo topes.
  + Licencia de 2 personas en espacios curriculares en rango de períodos que NO tienen horario previsto (no están en la escuela en el día o días solicitados).
  + Licencia a docente no designado.
  + Licencia de una licencia YA otorgada.
* Parte diario
  1. Otorgar 5 licencia para fechas previas con vigencia de al menos 15 días. y que permanezcan vigentes hasta el otorgamiento siguiente.
  2. Otorgar 3 licencias para la fecha de hoy.
    + Emitir el parte diario y verificar que muestra los 8 docentes en cuestión.
  3. Dejar pasar el tiempo hasta que caduquen las licencias de al menos 2 personas del punto 1.
    + Emitir el parte diario y verificar que la persona ya no sale más en el mismo.
  4. Designar un suplente para al menos 3 cargos de los de licencia.
    + Emitir el parte diario que deberá indicar la persona de licencia y la persona que lo reemplaza.
* Reporte de concepto
  1. generar traza de licencias para al menos 20 docentes distribuidas a lo largo del año, especialmente considerando los artículos imputables al concepto.
    + Emitir el reporte de concepto para cada docente y verificar lso resultados esperados según la documentación relevada,
* Calendario de espacios curriculares y docente asignado. Deberá mostrar la semana calendario de lunes a viernes para un turno (por ejemplo mañana) mostrando el horario de 1º hora a 8º hora y que espacio curricular y docente la ocupan.

## Modelo de Dominio propuesto
![](diagram.png)


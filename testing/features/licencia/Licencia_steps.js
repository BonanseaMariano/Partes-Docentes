const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('sync-request');

// Importamos los pasos compartidos
require('../common/common_steps');

// Variables compartidas que se usarán en el contexto
function LicenciaWorld() {
    this.currentLicencia = {
        persona: {},
        articuloLicencia: {},
        pedidoDesde: null,
        pedidoHasta: null,
        certificadoMedico: false,
        domicilio: null,
        designaciones: []
    };
    this.apiResponse = {}; // Esta variable será usada por common_steps.js
    this.reemplazante = {};
}

// Configuramos el mundo (contexto) para cada escenario
const { setWorldConstructor } = require('@cucumber/cucumber');
setWorldConstructor(LicenciaWorld);

// Paso: Dado el docente con DNI <dni>, nombre "<nombre>" y apellido "<apellido>"
Given('el docente con DNI {int}, nombre {string} y apellido {string}', function (dni, nombre, apellido) {
    // Inicializamos si no existe, respetando LicenciaWorld
    if (!this.currentLicencia) {
        this.currentLicencia = {
            persona: {},
            articuloLicencia: {},
            pedidoDesde: null,
            pedidoHasta: null,
            certificadoMedico: false,
            domicilio: null,
            designaciones: []
        };
    }

    // Buscamos la persona por DNI y la asignamos al contexto
    try {
        this.currentLicencia.persona = JSON.parse(request('GET', encodeURI(`http://pd-backend:8080/personas/dni/${dni}`)).getBody('utf8')).data;
    } catch (error) {
        console.error(`Persona con DNI ${dni} no encontrada en el sistema`);
    }
});

// Paso: Cuando solicita una licencia artículo <articulo> con descripción <descripcion> para el período <desde> <hasta>
When('solicita una licencia artículo {string} con descripción {string} para el período {string} {string}', function (articulo, descripcion, desde, hasta) {
    // Buscamos el artículo de licencia usando el endpoint específico
    // Asumimos que el artículo siempre existe en la base de datos
    const articuloRes = request('GET', encodeURI(`http://pd-backend:8080/articulos-licencias/articulo/${articulo}`));
    const articuloData = JSON.parse(articuloRes.getBody('utf8'));
    this.currentLicencia.articuloLicencia = articuloData.data;

    // Asignamos las fechas en formato ISO
    this.currentLicencia.pedidoDesde = desde ? desde + "T03:00:00" : null;
    this.currentLicencia.pedidoHasta = hasta ? hasta + "T03:00:00" : null;

    // Por defecto, asumimos que tiene certificado médico
    this.currentLicencia.certificadoMedico = true;

    // Enviamos la solicitud para crear la licencia
    try {
        const res = request('POST', 'http://pd-backend:8080/licencias', {
            json: this.currentLicencia
        });

        const responseBody = res.getBody('utf8');
        this.apiResponse = JSON.parse(responseBody);
    } catch (error) {
        console.error('Error al procesar la solicitud de licencia:', error);
        // Guardamos el error para validarlo en el paso "Entonces"
        this.apiResponse = {
            StatusCode: 500,
            StatusText: error.message || "Error al procesar la licencia"
        };
    }
});

// Paso: Dado que existe la persona (para escenario de reemplazo)
Given('que existe la persona', function (dataTable) {
    // Obtenemos la primera fila de la tabla de datos (sin encabezados)
    const persona = dataTable.hashes()[0];

    // Guardamos los datos de la persona reemplazante
    this.reemplazante = {
        dni: persona.DNI,
        nombre: persona.Nombre,
        apellido: persona.Apellido
    };

    // Verificamos si la persona existe en el sistema
    try {
        const personaRes = request('GET', encodeURI(`http://pd-backend:8080/personas/dni/${persona.DNI}`));
        // Si existe, usamos esa información
        this.reemplazante = JSON.parse(personaRes.getBody('utf8')).data;
    } catch (error) {
        console.log(`Persona reemplazante con DNI ${persona.DNI} no encontrada, se usarán los datos proporcionados`);
    }
});

// Paso: Y que existen las siguientes instancias de designación asignada
Given('que existen las siguientes instancias de designación asignada', function (dataTable) {
    // Obtenemos los datos de la tabla
    const designacionData = dataTable.hashes()[0];

    // Guardamos la información de la designación
    this.cargoDesignacion = {
        tipoDesignacion: designacionData.TipoDesignacion,
        nombre: designacionData.NombreTipoDesignacion,
        cargaHoraria: parseInt(designacionData.CargaHoraria)
    };
});

// Paso: Y que la instancia de designación está asignada a la persona con licencia
Given('que la instancia de designación está asignada a la persona con licencia {string} comprendida en el período desde {string} hasta {string}', function (articulo, desde, hasta, dataTable) {
    // Obtenemos los datos de la persona con licencia
    const personaConLicencia = dataTable.hashes()[0];

    // Guardamos los datos de la persona con licencia
    this.personaConLicencia = {
        dni: personaConLicencia.DNI,
        nombre: personaConLicencia.Nombre,
        apellido: personaConLicencia.Apellido,
        designacionDesde: personaConLicencia.Desde + "T03:00:00",
        designacionHasta: personaConLicencia.Hasta + "T03:00:00"
    };

    // Buscamos el artículo de licencia
    // Asumimos que el artículo siempre existe en la base de datos
    const articuloRes = request('GET', encodeURI(`http://pd-backend:8080/articulos-licencias/articulo/${articulo}`));
    const articuloData = JSON.parse(articuloRes.getBody('utf8'));
    const articuloLicenciaObj = articuloData.data;

    // Creamos la licencia para esta persona
    this.licenciaExistente = {
        persona: {
            dni: this.personaConLicencia.dni,
            nombre: this.personaConLicencia.nombre,
            apellido: this.personaConLicencia.apellido
        },
        articuloLicencia: articuloLicenciaObj,
        pedidoDesde: desde + "T03:00:00",
        pedidoHasta: hasta + "T03:00:00",
        certificadoMedico: true
    };

    // Simulamos que se crea una licencia para esta persona
    try {
        // Primero, verificamos si la persona ya tiene licencia en ese período
        const licenciasRes = request('GET', encodeURI(`http://pd-backend:8080/licencias/persona/${this.personaConLicencia.dni}`));
        const licencias = JSON.parse(licenciasRes.getBody('utf8')).data;

        // Si no tiene licencia, creamos una
        if (!licencias || licencias.length === 0) {
            request('POST', 'http://pd-backend:8080/licencias', {
                json: this.licenciaExistente
            });
        }
    } catch (error) {
        console.log(`Error al crear licencia para la persona con DNI ${this.personaConLicencia.dni}: ${error.message}`);
    }
});

// Paso: Y que la instancia de designación está asignada a la persona
Given('que la instancia de designación está asignada a la persona', function (dataTable) {
    // Obtenemos los datos de la persona designada
    const personaDesignada = dataTable.hashes()[0];

    // Guardamos los datos de la persona designada
    this.personaDesignada = {
        dni: personaDesignada.DNI,
        nombre: personaDesignada.Nombre,
        apellido: personaDesignada.Apellido,
        designacionDesde: personaDesignada.Desde + "T03:00:00",
        designacionHasta: personaDesignada.Hasta + "T03:00:00"
    };
});

// Paso: Cuando se solicita el servicio de designación de la persona al cargo en el período
When('se solicita el servicio de designación de la persona al cargo en el período comprendido desde {string} hasta {string}', function (desde, hasta) {
    // Creamos una designación para el reemplazante
    const designacion = {
        persona: this.reemplazante,
        cargo: {
            tipoDesignacion: this.cargoDesignacion.tipoDesignacion,
            nombre: this.cargoDesignacion.nombre,
            cargaHoraria: this.cargoDesignacion.cargaHoraria
        },
        fechaInicio: desde + "T03:00:00",
        fechaFin: hasta + "T03:00:00",
        reemplazo: true,
        reemplazaA: this.personaConLicencia || this.personaDesignada
    };

    // Enviamos la solicitud para crear la designación de reemplazo
    try {
        const res = request('POST', 'http://pd-backend:8080/designaciones', {
            json: designacion
        });

        const responseBody = res.getBody('utf8');
        this.apiResponse = JSON.parse(responseBody);
    } catch (error) {
        console.error('Error al procesar la designación de reemplazo:', error);
        this.apiResponse = {
            StatusCode: 500,
            StatusText: error.message || "Error al procesar la designación de reemplazo"
        };
    }
});

// Paso: Entonces debería obtener la siguiente resultado de <status> y "<Respuesta>"
Then('debería obtener la siguiente resultado de {int} y {string}', function (status, respuesta) {
    // Validamos el status code y el mensaje de respuesta
    // La respuesta puede tener status o StatusCode dependiendo de dónde venga
    const actualStatus = this.apiResponse.status || this.apiResponse.StatusCode || this.apiResponse.statusCode;
    assert.equal(actualStatus, status,
        `Esperaba código de estado ${status} pero obtuve ${actualStatus}`);

    // Comparamos el mensaje de respuesta
    // La respuesta puede tener message o StatusText dependiendo de dónde venga
    const actualMessage = this.apiResponse.message || this.apiResponse.StatusText || this.apiResponse.msg || "";
    assert.equal(actualMessage, respuesta,
        `Esperaba mensaje "${respuesta}" pero obtuve "${actualMessage}"`);
});

// Paso: Entonces se recupera el mensaje (para los escenarios con docstring JSON)
Then('se recupera el mensaje', function (docString) {
    // Convertimos el docString a objeto JSON para su comparación
    const expectedResponse = JSON.parse(docString);

    // Validamos el status code
    const actualStatus = this.apiResponse.status || this.apiResponse.StatusCode || this.apiResponse.statusCode;
    const expectedStatus = expectedResponse.status || expectedResponse.StatusCode;
    assert.equal(actualStatus, expectedStatus,
        `Esperaba código de estado ${expectedStatus} pero obtuve ${actualStatus}`);

    // Validamos el mensaje de texto
    const actualMessage = this.apiResponse.message || this.apiResponse.StatusText || "";
    const expectedMessage = expectedResponse.message || expectedResponse.StatusText;
    assert.equal(actualMessage, expectedMessage,
        `Esperaba mensaje "${expectedMessage}" pero obtuve "${actualMessage}"`);
});

// Los demás pasos "Entonces" pueden estar definidos en common_steps.js

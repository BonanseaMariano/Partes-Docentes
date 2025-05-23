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
    this.currentLicencia.persona = JSON.parse(request('GET', encodeURI(`http://pd-backend:8080/personas/dni/${dni}`)).getBody('utf8')).data;
});


// Paso: Cuando solicita una licencia artículo <articulo> con certificado médico <certificado> con descripción <descripcion> para el período <desde> <hasta>
When('solicita una licencia artículo {string} con certificado médico {string} con descripción {string} para el período {string} {string}', function (articulo, certificado, descripcion, desde, hasta) {
    // Buscamos el artículo de licencia usando el endpoint específico
    // Asumimos que el artículo siempre existe en la base de datos
    this.currentLicencia.articuloLicencia = JSON.parse(request('GET', encodeURI(`http://pd-backend:8080/articulos-licencias/articulo/${articulo}`)).getBody('utf8')).data;

    // Asignamos las fechas en formato ISO
    this.currentLicencia.pedidoDesde = desde ? desde + "T03:00:00" : null;
    this.currentLicencia.pedidoHasta = hasta ? hasta + "T03:00:00" : null;

    // Asignamos el valor del certificado médico en función de si es "SI" o "NO"
    this.currentLicencia.certificadoMedico = certificado === "SI";

    // Enviamos la solicitud para crear la licencia
    const res = request('POST', encodeURI('http://pd-backend:8080/licencias'), {
        json: this.currentLicencia
    });
    this.apiResponse = JSON.parse(res.getBody('utf8'));
});

// ----- PARA REEMPLAZANTES -----

// Paso: Dado que existe la persona (para escenario de reemplazo)
Given('que existe la persona', function (dataTable) {
    // Obtenemos la primera fila de la tabla de datos (sin encabezados)
    const persona = dataTable.hashes()[0];
    // Guardamos la información de la persona
    this.reemplazante = JSON.parse(request('GET', encodeURI(`http://pd-backend:8080/personas/dni/${persona.DNI}`)).getBody('utf8')).data;
});

// Paso: Y que existen las siguientes instancias de designación asignada
Given('que existen las siguientes instancias de designación asignada', function (dataTable) {
    // Obtenemos los datos de la tabla
    const designacionData = dataTable.hashes()[0];

    // Buscamos el cargo de la designación usando el endpoint '/find'
    const cargoUrl = encodeURI(`http://pd-backend:8080/cargos/find?nombre=${designacionData.NombreTipoDesignacion}&tipoDesignacion=${designacionData.TipoDesignacion}`);
    this.cargoDesignacion = JSON.parse(request('GET', cargoUrl).getBody('utf8')).data;
});

// Paso: Y que la instancia de designación está asignada a la persona con licencia {string} comprendida en el período desde {string} hasta {string}
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


});

// Paso: Cuando se solicita el servicio de designación de la persona al cargo en el período
When('se solicita el servicio de designación de la persona al cargo en el período comprendido desde {string} hasta {string}', function (desde, hasta) {
    // Creamos una designación para el reemplazante
    const designacion = {
        persona: this.reemplazante,
        cargo: this.cargoDesignacion,
        fechaInicio: desde + "T03:00:00",
        fechaFin: hasta + "T03:00:00",
    };

    // Enviamos la solicitud para crear la designación de reemplazo
    const res = request('POST', 'http://pd-backend:8080/designaciones', {
        json: designacion
    });

    this.apiResponse = JSON.parse(res.getBody('utf8'));
});

// El paso "Entonces se espera el siguiente <status> con la <respuesta>"
// está definido en common_steps.js

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

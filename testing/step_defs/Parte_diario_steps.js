const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('sync-request');

// Variables compartidas que se usarán en el contexto
function ParteDiarioWorld() {
    this.licenciasExistentes = [];
    this.nuevasLicencias = [];
    this.apiResponse = {};
    this.fechaConsulta = null;
    // Variables para reemplazos
    this.reemplazante = {};
    this.cargoDesignacion = {};
    this.personaConLicencia = {};
}

// Configuramos el mundo (contexto) para cada escenario
const { setWorldConstructor } = require('@cucumber/cucumber');
setWorldConstructor(ParteDiarioWorld);

// Paso: Dada la existencia de las siguientes licencias
Given('la existencia de las siguientes licencias', function (dataTable) {
    this.licenciasExistentes = [];

    // Solo guardamos para referencia, NO las creamos porque ya existen
    dataTable.hashes().forEach(licenciaData => {
        this.licenciasExistentes.push(licenciaData);
    });
});

// Paso: Y que se otorgan las siguientes nuevas licencias
Given('que se otorgan las siguientes nuevas licencias', function (dataTable) {
    this.nuevasLicencias = [];

    // Procesamos cada fila de la tabla y SÍ las creamos
    dataTable.hashes().forEach(licenciaData => {
        // Buscamos la persona por DNI
        const persona = JSON.parse(request('GET', encodeURI(`http://pd-backend:8080/personas/dni/${licenciaData.DNI}`)).getBody('utf8')).data;

        // Buscamos el artículo de licencia
        const articuloLicencia = JSON.parse(request('GET', encodeURI(`http://pd-backend:8080/articulos-licencias/articulo/${licenciaData.Artículo}`)).getBody('utf8')).data;

        // Creamos la licencia
        const licencia = {
            persona: persona,
            articuloLicencia: articuloLicencia,
            pedidoDesde: licenciaData.Desde,
            pedidoHasta: licenciaData.Hasta,
            certificadoMedico: licenciaData.Artículo !== "36A", // 36A no requiere certificado médico
            domicilio: null,
            designaciones: []
        };

        // Guardamos para referencia
        this.nuevasLicencias.push({
            ...licenciaData,
            licencia: licencia
        });

        // Creamos la licencia en el sistema
        const res = request('POST', encodeURI('http://pd-backend:8080/licencias'), {
            json: licencia
        });
        const response = JSON.parse(res.getBody('utf8'));

        if (response.status !== 200 && response.StatusCode !== 200) {
            throw new Error(`Error al crear licencia para ${licenciaData.Nombre} ${licenciaData.Apellido}: ${response.message || response.StatusText}`);
        }

    });
});

// Paso: Cuando se solicita el parte diario para la fecha "<fecha>"
When('se solicita el parte diario para la fecha {string}', function (fecha) {
    this.fechaConsulta = fecha;

    // Realizamos la consulta al endpoint del parte diario
    const res = request('GET', encodeURI(`http://pd-backend:8080/licencias/parte-diario/${fecha}`));

    this.apiResponse = JSON.parse(res.getBody('utf8'));

});

// Paso: Entonces el sistema responde (con docstring JSON específico para parte diario)
Then('el sistema responde', function (docString) {
    // Convertimos el docString a objeto JSON para su comparación
    const expectedResponse = JSON.parse(docString);

    // Verificamos que la respuesta sea exitosa
    const actualStatus = this.apiResponse.status || this.apiResponse.StatusCode || 200;
    assert.equal(actualStatus, 200, `Esperaba código de estado 200 pero obtuve ${actualStatus}`);

    // Verificamos que existe la estructura data
    assert(this.apiResponse.data, 'La respuesta debe contener la propiedad data');

    // Verificamos que existe la estructura ParteDiario dentro de data
    assert(this.apiResponse.data.ParteDiario, 'La respuesta debe contener la propiedad ParteDiario dentro de data');

    const actualParteDiario = this.apiResponse.data.ParteDiario;
    const expectedParteDiario = expectedResponse.ParteDiario;

    // Verificamos la fecha
    assert.equal(actualParteDiario.Fecha, expectedParteDiario.Fecha);

    // Verificamos la cantidad de docentes
    assert.equal(actualParteDiario.Docentes.length, expectedParteDiario.Docentes.length);

    // Verificamos cada docente en la lista
    expectedParteDiario.Docentes.forEach((expectedDocente, index) => {
        const actualDocente = actualParteDiario.Docentes.find(d => d.DNI === expectedDocente.DNI);

        assert(actualDocente);

        // Verificamos cada campo del docente
        assert.equal(actualDocente.DNI, expectedDocente.DNI);

        assert.equal(actualDocente.Nombre, expectedDocente.Nombre);

        assert.equal(actualDocente.Apellido, expectedDocente.Apellido);

        assert.equal(actualDocente.Artículo, expectedDocente.Artículo);

        assert.equal(actualDocente.Descripción, expectedDocente.Descripción);

        assert.equal(actualDocente.Desde, expectedDocente.Desde);

        assert.equal(actualDocente.Hasta, expectedDocente.Hasta);
    });

});

// ----- STEPS PARA REEMPLAZOS DE LICENCIAS ESPECÍFICOS PARA PARTE DIARIO -----

// Paso: Dado que existe la persona para reemplazo en parte diario (específico para parte diario)
Given('que existe la persona para reemplazo en parte diario', function (dataTable) {
    // Obtenemos la primera fila de la tabla de datos (sin encabezados)
    const persona = dataTable.hashes()[0];
    // Guardamos la información de la persona
    this.reemplazante = JSON.parse(request('GET', encodeURI(`http://pd-backend:8080/personas/dni/${persona.DNI}`)).getBody('utf8')).data;
});

// Paso: Y que existen las siguientes instancias de designación para parte diario
Given('que existen las siguientes instancias de designación para parte diario', function (dataTable) {
    // Obtenemos los datos de la tabla
    const designacionData = dataTable.hashes()[0];

    // Construimos la URL para buscar el cargo
    let cargoUrl = `http://pd-backend:8080/cargos/find?nombre=${designacionData.NombreTipoDesignacion}&tipoDesignacion=${designacionData.TipoDesignacion}`;

    // Si es ESPACIO_CURRICULAR, agregamos los parámetros de división
    if (designacionData.TipoDesignacion === 'ESPACIO_CURRICULAR') {
        cargoUrl += `&anio=${designacionData.Anio}&numDivision=${designacionData.NumDivision}&turno=${designacionData.Turno}`;
    }

    // Buscamos el cargo de la designación usando el endpoint '/find'
    this.cargoDesignacion = JSON.parse(request('GET', encodeURI(cargoUrl)).getBody('utf8')).data;
});

// Paso: Y que la designación está asignada a la persona con licencia para parte diario
Given('que la designación está asignada a la persona con licencia para parte diario {string} comprendida en el período desde {string} hasta {string}', function (articulo, desde, hasta, dataTable) {
    // Obtenemos los datos de la persona con licencia
    const personaConLicencia = dataTable.hashes()[0];

    // Guardamos los datos de la persona con licencia
    this.personaConLicencia = {
        dni: personaConLicencia.DNI,
        nombre: personaConLicencia.Nombre,
        apellido: personaConLicencia.Apellido,
        designacionDesde: personaConLicencia.Desde,
        designacionHasta: personaConLicencia.Hasta
    };
});

// Paso: Cuando se solicita designación de reemplazo para parte diario
When('se solicita designación de reemplazo para parte diario en el período desde {string} hasta {string}', function (desde, hasta) {
    // Creamos una designación para el reemplazante
    const designacion = {
        persona: this.reemplazante,
        cargo: this.cargoDesignacion,
        fechaInicio: desde,
        fechaFin: hasta,
    };

    // Enviamos la solicitud para crear la designación de reemplazo
    const res = request('POST', 'http://pd-backend:8080/designaciones', {
        json: designacion
    });

    this.apiResponse = JSON.parse(res.getBody('utf8'));
});

// Paso: Entonces el sistema devuelve el mensaje de confirmación para parte diario
Then('el sistema devuelve el mensaje de confirmación para parte diario', function (docString) {
    // Convertimos el docString a objeto JSON para su comparación
    const expectedResponse = JSON.parse(docString);

    // Validamos el status code
    const actualStatus = this.apiResponse.status || this.apiResponse.StatusCode || this.apiResponse.statusCode;
    assert.equal(actualStatus, expectedResponse.status);

    // Validamos el mensaje
    const actualMessage = this.apiResponse.message || this.apiResponse.StatusText || this.apiResponse.data;
    assert.equal(actualMessage, expectedResponse.message);
});
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('sync-request');

// Variables compartidas que se usarán en el contexto
function ParteDiarioWorld() {
    this.licenciasExistentes = [];
    this.nuevasLicencias = [];
    this.apiResponse = {};
    this.fechaConsulta = null;
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
            pedidoDesde: licenciaData.Desde + "T03:00:00",
            pedidoHasta: licenciaData.Hasta + "T03:00:00",
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
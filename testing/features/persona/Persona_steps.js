const assert = require('assert');
const { Given, When } = require('@cucumber/cucumber');
const request = require('sync-request');

// Importamos los pasos compartidos
require('../common/common_steps');

// Variables compartidas que se usarán en el contexto
function PersonaWorld() {
    this.currentPersona = {};
    this.apiResponse = {}; // Esta variable será usada por common_steps.js
}

// Configuramos el mundo (contexto) para cada escenario
const { setWorldConstructor } = require('@cucumber/cucumber');
setWorldConstructor(PersonaWorld);

// Paso: Dada la persona con <nombre> <apellido> <DNI> <CUIL> <sexo> <título> <domicilio> <teléfono>
Given(
    'la persona con {string} {string} {int} {word} {word} {string} {string} {string}',
    function (nombre, apellido, dni, cuil, sexo, titulo, domicilio, telefono) {
        this.currentPersona = {
            dni: dni,
            nombre: nombre,
            apellido: apellido,
            cuil: cuil,
            sexo: sexo,
            titulo: titulo === '' ? null : titulo,
            domicilio: domicilio,
            telefono: telefono
        };
    }
);

// Paso: Cuando se presiona el botón de guardar para persona
When('se presiona el botón de guardar para persona', function () {
    // Creamos la persona con POST
    const res = request('POST', encodeURI('http://pd-backend:8080/personas'), {
        json: this.currentPersona
    });

    this.apiResponse = JSON.parse(res.getBody('utf8'));
});
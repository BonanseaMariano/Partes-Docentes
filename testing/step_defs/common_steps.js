// filepath: /home/marianobonansea/Documentos/UNPSJB/Laboratorio de Programacion/partes-doscente/testing/features/common/common_steps.js
const assert = require('assert');
const { Then } = require('@cucumber/cucumber');

// Este archivo contiene pasos compartidos entre diferentes features
// Paso compartido: Entonces se espera el siguiente <status> con la <respuesta>
Then('se espera el siguiente {int} con la {string}', function (expectedStatus, expectedResponse) {
    assert.equal(this.apiResponse.status, parseInt(expectedStatus));

    assert.equal(this.apiResponse.message, expectedResponse);
});
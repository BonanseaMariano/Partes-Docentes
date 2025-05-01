const assert = require('assert');
const { Given, When } = require('@cucumber/cucumber');
const request = require('sync-request');

// Importamos los pasos compartidos
require('../common/common_steps');

// Variables compartidas que se usarán en el contexto
function DivisionWorld() {
    this.currentDivision = {};
    this.apiResponse = {}; // Esta variable será usada por common_steps.js
}

// Configuramos el mundo (contexto) para cada escenario
const { setWorldConstructor } = require('@cucumber/cucumber');
setWorldConstructor(DivisionWorld);

// Mapeo de turnos para asegurar que los valores coincidan con lo esperado en el backend
const turnoMap = {
    'MAÑANA': 'Mañana',
    'TARDE': 'Tarde',
    'VESPERTINO': 'Vespertino',
    'NOCHE': 'Noche'
};

// Paso: Dada la el espacio físico división con <año> <número> <orientación> <turno>
Given(
    'la el espacio físico división con {int} {int} {word} {word}',
    function (anio, numero, orientacion, turno) {
        // Usar el mapa de turnos para asegurar valores correctos
        const turnoFormateado = turnoMap[turno] || turno;

        this.currentDivision = {
            anio: anio,
            numDivision: numero,
            orientacion: orientacion,
            turno: turnoFormateado
        };
    }
);

// Paso: Cuando se presiona el botón de guardar para división
When('se presiona el botón de guardar para división', function () {
    try {
        const res = request('POST', 'http://pd-backend:8080/divisiones', {
            json: this.currentDivision
        });
        this.apiResponse = JSON.parse(res.getBody('utf8'));
    } catch (error) {
        console.error('Error al hacer la solicitud:', error.message);
        throw error;
    }
});

// El paso "Entonces se espera el siguiente {int} con la {string}" 
// ahora se encuentra en common_steps.js
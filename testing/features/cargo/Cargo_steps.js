const assert = require('assert');
const { Given, When } = require('@cucumber/cucumber');
const request = require('sync-request');

// Importamos los pasos compartidos
require('../common/common_steps');

// Variables compartidas que se usarán en el contexto
function CargoWorld() {
    this.currentCargo = {};
    this.apiResponse = {}; // Esta variable será usada por common_steps.js
}

// Configuramos el mundo (contexto) para cada escenario
const { setWorldConstructor } = require('@cucumber/cucumber');
setWorldConstructor(CargoWorld);

// Paso: Dado el cargo institucional cuyo <nombre> que da título al mismo
Given('el cargo institucional cuyo {string} que da título al mismo', function (nombre) {
    this.currentCargo = {
        nombre: nombre
    };
});

// Paso: Y que es del tipo de designación <tipoDesignación>
Given('que es del tipo de designación {string}', function (tipoDesignacion) {
    this.currentCargo.tipoDesignacion = tipoDesignacion;
});

// Paso: Y que tiene una carga horaria de <cargaHoraria> horas, con vigencia desde "<fechaDesde>" hasta "<fechaHasta>"
Given('que tiene una carga horaria de {int} horas, con vigencia desde {string} hasta {string}', function (cargaHoraria, fechaDesde, fechaHasta) {
    this.currentCargo.cargaHoraria = cargaHoraria;
    this.currentCargo.fechaDesde = fechaDesde;
    this.currentCargo.fechaHasta = fechaHasta === '' ? null : fechaHasta;
});

// Paso: Y que si el tipo es "ESPACIO CURRICULAR", opcionalmente se asigna a la división "<año>" "<número>" "<turno>"
Given('que si el tipo es {string}, opcionalmente se asigna a la división {string} {string} {string}', function (tipo, anio, numero, turno) {
    // Solo asignamos la división si es un espacio curricular y se han proporcionado los datos de la división
    if (this.currentCargo.tipoDesignacion === tipo && anio && numero && turno && anio !== '' && numero !== '' && turno !== '') {
        this.currentCargo.division = {
            anio: parseInt(anio),
            numero: parseInt(numero),
            turno: turno
        };
    }
});

// Paso: Cuando se presiona el botón de guardar
When('se presiona el botón de guardar', function () {
    /* try {
        const res = request('POST', 'http://pd-backend:8080/cargos', {
            json: this.currentCargo
        });
        this.apiResponse = JSON.parse(res.getBody('utf8'));
    } catch (error) {
        console.error('Error al hacer la solicitud:', error.message);
        throw error;
    } */
    return 'pending';
});

// El paso "Entonces se espera el siguiente <status> con la "<respuesta>"" 
// se encuentra en common_steps.js
const assert = require('assert');
const { Given, When } = require('@cucumber/cucumber');
const request = require('sync-request');

// Importamos los pasos compartidos
require('./common_steps');

// Variables compartidas que se usarán en el contexto
function DesignarWorld() {
    this.currentDesignacion = {
        persona: {},
        cargo: {},
        fechaInicio: null,
        fechaFin: null,
    };
    this.cargo = {};
    this.apiResponse = {}; // Esta variable será usada por common_steps.js
}

// Configuramos el mundo (contexto) para cada escenario
const { setWorldConstructor } = require('@cucumber/cucumber');
setWorldConstructor(DesignarWorld);

// Paso: Dada la persona con <DNI> "<nombre>" y "<apellido>"
Given('la persona con {word} {string} y {string}', function (dni, nombre, apellido) {
    // Solo inicializamos si no existe, respetando la inicialización en DesignarWorld
    if (!this.currentDesignacion) {
        this.currentDesignacion = {
            persona: {},
            cargo: {},
            fechaInicio: null,
            fechaFin: null
        };
    }

    // Buscamos la persona por DNI y la asignamos al contexto
    this.currentDesignacion.persona = JSON.parse(request('GET', encodeURI(`http://pd-backend:8080/personas/dni/${dni}`)).getBody('utf8')).data;;
});

// Paso: Y que se asigna al cargo con tipo de designación "<tipoDesignación>" y "<nombreDesignación>"
Given('que se asigna al cargo  con tipo de designación {string} y {string}', function (tipoDesignacion, nombreDesignacion) {
    // Asumimos que el cargo ya existe, solo guardamos la referencia
    this.cargo = {
        nombre: nombreDesignacion,
        tipoDesignacion: tipoDesignacion
    };
});

// Paso: Y si es espacio curricular asignada a la división "<año>" "<número>" "<turno>"
Given('si es espacio curricular asignada a la división {string} {string} {string}', function (anio, numero, turno) {
    // Construimos la URL base con los parámetros requeridos
    let encodedUrl = encodeURI(`http://pd-backend:8080/cargos/find?nombre=${this.cargo.nombre}&tipoDesignacion=${this.cargo.tipoDesignacion}&anio=${anio}&numDivision=${numero}&turno=${turno}`);

    // Buscamos el cargo correspondiente y lo asignamos a la variable de contexto
    this.currentDesignacion.cargo = JSON.parse(request('GET', encodedUrl).getBody('utf8')).data;
});

// Paso: Y se designa por el período "<fechaDesdeDesignacion>" "<fechaHastaDesignacion>"
Given('se designa por el período {string} {string}', function (fechaDesdeDesignacion, fechaHastaDesignacion) {
    // Cargamos las fechas - ahora solo fecha sin hora
    this.currentDesignacion.fechaInicio = fechaDesdeDesignacion ? fechaDesdeDesignacion : null;
    this.currentDesignacion.fechaFin = fechaHastaDesignacion && fechaHastaDesignacion !== '' ?
        fechaHastaDesignacion : null;

});

// Paso: Cuando se presiona el botón guardar
When('se presiona el botón guardar', function () {
    try {
        // Enviamos la solicitud para crear la designación
        const res = request('POST', 'http://pd-backend:8080/designaciones', {
            json: this.currentDesignacion
        });

        const responseBody = res.getBody('utf8');

        this.apiResponse = JSON.parse(responseBody);
    } catch (error) {
        console.error('Error al procesar la designación:', error);
        throw error;
    }
});

// El paso "Entonces se espera el siguiente <status> y <respuesta>" 
// se encuentra en common_steps.js
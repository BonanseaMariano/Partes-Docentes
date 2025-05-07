const assert = require('assert');
const { Given, When } = require('@cucumber/cucumber');
const request = require('sync-request');

// Importamos los pasos compartidos
require('../common/common_steps');

// Variables compartidas que se usarán en el contexto
function DesignarWorld() {
    this.currentDesignacion = {
        persona: {},
        cargo: {},
        fechaInicio: null,
        fechaFin: null,
    };
    this.cargo = {};
    this.division = null;
    this.apiResponse = {}; // Esta variable será usada por common_steps.js
}

// Configuramos el mundo (contexto) para cada escenario
const { setWorldConstructor } = require('@cucumber/cucumber');
setWorldConstructor(DesignarWorld);

// Función para buscar una persona existente por DNI
function buscarPersona(dni) {
    const res = request('GET', `http://pd-backend:8080/personas/dni/${dni}`);
    const responseBody = JSON.parse(res.getBody('utf8'));

    return responseBody.data;
}

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

    // Asumimos que la persona ya existe y la buscamos por DNI
    this.currentDesignacion.persona = buscarPersona(dni);
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
    // Solo procesamos si todos los campos tienen valores
    if (anio && numero && turno &&
        anio !== '' && numero !== '' && turno !== '') {

        // Asumimos que la división ya existe, solo guardamos la referencia
        this.division = {
            anio: parseInt(anio),
            numDivision: parseInt(numero),
            turno: turno
        };
    }
});

// Paso: Y se designa por el período "<fechaDesdeDesignacion>" "<fechaHastaDesignacion>"
Given('se designa por el período {string} {string}', function (fechaDesdeDesignacion, fechaHastaDesignacion) {
    // Cargamos las fechas
    this.currentDesignacion.fechaInicio = fechaDesdeDesignacion ? fechaDesdeDesignacion + "T03:00:00" : null;
    this.currentDesignacion.fechaFin = fechaHastaDesignacion && fechaHastaDesignacion !== '' ?
        fechaHastaDesignacion + "T03:00:00" : null;

});

// Función para buscar o recuperar un cargo existente
function buscarCargo(nombre, tipoDesignacion, division) {
    // Usamos el endpoint /find para filtrar por nombre y tipoDesignacion directamente desde el backend
    const url = `http://pd-backend:8080/cargos/find?nombre=${encodeURIComponent(nombre)}&tipoDesignacion=${encodeURIComponent(tipoDesignacion)}`;
    const res = request('GET', url);

    const responseBody = JSON.parse(res.getBody('utf8'));

    // Si es un espacio curricular, verificamos la coincidencia
    if (tipoDesignacion === 'ESPACIO_CURRICULAR') {
        const cargoConDivision = responseBody.data.find(cargo =>
            cargo.division &&
            cargo.division.anio === division.anio &&
            cargo.division.numDivision === division.numDivision &&
            cargo.division.turno === division.turno
        );
        return cargoConDivision;
    }

    // Si es un cargo solo retornamos el primer resultado que sera la unica coincidencia 
    return responseBody.data[0];
}

// Paso: Cuando se presiona el botón guardar
When('se presiona el botón guardar', function () {

    // Buscamos el cargo correspondiente
    // Si el cargo es de tipo ESPACIO_CURRICULAR, buscamos el cargo con la división
    // Si el cargo es de tipo CARGO, buscamos el cargo sin la división
    this.currentDesignacion.cargo = buscarCargo(this.cargo.nombre, this.cargo.tipoDesignacion, this.division);

    // Enviamos la solicitud para crear la designación
    const res = request('POST', 'http://pd-backend:8080/designaciones', {
        json: this.currentDesignacion
    });

    this.apiResponse = JSON.parse(res.getBody('utf8'));

});

// El paso "Entonces se espera el siguiente <status> y <respuesta>" 
// se encuentra en common_steps.js
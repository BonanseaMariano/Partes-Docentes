const assert = require('assert');
const { Given, When } = require('@cucumber/cucumber');
const request = require('sync-request');

// Importamos los pasos compartidos
require('../common/common_steps');

// Variables compartidas que se usarán en el contexto
function CargoWorld() {
    this.currentCargo = {};
    this.apiResponse = {}; // Esta variable será usada por common_steps.js
    this.divisionInfo = null; // Para almacenar información de la división
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
    // Asignamos el tipo de designación al cargo actual
    this.currentCargo.tipoDesignacion = tipoDesignacion;
});

// Paso: Y que tiene una carga horaria de <cargaHoraria> horas, con vigencia desde "<fechaDesdeCargo>" hasta "<fechaHastaCargo>"
Given('que tiene una carga horaria de {int} horas, con vigencia desde {string} hasta {string}', function (cargaHoraria, fechaDesdeCargo, fechaHastaCargo) {
    this.currentCargo.cargaHoraria = cargaHoraria;

    // Modificar los nombres de los campos para que coincidan con la entidad Java
    this.currentCargo.fechaInicio = fechaDesdeCargo ? fechaDesdeCargo + "T03:00:00" : null;
    this.currentCargo.fechaFin = fechaHastaCargo && fechaHastaCargo !== '' ? fechaHastaCargo + "T03:00:00" : null;

    // Inicializar horarios como un array vacío (requerido según @NotNull en el modelo)
    this.currentCargo.horarios = [];
});

// Paso: Y que si el tipo es espacio curricular, opcionalmente se asigna a la división "<año>" "<número>" "<turno>"
Given('que si el tipo es espacio curricular, opcionalmente se asigna a la división {string} {string} {string}',
    function (anio, numero, turno) {
        // Si alguno de los campos está vacío, no asignamos división
        if (!anio || !numero || !turno || anio === '' || numero === '' || turno === '') {
            this.currentCargo.division = null;
            return;
        }

        // Buscar la división directamente
        const division = buscarDivision(
            parseInt(anio),
            parseInt(numero),
            turno // Usamos el valor original para la búsqueda
        );

        // Asignamos la división al cargo actual
        this.currentCargo.division = division;
    });

// Función para buscar una división usando el endpoint find
function buscarDivision(anio, numero, turno) {
    // Construimos los parámetros de consulta
    const queryParams = new URLSearchParams({
        anio: anio,
        numDivision: numero,
        turno: turno
    }).toString();

    // Realizamos la consulta al endpoint find  
    const findUrl = `http://pd-backend:8080/divisiones/find?${queryParams}`;

    const checkResponse = request('GET', findUrl);

    // Retornamos la división si la respuesta es exitosa o null si no se encuentra
    return checkResponse.statusCode === 200 ? JSON.parse(checkResponse.getBody('utf8')).data : null;
}

// Cuando se presiona el botón de guardar
When('se presiona el botón de guardar', function () {

    // Enviamos la solicitud para crear el cargo directamente
    const res = request('POST', 'http://pd-backend:8080/cargos', {
        json: this.currentCargo
    });

    this.apiResponse = JSON.parse(res.getBody('utf8'));

});

// El paso "Entonces se espera el siguiente <status> con la "<respuesta>"" 
// se encuentra en common_steps.js
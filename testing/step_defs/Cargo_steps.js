const assert = require('assert');
const { Given, When } = require('@cucumber/cucumber');
const request = require('sync-request');

// Importamos los pasos compartidos
require('./common_steps');

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

    // Cargar las fechas - ahora solo fecha sin hora
    this.currentCargo.fechaInicio = fechaDesdeCargo ? fechaDesdeCargo : null;
    this.currentCargo.fechaFin = fechaHastaCargo && fechaHastaCargo !== '' ? fechaHastaCargo : null;

    // Inicializar horarios como un array vacío
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

        // Asignamos la división al cargo actual
        this.currentCargo.division = JSON.parse(request('GET', encodeURI(`http://pd-backend:8080/divisiones/find?anio=${parseInt(anio)}&numDivision=${parseInt(numero)}&turno=${turno}`)).getBody('utf8')).data;
    });


// Paso: Y que tiene los siguientes horarios: "<horarios>"
Given('que tiene los siguientes horarios: {string}', function (horariosStr) {
    // Si la cadena está vacía, no agregamos horarios
    if (!horariosStr || horariosStr.trim() === '') {
        return;
    }

    // Parseamos los horarios en formato: "DIA:hora-hora-hora,DIA:hora-hora"
    // Ejemplo: "LUNES:1-2,MARTES:3-4-5"
    const horariosArray = [];
    const diasHorarios = horariosStr.split(',');

    diasHorarios.forEach(diaHorario => {
        if (diaHorario.trim() === '') return;
        
        const [dia, horas] = diaHorario.split(':');
        if (!dia || !horas) return;

        const horasArray = horas.split('-').map(h => parseInt(h.trim()));
        
        horasArray.forEach(hora => {
            if (hora >= 1 && hora <= 8) {
                horariosArray.push({
                    dia: dia.trim(),
                    hora: hora
                });
            }
        });
    });

    // Asignamos los horarios al cargo actual
    this.currentCargo.horarios = horariosArray;
});

// Cuando se presiona el botón de guardar
When('se presiona el botón de guardar', function () {

    // Enviamos la solicitud para crear el cargo directamente
    const res = request('POST', encodeURI('http://pd-backend:8080/cargos'), {
        json: this.currentCargo
    });

    this.apiResponse = JSON.parse(res.getBody('utf8'));

});

// El paso "Entonces se espera el siguiente <status> con la "<respuesta>"" 
// se encuentra en common_steps.js
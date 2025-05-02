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
    this.currentCargo.fechaInicio = fechaDesdeCargo ? fechaDesdeCargo + "T00:00:00" : null;
    this.currentCargo.fechaFin = fechaHastaCargo && fechaHastaCargo !== '' ? fechaHastaCargo + "T00:00:00" : null;

    // Inicializar horarios como un array vacío (requerido según @NotNull en el modelo)
    this.currentCargo.horarios = [];
});

// Paso: Y que si el tipo es "ESPACIO CURRICULAR", opcionalmente se asigna a la división "<año>" "<número>" "<orientacion>" "<turno>"
Given('que si el tipo es {string}, opcionalmente se asigna a la división {string} {string} {string} {string}',
    function (tipo, anio, numero, orientacion, turno) {
        // Guarda la información de división siempre que se hayan proporcionado los datos,
        // independientemente del tipo de cargo (para que se active la validación correctamente)
        if (anio && numero && orientacion && turno &&
            anio !== '' && numero !== '' && orientacion !== '' && turno !== '') {

            const turnoFormateado = turno;
            this.divisionInfo = {
                anio: parseInt(anio),
                numero: parseInt(numero),
                orientacion: orientacion,
                turno: turnoFormateado
            };
        }
    });

// Función para buscar una división usando el endpoint unique
function buscarDivision(anio, numero, orientacion, turnoDisplay) {

    // Mapeo correcto de nombres de turno a valores del backend
    const turnoBackendMap = {
        'Mañana': 'MANIANA',
        'Tarde': 'TARDE',
        'Vespertino': 'VESPERTINO',
        'Noche': 'NOCHE'
    };

    // Usamos el mapeo directo para convertir el turno al formato que espera el backend
    const turnoBackend = turnoBackendMap[turnoDisplay] || turnoDisplay;

    // Construimos los parámetros de consulta
    const queryParams = new URLSearchParams({
        anio: anio,
        numDivision: numero,
        orientacion: orientacion,
        turno: turnoBackend
    }).toString();

    // Realizamos la consulta al endpoint unique
    const uniqueUrl = `http://pd-backend:8080/divisiones/unique?${queryParams}`;

    const checkResponse = request('GET', uniqueUrl);

    // Si la respuesta es exitosa, hemos encontrado la división
    if (checkResponse.statusCode === 200) {
        const responseBody = JSON.parse(checkResponse.getBody('utf8'));
        if (responseBody && responseBody.data) {
            return responseBody.data;
        }
    }

    // Si no encontramos ninguna división que coincida
    return null;
}

// Paso: Cuando se presiona el botón de guardar
When('se presiona el botón de guardar', function () {
    try {
        // Si tenemos información de división para un ESPACIO_CURRICULAR, buscamos o creamos la división
        if (this.divisionInfo && this.currentCargo.tipoDesignacion === 'ESPACIO_CURRICULAR') {
            const division = buscarDivision(
                this.divisionInfo.anio,
                this.divisionInfo.numero,
                this.divisionInfo.orientacion, // Agregamos la orientación
                this.divisionInfo.turno
            );

            if (division) {
                // Asignamos la división al cargo
                this.currentCargo.division = division;
            } else {
                console.warn('No se pudo encontrar la división necesaria.');
            }
        } else if (this.divisionInfo) {
            // Para cargos no ESPACIO_CURRICULAR con división asignada (como Auxiliar ACAD)
            const division = buscarDivision(
                this.divisionInfo.anio,
                this.divisionInfo.numero,
                this.divisionInfo.orientacion, // Agregamos la orientación
                this.divisionInfo.turno
            );

            if (division) {
                // Asignamos la división real encontrada al cargo
                this.currentCargo.division = division;
            } else {
                // Si no se puede encontrar, usamos un objeto básico
                this.currentCargo.division = {
                    anio: this.divisionInfo.anio,
                    numDivision: this.divisionInfo.numero,
                    orientacion: this.divisionInfo.orientacion, // Agregamos orientación
                    turno: this.divisionInfo.turno
                };
            }
        }

        // Enviamos la solicitud para crear el cargo
        const res = request('POST', 'http://pd-backend:8080/cargos', {
            json: this.currentCargo
        });

        this.apiResponse = JSON.parse(res.getBody('utf8'));
    } catch (error) {
        console.error('Error al hacer la solicitud:', error.message);
        throw error;
    }
});

// El paso "Entonces se espera el siguiente <status> con la "<respuesta>"" 
// se encuentra en common_steps.js
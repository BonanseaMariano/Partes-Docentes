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

// Mapeamos los valores de tipoDesignacion para que coincidan con el backend
const tipoDesignacionMap = {
    'CARGO': 'Cargo',
    'ESPACIO CURRICULAR': 'Espacio Curricular'
};

// Mapeamos los valores de turno para que coincidan con el backend
const turnoMap = {
    'Mañana': 'Mañana',
    'MAÑANA': 'Mañana',
    'Tarde': 'Tarde',
    'TARDE': 'Tarde',
    'Vespertino': 'Vespertino',
    'VESPERTINO': 'Vespertino',
    'Noche': 'Noche',
    'NOCHE': 'Noche'
};

// Paso: Dado el cargo institucional cuyo <nombre> que da título al mismo
Given('el cargo institucional cuyo {string} que da título al mismo', function (nombre) {
    this.currentCargo = {
        nombre: nombre
    };
});

// Paso: Y que es del tipo de designación <tipoDesignación>
Given('que es del tipo de designación {string}', function (tipoDesignacion) {
    // Usamos el mapa para convertir los valores al formato esperado por el backend
    this.currentCargo.tipoDesignacion = tipoDesignacionMap[tipoDesignacion] || tipoDesignacion;
});

// Paso: Y que tiene una carga horaria de <cargaHoraria> horas, con vigencia desde "<fechaDesde>" hasta "<fechaHasta>"
Given('que tiene una carga horaria de {int} horas, con vigencia desde {string} hasta {string}', function (cargaHoraria, fechaDesde, fechaHasta) {
    this.currentCargo.cargaHoraria = cargaHoraria;

    // Modificar los nombres de los campos para que coincidan con la entidad Java
    this.currentCargo.fechaInicio = fechaDesde ? fechaDesde + "T00:00:00" : null;
    this.currentCargo.fechaFin = fechaHasta && fechaHasta !== '' ? fechaHasta + "T00:00:00" : null;

    // Inicializar horarios como un array vacío (requerido según @NotNull en el modelo)
    this.currentCargo.horarios = [];
});

// Paso: Y que si el tipo es "ESPACIO CURRICULAR", opcionalmente se asigna a la división "<año>" "<número>" "<turno>"
Given('que si el tipo es {string}, opcionalmente se asigna a la división {string} {string} {string}', function (tipo, anio, numero, turno) {
    // Guarda la información de división siempre que se hayan proporcionado los datos,
    // independientemente del tipo de cargo (para que se active la validación correctamente)
    if (anio && numero && turno && anio !== '' && numero !== '' && turno !== '') {
        const turnoFormateado = turnoMap[turno] || turno;
        this.divisionInfo = {
            anio: parseInt(anio),
            numero: parseInt(numero),
            turno: turnoFormateado
        };
    }
});

// Función para buscar o crear una división
function buscarOCrearDivision(anio, numero, turno) {
    try {
        // 1. Primero intentamos obtener todas las divisiones existentes
        const getDivisionsRes = request('GET', 'http://pd-backend:8080/divisiones');
        const divisionsData = JSON.parse(getDivisionsRes.getBody('utf8'));

        if (divisionsData && divisionsData.data) {
            // 2. Buscamos si existe una división con los mismos datos
            const divisionEncontrada = divisionsData.data.find(d =>
                d.anio === anio &&
                d.numDivision === numero &&
                d.turno === turno
            );

            if (divisionEncontrada) {
                // 3a. Si existe, la retornamos
                return divisionEncontrada;
            } else {
                // 3b. Si no existe, la creamos
                const nuevaDivision = {
                    anio: anio,
                    numDivision: numero,
                    turno: turno,
                    orientacion: "General" // Valor por defecto
                };

                // 4. Creamos la división
                const createDivisionRes = request('POST', 'http://pd-backend:8080/divisiones', {
                    json: nuevaDivision
                });

                // 5. Obtenemos la división recién creada
                const getDivisionRes = request('GET', 'http://pd-backend:8080/divisiones');
                const newDivisionsData = JSON.parse(getDivisionRes.getBody('utf8'));

                if (newDivisionsData && newDivisionsData.data) {
                    return newDivisionsData.data.find(d =>
                        d.anio === anio &&
                        d.numDivision === numero &&
                        d.turno === turno
                    );
                }
            }
        }
    } catch (error) {
        console.error('Error al buscar o crear división:', error.message);
    }

    return null;
}

// Paso: Cuando se presiona el botón de guardar
When('se presiona el botón de guardar', function () {
    try {
        // Si tenemos información de división para un ESPACIO_CURRICULAR, buscamos o creamos la división
        if (this.divisionInfo && this.currentCargo.tipoDesignacion === tipoDesignacionMap['ESPACIO CURRICULAR']) {
            const division = buscarOCrearDivision(
                this.divisionInfo.anio,
                this.divisionInfo.numero,
                this.divisionInfo.turno
            );

            if (division) {
                // Asignamos la división al cargo
                this.currentCargo.division = division;
            } else {
                console.warn('No se pudo encontrar o crear la división necesaria.');
            }
        } else if (this.divisionInfo) {
            // Para cargos no ESPACIO_CURRICULAR con división asignada (como Auxiliar ACAD)
            // Buscamos una división real para que la validación falle como se espera
            const division = buscarOCrearDivision(
                this.divisionInfo.anio,
                this.divisionInfo.numero,
                this.divisionInfo.turno
            );

            if (division) {
                // Asignamos la división real encontrada o creada al cargo
                this.currentCargo.division = division;
                console.log('Asignando división a cargo tipo no-ESPACIO_CURRICULAR:', JSON.stringify(this.currentCargo.division));
            } else {
                // Si no se puede encontrar o crear, usamos un objeto básico
                this.currentCargo.division = {
                    anio: this.divisionInfo.anio,
                    numDivision: this.divisionInfo.numero,
                    turno: this.divisionInfo.turno,
                    orientacion: "General"
                };
                console.log('No se encontró división, usando objeto básico:', JSON.stringify(this.currentCargo.division));
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
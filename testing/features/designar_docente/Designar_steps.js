const assert = require('assert');
const { Given, When } = require('@cucumber/cucumber');
const request = require('sync-request');

// Importamos los pasos compartidos
require('../common/common_steps');

// Variables compartidas que se usarán en el contexto
function DesignarWorld() {
    this.currentDesignacion = {};
    this.persona = {};
    this.cargo = {};
    this.division = null;
    this.apiResponse = {}; // Esta variable será usada por common_steps.js
}

// Configuramos el mundo (contexto) para cada escenario
const { setWorldConstructor } = require('@cucumber/cucumber');
setWorldConstructor(DesignarWorld);

// Paso: Dada la persona con <DNI> "<nombre>" y "<apellido>"
Given('la persona con {word} {string} y {string}', function (dni, nombre, apellido) {
    // Asumimos que la persona ya existe, solo guardamos la referencia por DNI
    this.persona = { dni };
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
    // Inicializar el objeto currentDesignacion si aún no existe
    if (!this.currentDesignacion) {
        this.currentDesignacion = {};
    }

    // Aplicamos el mismo formato que en Cargo_steps.js
    this.currentDesignacion.fechaInicio = fechaDesdeDesignacion ? fechaDesdeDesignacion + "T03:00:00" : null;
    this.currentDesignacion.fechaFin = fechaHastaDesignacion && fechaHastaDesignacion !== '' ?
        fechaHastaDesignacion + "T03:00:00" : null;

    // Asignar situacionRevista por defecto si no existe
    if (!this.currentDesignacion.situacionRevista) {
        this.currentDesignacion.situacionRevista = "Regular";
    }
});

// Función para buscar o recuperar un cargo existente
function buscarCargo(nombre, tipoDesignacion, division) {

    // En vez de usar /unique, obtenemos todos los cargos y filtramos manualmente
    const url = `http://pd-backend:8080/cargos`;
    const res = request('GET', url);

    if (res.statusCode === 200) {
        const responseBody = JSON.parse(res.getBody('utf8'));

        // Filtrar cargos que coincidan con el nombre y tipo de designación
        const cargosFiltrados = responseBody.data.filter(cargo =>
            cargo.nombre === nombre &&
            cargo.tipoDesignacion === tipoDesignacion
        );

        // Si es un espacio curricular y tenemos información de división, verificamos la coincidencia
        if (tipoDesignacion === 'ESPACIO_CURRICULAR' && division) {
            const cargoConDivision = cargosFiltrados.find(cargo =>
                cargo.division &&
                cargo.division.anio === division.anio &&
                cargo.division.numDivision === division.numDivision
            );
            return cargoConDivision;
        }

        // Si no es un espacio curricular o no tenemos información de división, devolvemos el primer cargo filtrado
        return cargosFiltrados[0];
    }
}

// Función para buscar una persona existente por DNI
function buscarPersona(dni) {
    try {
        const res = request('GET', `http://pd-backend:8080/personas/dni/${dni}`);
        if (res.statusCode === 200) {
            const responseBody = JSON.parse(res.getBody('utf8'));
            if (responseBody && responseBody.data) {
                return responseBody.data;
            }
        }
    } catch (error) {
        console.error('Error al buscar la persona:', error);
    }
    return null;
}

// Paso: Cuando se presiona el botón guardar
When('se presiona el botón guardar', function () {
    try {
        // Obtenemos la persona completa desde el backend
        const personaCompleta = buscarPersona(this.persona.dni);
        if (!personaCompleta) {
            throw new Error(`No se encontró la persona con DNI ${this.persona.dni}`);
        }

        // Obtenemos el cargo completo desde el backend
        const cargoCompleto = buscarCargo(this.cargo.nombre, this.cargo.tipoDesignacion, this.division);
        if (!cargoCompleto) {
            throw new Error(`No se encontró el cargo ${this.cargo.nombre} de tipo ${this.cargo.tipoDesignacion}`);
        }

        // Preparamos el objeto de designación completo
        if (!this.currentDesignacion) {
            this.currentDesignacion = {};
        }

        this.currentDesignacion = {
            ...this.currentDesignacion,
            persona: personaCompleta,
            cargo: cargoCompleto,
            situacionRevista: this.currentDesignacion.situacionRevista || "Regular"
        };

        // Enviamos la solicitud para crear la designación
        const res = request('POST', 'http://pd-backend:8080/designaciones', {
            json: this.currentDesignacion
        });

        this.apiResponse = JSON.parse(res.getBody('utf8'));
    } catch (error) {
        console.error('Error al hacer la solicitud de designación:', error.message);
        throw error;
    }
});

// El paso "Entonces se espera el siguiente <status> y <respuesta>" 
// se encuentra en common_steps.js
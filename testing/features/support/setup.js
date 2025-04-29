const { BeforeAll } = require('@cucumber/cucumber');
const request = require('sync-request');

/**
 * Función que limpia las personas de la base de datos con DNIs predefinidos
 */
function PersonaSetUp() {
    // Variable para almacenar los DNIs a limpiar, ahora como variable local
    const dnisToClean = [10100100, 20200200, 30300300, 40400400, 50500500, 60600600, 70700700, 20000000, 80800800];

    console.log("Limpiando personas existentes antes de ejecutar las pruebas...");

    // Intenta eliminar todas las personas con los DNIs en la lista
    dnisToClean.forEach(dni => {
        try {
            // Verificamos si la persona existe usando el nuevo endpoint de dni
            const checkResponse = request('GET', `http://pd-backend:8080/personas/dni/${dni}`);

            // Si la persona existe (código 200), la eliminamos
            if (checkResponse.statusCode === 200) {
                const persona = JSON.parse(checkResponse.getBody('utf8')).data;
                if (persona && persona.id) {
                    request('DELETE', `http://pd-backend:8080/personas/${persona.id}`);
                    console.log(`Persona con DNI ${dni} eliminada correctamente.`);
                }
            }
        } catch (error) {
            console.log(`No se encontró persona con DNI ${dni} o hubo un error:`, error.message);
        }
    });

    console.log("Limpieza inicial completada.");
}

// BeforeAll: Se ejecuta una vez antes de todos los escenarios
BeforeAll(function () {
    // Utilizamos la función modularizada
    PersonaSetUp();
    console.log("Ejecutando tests...");
});



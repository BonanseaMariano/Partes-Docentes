module.exports = {
  default: {
    // Especifica las rutas de los features en el orden deseado
    paths: [
      'features/persona/Persona.feature',
      'features/division/Division.feature',
      'features/cargo/Cargo.feature',
      'features/designar_docente/Designar.feature',
      'features/designar_docente/Control_designacion.feature',
      'features/licencia/Control_licencia.feature',
      'features/parte_diario/Parte_diario.feature',

    ],
    // Configuración para encontrar los step definitions
    require: [
      'features/**/*.js',
      'features/step_definitions/**/*.js'
    ],
    // Opciones de formato
    formatOptions: {
      snippetInterface: "synchronous"
    }
  }
};
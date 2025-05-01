module.exports = {
  default: {
    // Especifica las rutas de los features en el orden deseado
    paths: [
      'features/persona/Persona.feature',
      'features/division/Division.feature',
      'features/cargo/Cargo.feature',
      'features/designar_docente/Designar.feature'
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
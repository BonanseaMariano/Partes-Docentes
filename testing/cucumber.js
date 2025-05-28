module.exports = {
  default: {
    // Especifica las rutas de los features en el orden deseado
    paths: [
      'features/Persona.feature',
      'features/Division.feature',
      'features/Cargo.feature',
      'features/Designar.feature',
      'features/Control_designacion.feature',
      'features/Control_licencia.feature',
      'features/Parte_diario.feature',
    ],
    // Configuración para encontrar los step definitions
    require: [
      'step_defs/**/*.js'
    ],
    // Opciones de formato
    formatOptions: {
      snippetInterface: "synchronous"
    }
  }
};
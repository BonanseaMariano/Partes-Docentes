module.exports = {
  default: [
    // Asegurarse de que Cucumber encuentre los step definitions en la nueva estructura
    '--require features/**/*.js',
    '--require features/step_definitions/**/*.js',
    `--format-options '{"snippetInterface": "synchronous"}'`
  ].join(' ')
}
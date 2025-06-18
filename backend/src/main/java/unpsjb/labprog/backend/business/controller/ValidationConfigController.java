package unpsjb.labprog.backend.business.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.business.validator.config.ValidationConfigLoader;
import unpsjb.labprog.backend.business.validator.licencia.LicenciaValidator;

/**
 * Controlador REST para gestionar la configuración de validaciones en caliente.
 * Permite consultar y modificar el orden de validaciones sin reiniciar la aplicación.
 */
@RestController
@RequestMapping("/api/validation-config")
public class ValidationConfigController {
    
    @Autowired
    private ValidationConfigLoader configLoader;
    
    @Autowired
    private LicenciaValidator licenciaValidator;
    
    /**
     * Obtiene la configuración actual de validaciones.
     * 
     * @return Configuración actual con orden y opciones
     */
    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentConfig() {
        Map<String, Object> response = new HashMap<>();
        
        // Obtener configuración actual
        var config = configLoader.getValidationConfig();
        response.put("currentOrder", config.getProperty("licencia.validation.order"));
        response.put("stopOnFirstError", "true".equals(config.getProperty("licencia.validation.stopOnFirstError")));
        
        // Obtener validaciones disponibles
        List<String> availableValidations = licenciaValidator.getAvailableValidations();
        response.put("availableValidations", availableValidations);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Actualiza la configuración de validaciones en caliente.
     * 
     * @param configRequest Nueva configuración
     * @return Respuesta de confirmación
     */
    @PostMapping("/update")
    public ResponseEntity<Map<String, Object>> updateConfig(@RequestBody ValidationConfigRequest configRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validar que el orden proporcionado contiene validaciones válidas
            List<String> availableValidations = licenciaValidator.getAvailableValidations();
            String[] requestedValidations = configRequest.getValidationOrder().split(",");
            
            for (String validation : requestedValidations) {
                String trimmedValidation = validation.trim();
                if (!availableValidations.contains(trimmedValidation)) {
                    response.put("error", "Validación no disponible: " + trimmedValidation);
                    response.put("availableValidations", availableValidations);
                    return ResponseEntity.badRequest().body(response);
                }
            }
            
            // Actualizar configuración
            licenciaValidator.updateValidationConfiguration(
                configRequest.getValidationOrder(), 
                configRequest.isStopOnFirstError()
            );
            
            response.put("success", true);
            response.put("message", "Configuración actualizada correctamente");
            response.put("newOrder", configRequest.getValidationOrder());
            response.put("stopOnFirstError", configRequest.isStopOnFirstError());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("error", "Error actualizando configuración: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Clase interna para el request de configuración.
     */
    public static class ValidationConfigRequest {
        private String validationOrder;
        private boolean stopOnFirstError;
        
        public String getValidationOrder() {
            return validationOrder;
        }
        
        public void setValidationOrder(String validationOrder) {
            this.validationOrder = validationOrder;
        }
        
        public boolean isStopOnFirstError() {
            return stopOnFirstError;
        }
        
        public void setStopOnFirstError(boolean stopOnFirstError) {
            this.stopOnFirstError = stopOnFirstError;
        }
    }
}

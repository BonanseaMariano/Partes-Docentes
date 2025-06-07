package base;

import java.io.IOException;
import java.io.InputStream;


import java.util.Map;
import java.util.HashMap;

// La fabrica ahora solo conoce a Command
import base.Command;


public class CommandFactory {

    // Mapa donde almacena cada comando.
    // Lo carga en base a un archivo de configuración.
    private Map<String, Command> commandMap;

    // Singleton
    private static CommandFactory instance = null;

    private CommandFactory(){
        commandMap = new HashMap<>();
    }

    public static CommandFactory getInstance() {
        if (instance == null)
            instance = new CommandFactory();
        return instance;        
    }

    public Command getCommand(String command){

        if (!commandMap.containsKey(command)) {

            String name = "base.commands." + command.substring(0,1).toUpperCase() + command.substring(1).toLowerCase() + "Command";
            
            try {
            
                Class t = Class.forName(name);                
                commandMap.put(command, (Command)t.getMethod("getInstance").invoke(null));

            } catch (ClassNotFoundException cnfe) {
                System.err.println("No se encontró la clase: " + name);
            } catch (NoSuchMethodException nsme){
                System.err.println("La clase " + name + " no implementa el metodo get instance.");
            } catch (Exception iae){
                System.err.println("Ocurrio un error invocando el metodo getInstance de la clase " + name + " " + iae.getMessage());
            }
        }

        return commandMap.get(command);     
    }

}
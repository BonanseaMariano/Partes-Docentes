import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;
import java.util.StringTokenizer;

// Ahora la aplicación solo conoce la interfaz y la fabrica.
import base.Command;
import base.CommandFactory;

class Factory04 {

     public static void main(String[] argv) {

        Scanner input = new Scanner(System.in);
        
        CommandFactory factory = CommandFactory.getInstance();
        Command command; // Ahora es una instancia de Command

        Queue<Integer> args = new LinkedList<>();
        
        StringTokenizer line;
        while(input.hasNextLine()){
            // Lee y tokeniza la linea.
            line = new StringTokenizer(input.nextLine());

            // Lee el comando y sus argumentos.
            command = factory.getCommand(line.nextToken());
            while(line.hasMoreTokens()){
                args.add(Integer.parseInt(line.nextToken()));
            }

            // Ejecuta el comando
            if (command != null)
                command.execute(args);
            else
                System.out.println("Comando no encontrado");

            // Limpia la cola de argumentos.
            args.clear();            
        }

        input.close();    
        
        
    }

}
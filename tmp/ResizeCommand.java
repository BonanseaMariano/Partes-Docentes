package base.commands;

import base.Command;
import java.util.Queue;

public class ResizeCommand implements Command {

    // Singleton
    private static ResizeCommand instance = null;

    private ResizeCommand(){}

    public static ResizeCommand getInstance() {
        if(instance == null)
            instance = new ResizeCommand();
        return instance;
    }

    // Implementación de la interface
    public int execute(Queue<Integer> args){
        
        System.out.println("Soy ResizeCommand y mis argumentos son 4: "
            + args.remove() + ", " 
            + args.remove() + ", "
            + args.remove() + ", "
            + args.remove());

        return 0;
    }

}
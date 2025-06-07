package base;

import java.util.Queue;

public interface Command {
    
    public int execute(Queue<Integer> args);

}
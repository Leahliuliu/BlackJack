package com.game.utils;

import java.util.UUID;

public class ToolUtils {

    public static String uuid(){
        return UUID.randomUUID().toString().toLowerCase();
    }

}

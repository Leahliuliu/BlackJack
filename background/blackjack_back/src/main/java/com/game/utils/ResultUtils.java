package com.game.utils;

import java.util.HashMap;
import java.util.Map;

public class ResultUtils {

    public static Map<Object, Object> createMap(Object... v){
        Map<Object, Object> map = new HashMap<>();
        if(v.length > 0 && (v.length & 1) == 0){
            int len = v.length / 2;
            for(int i = 0;i < len;i++){
                map.put(v[2 * i], v[2 * i + 1]);
            }
        }
        return map;
    }

}

package com.game.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseResult {

    /*
        //
        200 (登录成功)
        500 （服务器问题）
        501 （用户操作反馈）
     */

    private Integer code;
    private String message;
    private Map<Object, Object> data;

}

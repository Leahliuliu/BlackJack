package com.game.entities;

import lombok.Data;

import java.util.Date;

@Data
public class User {

    private Integer id;
    private String username;
    private String password;
    private Integer grade;
    private Date createTime;
    private Date updateTime;//当修改密码时
    private Integer maxGrade;

}

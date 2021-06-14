package com.game.controller;

import com.game.entities.ResponseResult;
import com.game.entities.User;
import com.game.service.StringRedisService;
import com.game.service.imp.UserServiceImp;
import com.game.utils.HttpUtils;
import com.game.utils.ResultUtils;
import com.game.utils.ToolUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

@RestController
@Slf4j
@CrossOrigin(maxAge = 3600 * 24)
public class UserController {

    @Autowired
    private StringRedisService stringRedisService;

    @Autowired
    private UserServiceImp userServiceImp;

    @PostMapping("/register")
    public Object register(@RequestBody User user, HttpServletRequest request){
        Long res = userServiceImp.isExitUser(user);
        if(res == 1)
            return new ResponseResult(501, "用户已存在，请更换用户名", null);
        String ipAddr = HttpUtils.getIpAddr(request);
        if(ipAddr != null){
            String imageId = stringRedisService.getString(ipAddr);
            if(imageId != null){
                String code = request.getHeader("verifyCode");
                System.out.println(imageId+" "+code);
                if(!imageId.equalsIgnoreCase(code))return new ResponseResult(501, "验证码不正确", null);
                user.setGrade(0);
                user.setCreateTime(new Date());
                userServiceImp.createUser(user);
                log.info("注册 " + user+" "+imageId);
                return new ResponseResult(200, "注册成功", null);
            }else{
                return new ResponseResult(501, "验证码超时", null);
            }
        }else{
            return new ResponseResult(501, "无法获取到ip", null);
        }
    }

    @PostMapping("/login")
    public Object login(@RequestBody User user){
        Long res = userServiceImp.isExitUser(user);
        if(res == 1){
            user = userServiceImp.selectUserByUsernameAndPassword(user);
            if(user != null){
                String id = String.valueOf(user.getId());
                String token = stringRedisService.getString(id);
                if(token != null){
                    stringRedisService.delete(token);
                }
                String uuid = ToolUtils.uuid();
                stringRedisService.setString(uuid, id);
                stringRedisService.setString(id, uuid);
                return new ResponseResult(200, "登录成功", ResultUtils.createMap("token", uuid, "info", user));
            }else{
                return new ResponseResult(501, "账号或密码错误", null);
            }
        }else{
            return new ResponseResult(501, "不存在该用户", null);
        }
    }

    @PostMapping("/updateGrade")
    public Object updateGrade(HttpServletRequest request, @RequestBody User user){
        String token = request.getHeader("token");
        Integer id = Integer.valueOf(stringRedisService.getString(token));
        Integer maxGrade = userServiceImp.selectMaxGradeById(id);
        user.setMaxGrade(Math.max(maxGrade, user.getGrade()));
        user.setId(id);
        user.setUpdateTime(new Date());
        userServiceImp.updateGradeById(user);
        return new ResponseResult(200, "更新分数成功", null);
    }

    @PostMapping("/updatePassword")
    public Object updatePassword(HttpServletRequest request, @RequestBody User user){
        String token = request.getHeader("token");
        Integer id = Integer.valueOf(stringRedisService.getString(token));
        user.setId(id);
        userServiceImp.updatePasswordById(user);
        return  new ResponseResult(200, "更改密码成功", null);
    }

    @PostMapping("/exit")
    public Object exit(HttpServletRequest request){
        String token = request.getHeader("token");
        String id = stringRedisService.getString(token);
        stringRedisService.delete(token);
        stringRedisService.delete(id);
        return  new ResponseResult(200, "退出成功", null);
    }

    @GetMapping("/test")
    public Object test(){
        return new ResponseResult(200, "测试成功", null);
    }

}

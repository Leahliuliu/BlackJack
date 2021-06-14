package com.game.interceptor;

import com.alibaba.fastjson.JSON;
import com.game.entities.ResponseResult;
import com.game.service.StringRedisService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

@Component
@Slf4j
public class TokenInterceptor implements HandlerInterceptor {

    @Autowired
    private StringRedisService stringRedisService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //拦截代码......
        log.info("拦截。。。。"+request.getMethod());
        if("OPTIONS".equals(request.getMethod()))return true;
        String token;
        if((token = request.getHeader("token")) != null){
            String resToken = stringRedisService.getString(token);
            if(resToken == null){
                response.setCharacterEncoding("UTF-8");
                response.setContentType("application/json; charset=utf-8");
                PrintWriter writer = response.getWriter();
                writer.append(JSON.toJSONString(new ResponseResult(501, "您登录超时", null)));
                return false;
            }
        }else{
            response.getWriter().write("没有携带token");
            return false;
        }
        stringRedisService.updateTokenExpire(token);
        String id = stringRedisService.getString(token);
        stringRedisService.updateTokenExpire(id);
        return true;
    }

}

package com.game.controller;

import com.game.entities.ResponseResult;
import com.game.service.StringRedisService;
import com.game.utils.HttpUtils;
import com.game.utils.VerifyCodeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@Slf4j
public class ImageController {

    @Autowired
    private StringRedisService stringRedisService;

    @GetMapping("/image")
    public void image(HttpServletRequest request, HttpServletResponse response){
        try {
            response.setHeader("Pragma", "No-cache");
            response.setHeader("Cache-Control", "no-cache");
            response.setDateHeader("Expires", 0);
            response.setContentType("image/jpeg");
            //生成随机字符串
            String verifyCode = VerifyCodeUtil.generateVerifyCode(4);
            String ipAddr = HttpUtils.getIpAddr(request);
            log.info(ipAddr);
            if(ipAddr != null)stringRedisService.setImageId(ipAddr, verifyCode);
            //将字符串写入输出流 130宽 40高
            VerifyCodeUtil.outputImage(130, 40, response.getOutputStream(), verifyCode);
        } catch (IOException e) {
        }
    }

}

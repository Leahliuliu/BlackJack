package com.game.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
public class StringRedisService {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    public void setString(String key, String value){
        stringRedisTemplate.opsForValue().set(key, value, Duration.ofHours(1));
    }

    public String getString(String key){
        return stringRedisTemplate.opsForValue().get(key);
    }


    public void setImageId(String id, String code){
        stringRedisTemplate.opsForValue().set(id, code, Duration.ofSeconds(60));
    }

    public void updateTokenExpire(String token){
        stringRedisTemplate.expire(token, 1, TimeUnit.HOURS);
    }

    public void delete(String key){
        stringRedisTemplate.delete(key);
    }

}

package com.game.service.imp;

import com.game.dao.UserMapper;
import com.game.entities.User;
import com.game.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public void createUser(User user) {
        userMapper.insertUser(user);
    }

    @Override
    public Long isExitUser(User user) {
        return userMapper.isExistUser(user);
    }

    @Override
    public User selectUserByUsernameAndPassword(User user) {
        return userMapper.selectUserByUsernameAndPassword(user);
    }

    @Override
    public void updateGradeById(User user) {
        userMapper.updateGradeById(user);
    }

    @Override
    public void updatePasswordById(User user) {
        userMapper.updatePasswordById(user);
    }

    @Override
    public Integer selectMaxGradeById(Integer id) {
        return userMapper.selectMaxGradeById(id);
    }

}

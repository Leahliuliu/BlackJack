package com.game.service;

import com.game.entities.User;

public interface UserService {

    void createUser(User user);

    Long isExitUser(User user);

    User selectUserByUsernameAndPassword(User user);

    void updateGradeById(User user);

    void updatePasswordById(User user);

    Integer selectMaxGradeById(Integer id);

}

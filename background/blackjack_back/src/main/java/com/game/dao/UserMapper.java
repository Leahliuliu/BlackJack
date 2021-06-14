package com.game.dao;

import com.game.entities.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {

    @Insert("INSERT INTO user(username, password, grade, createTime)VALUES(#{username}, #{password}, #{grade}, #{createTime})")
    @Options(useGeneratedKeys=true, keyProperty="id", keyColumn="id")
    void insertUser(User user);

    @Select("SELECT id, username, grade, maxGrade FROM user WHERE username = #{username} AND password = #{password}")
    User selectUserByUsernameAndPassword(User user);

    @Select("SELECT maxGrade FROM user WHERE id = #{id}")
    Integer selectMaxGradeById(@Param("id") Integer id);

    @Select("SELECT * FROM user WHERE id = #{id}")
    User selectUserById(@Param("username") Integer id);

    @Select("SELECT COUNT(*) FROM user WHERE username = #{username}")
    Long isExistUser(User user);

    @Update("UPDATE user SET grade = #{grade},maxGrade = #{maxGrade}, updateTime = #{updateTime} WHERE id = #{id}")
    void updateGradeById(User user);

    @Update("UPDATE user SET password = #{password} WHERE id = #{id}")
    void updatePasswordById(User user);

}

<template>
  <div>
    <!--画布, 所有不同页面均为 不断清换在画布上变更-->
    <canvas id="backCanvas" :width="width" :height="height">您的浏览器版本过低，请更新！</canvas>
    <canvas id="titleCanvas" :width="width" :height="height">您的浏览器版本过低，请更新！</canvas>
    <canvas id="buttonCanvas" :width="width" :height="height">您的浏览器版本过低，请更新！</canvas>
    <canvas id="cardPointsCanvas" :width="width" :height="height">您的浏览器版本过低，请更新！</canvas>
    <canvas id="gradeCanvas" :width="width" :height="height">您的浏览器版本过低，请更新！</canvas>
    <canvas id="cardCanvas" :width="width" :height="height">您的浏览器版本过低，请更新！</canvas>
    <canvas id="moneyCanvas" :width="width" :height="height">您的浏览器版本过低，请更新！</canvas>
    <canvas id="barCanvas" :width="width" :height="height">您的浏览器版本过低，请更新！</canvas>
    <canvas id="resultCanvas" :width="width" :height="height">您的浏览器版本过低，请更新！</canvas>
    <canvas id="eventCanvas" :width="width" :height="height">您的浏览器版本过低，请更新！</canvas>
    <!--玩家登录-->
    <el-drawer
      title="个人信息"
      size="30%"
      :visible.sync="drawer"
      :with-header="false"
      :before-close="handleClose"
      :direction="'rtl'">
      <div v-if="isLogin">
        <el-row style="padding: 30px 0 40px 30px;font-size: 17px;">
          21点游戏平台
        </el-row>
        <el-row style="padding-left: 20px;padding-right: 60px">
          <el-form status-icon label-width="30px">
            <el-form-item label="" prop="username">
              <el-input v-model="loginForm.username" type="text" readonly>
                <template slot="prepend">玩家</template>
              </el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="user.bestGrade" title="" readonly>
                <template slot="prepend">最佳</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width:100%;" @click="exit" :loading="loading">退出登录</el-button>
            </el-form-item>
            <div style="text-align: right;">
              <a href="#" style="margin-left: 14px;font-size: 14px" @click="forgetPassword">修改密码</a>
            </div>
          </el-form>
        </el-row>
      </div>
      <div v-else>
        <el-row style="padding: 30px 0 40px 30px;font-size: 17px;">
          21点游戏平台登录
        </el-row>   <!--规则匹配-->
        <el-row style="padding-left: 20px;padding-right: 60px;">
          <el-form ref="loginForm" status-icon :rules="rules" :model="loginForm" label-width="70px">
            <el-form-item label="账号" prop="username">
              <el-input v-model="loginForm.username" type="text" clearable placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="loginForm.password" type="password" show-password clearable placeholder="请输入密码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width:100%;" @click="loginOperate('loginForm')" :loading="loading">登录
              </el-button>
              <div style="text-align: right;">
                <p style="padding-top: 10px">
                  <span style="color: #a3a3a3">您还没有账号,</span>
                  <span style="color: orange;cursor:pointer" @click="register" type="button">去注册身份>>></span>
                </p>
              </div>
            </el-form-item>
          </el-form>
        </el-row>
      </div>

      <!--玩家重置密码-->
      <el-drawer
        title="重置密码页面"
        size="29%"
        :append-to-body="true"
        :with-header="false"
        :before-close="handleCloseOne"
        :visible.sync="forgetPasswordDrawer">
        <el-row style="padding: 30px 0 40px 30px;font-size: 17px;">
          密码重置
        </el-row>
        <el-row style="padding-left: 20px;padding-right: 60px">
          <el-form ref="modifyForm" status-icon :rules="rules" :model="modifyForm" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username" type="text" disabled/>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="modifyForm.newPassword" type="password" clearable show-password placeholder="请输入新密码"/>
            </el-form-item>
            <el-form-item label="确认密码" prop="newPasswordTwo">
              <el-input v-model="modifyForm.newPasswordTwo" type="password" clearable show-password
                        placeholder="请确认输入的新密码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width:100%;" @click="modifyOperate('modifyForm')" :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </el-drawer>

      <!--玩家注册账号-->
      <el-drawer
        title="玩家注册页面"
        size="29%"
        :append-to-body="true"
        :with-header="false"
        :before-close="handleCloseTwo"
        :visible.sync="registerDrawer">
        <el-row style="padding: 30px 0 40px 30px;font-size: 17px;">
          玩家注册
        </el-row>
        <el-row style="padding-left: 20px;padding-right: 60px">
          <el-form ref="registerForm" status-icon :rules="rules" :model="registerForm" label-width="80px">
            <el-form-item label="账号" prop="username">
              <el-input v-model="registerForm.username" type="text" clearable placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item label="密码" prop="newPassword">
              <el-input v-model="registerForm.newPassword" type="password" clearable show-password placeholder="请输入密码"/>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-row>
                <el-col :span="10">
                  <el-input v-model="registerForm.code" clearable maxlength="4"/>
                </el-col>
                <el-col :span="14">
                  <span @click="changeCode" type="button" style="margin-left: 3px"><img :src=verifyCodePic></span>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width:100%;" @click="registerOperate('registerForm')" :loading="loading">
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </el-drawer>
    </el-drawer>
  </div>
</template>

<script>
  import $ from "../assets/api/game"
  import {register, login, exit, updatePassword} from "../assets/api/request";
  import ip from '../assets/api/const';

  export default {
    name: "Index",
    data() {
      return {
        width: 1280, //初始默认页面宽高
        height: 720,
        grade: 0,//玩家金币
        bet: 0,//玩家押注
        needSound: true,//判断是否静音
        chipsNeedClear: true, //是否需要取消押注
        drawer: false, //玩家登录信息弹框
        forgetPasswordDrawer: false, //玩家修改密码弹框
        registerDrawer: false, //玩家注册弹框
        isLogin: false, //判断登录
        loading: false,
        loginForm: { //登录信息
          username: '',
          password: '',
        },
        user: {
          bestGrade: 100,
        },
        modifyForm: { //修改密码
          username: '',
          newPassword: '',
          newPasswordTwo: '',
        },
        registerForm: { //注册账号
          username: '',
          password: '',
          code: '' //获取后台图片验证码
        },
        verifyCodePic: '', //获取后台的图片验证码
        rules: { //填写规则
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur'}
          ],
          newPasswordTwo: [
            {required: true, message: '请重新输入新密码', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ],
        },
        btnImgMap: {}, //按钮图片
        cardImgMap: {}, //扑克牌图片
        bgImgMap: {}, //背景图片
        gameResultsImgMap: {}, //游戏结果图片

        btnMap: {}, //按钮对象
        cardMap: {}, //扑克牌对象
        canvasMap: {}, //画布对象
        audioMap: {}, //音频对象
        mode: 0,//游戏模式 0 1 2
        percent: 1, //根据各个电脑型号的屏幕分辨率进行适应
        allBetBtn: [],//押注时放到桌上的钱
        isBetAnimAllow: true,//是否允许押注的钱动画
        axis: {//初始状态的坐标
          btns: null,
          cards: null,
        },
        players: {//players[0]是玩家自己，players[1]、players[2]、players[3]为电脑人
          btns: [],
          cards: [],
          grade: [],
        },
        cardsBox: {//随机卡片的信息
          cardsName: [],
          grade: [],
          randomArr: []
        },
        animObj: {//是否允许动画
          isAnim: false,
        }
      }
    },

    mounted() {
      $.vue = this;
      $.init();//初始化页面宽高
      this.draw();
      this.verifyCodePic = ip.IP + "/image"; //获取后台图片验证码
    },

    methods: {
      draw() { //【页面初始化】
        $.putAllCanvasToMap();
        $.drawMainPage();
        $.loadAllFiles(() => {
          $.drawMainPageAfterLoading();
          $.initEvent();
        });
      },

      loginOperate(Form) { //【玩家登录事件处理】
        this.$refs[Form].validate((valid) => {
          if (valid) {
            this.loading = true;
            login(this.loginForm.username, this.loginForm.password)
              .then((data) => {
                this.loading = false;
                console.log(data);
                if (data.code === 200) {
                  this.$message.success(data.message);
                  this.grade = data.data.info.grade;
                  this.user.bestGrade = data.data.info.maxGrade;
                  $.drawGrade();
                  this.drawer = false;
                  this.isLogin = true;
                  localStorage.setItem('token', data.data.token);
                } else {
                  this.$message.error(data.message);
                }
              })
              .catch(()=>{
                  this.loading = false;
                })
          } else {
          }
        })
      },

      forgetPassword() { //【玩家修改密码按钮点击】
        this.forgetPasswordDrawer = true;
        this.changeCode();
      },

      modifyOperate(Form) { //【玩家修改密码事件处理】
        this.$refs[Form].validate((valid) => {
          if (valid) {
            this.loading = true;
            if (this.modifyForm.newPassword === this.modifyForm.newPasswordTwo) {
              updatePassword(this.modifyForm.newPassword)
                .then(data => {
                  this.loading = false;
                  this.$message.success(data.message);
                  this.modifyForm.newPassword = '';
                  this.modifyForm.newPasswordTwo = '';
                  this.drawer = false;
                  this.forgetPasswordDrawer = false;
                })
                .catch(()=>{
                  this.loading = false;
                })
            } else {
              this.$message.error('两次密码输入不一致，请重新输入！')
            }
          } else {
          }
        })
      },

      register() { //【玩家注册按钮点击】
        this.registerDrawer = true;
        this.changeCode();
      },

      registerOperate(Form) {//【玩家注册事件处理】
        this.$refs[Form].validate((valid) => {
          if (valid) {
            this.loading = true;
            register(this.registerForm.username, this.registerForm.newPassword, this.registerForm.code)
              .then((data) => {
                this.loading = false;
                if (data.code === 200) {
                  this.$message.success(data.message);
                  this.registerDrawer = false;
                  this.registerForm.username = '';
                  this.registerForm.newPassword = '';
                  this.registerForm.code = '';
                } else {
                  this.$message.error(data.message);
                }
              })
              .catch(()=>{
                this.loading = false;
              })
          } else {
          }
        })
      },

      changeCode() { //【更换图片验证码】
        this.verifyCodePic = ip.IP + '/image?rnd=' + Math.random();
      },

      exit() { //【退出登录】
        this.loading = true;
        exit()
          .then(data => {
            if (data.code === 200) {
              this.loading = false;
              $.resetGame(true);
              this.$message.success(data.message);
              this.grade = 0;
              localStorage.removeItem('token');
            }
          })
          .catch(()=>{
            this.loading = false;
          })
      },

      handleClose() {//【用户登录侧栏关闭】
        this.drawer = false;
      },

      handleCloseOne() {//【用户修改密码侧栏关闭】
        this.forgetPasswordDrawer = false;
      },

      handleCloseTwo() { //【用户注册侧栏关闭】
        this.registerDrawer = false;
      }
    }
  }
</script>

<style scoped>
  #backCanvas, #titleCanvas, #buttonCanvas, #cardPointsCanvas, #gradeCanvas, #cardCanvas, #moneyCanvas, #barCanvas, #resultCanvas, #eventCanvas {
    position: absolute;
    left: 50%; /*画布居中*/
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>

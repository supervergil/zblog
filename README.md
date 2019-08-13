# ZBLOG源码

## 前言

这个项目是ZBLOG源码，分享出来供大家研究探讨，如果你想在服务器上快速安装ZBLOG博客程序可以用zblog_installer，项目地址为：https://github.com/supervergil/zblog_installer。

## 使用的框架

服务端使用了nodejs+thinkjs+nunjuck的组合、管理端和客户端使用了vue。如果有需要进行二次开发，请务必查阅好对应的框架说明！

## 开启本地开发模式

```/src```目录为服务端的源码，```/admin```为管理端源码，```/ucenter```为客户端源码。开启开发模式之前需要先导入zblog.sql到mysql，并修改```/src/common/adapter.js```的数据库配置，然后**分别**在**根目录**、**/admin**、**/ucenter**执行```npm install```，并分别执行```npm start```。项目启动后，80端口对应服务端和展示端程序、8080端口对应管理端程序、8081端口对应客户端程序。

## 其他

<img src="https://github.com/supervergil/zblog_installer/raw/master/promotion/images/qrcode.jpg" width="320" />

使用过程中有任何疑问，可以添加zblog助手咨询！

广告赞助或者业务合作，可以联系admin@zhangyangjun.com，谢谢你的支持！
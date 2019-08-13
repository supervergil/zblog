-- MySQL dump 10.16  Distrib 10.1.19-MariaDB, for Win32 (AMD64)
--
-- Host: 127.0.0.1    Database: 127.0.0.1
-- ------------------------------------------------------
-- Server version	10.1.19-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `zblog_author`
--

DROP TABLE IF EXISTS `zblog_author`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_author` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account` varchar(255) NOT NULL COMMENT '账户',
  `password` varchar(64) NOT NULL COMMENT '密码',
  `name` varchar(255) NOT NULL COMMENT '前台展示的名字',
  `email` varchar(255) NOT NULL COMMENT '作者邮箱',
  `avatar_url` varchar(1024) NOT NULL COMMENT '头像地址',
  `description` longtext NOT NULL COMMENT '自我介绍',
  `about_url` varchar(1024) NOT NULL COMMENT '个人页面地址',
  `wechat_qrcode` varchar(1024) DEFAULT NULL COMMENT '微信二维码',
  `reward_qrcode` varchar(1024) DEFAULT NULL COMMENT '打赏二维码',
  `reward_title` varchar(1024) DEFAULT NULL COMMENT '打赏标题',
  `created_date` datetime NOT NULL COMMENT '创建日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='作者（管理员）表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_author`
--

LOCK TABLES `zblog_author` WRITE;
/*!40000 ALTER TABLE `zblog_author` DISABLE KEYS */;
INSERT INTO `zblog_author` VALUES (1,'admin','917cbc3b05c1ab68b6c14e21eb3c7f5d8e9d20a96b1f816651d8c086f79f4558','管理员','admin@admin.com','','','','','','','2018-08-06 19:06:44');
/*!40000 ALTER TABLE `zblog_author` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_banner`
--

DROP TABLE IF EXISTS `zblog_banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_banner` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '标题',
  `cover` varchar(1024) NOT NULL COMMENT '封面',
  `url` varchar(2048) NOT NULL COMMENT '链接地址',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否上架',
  `index` int(10) unsigned NOT NULL COMMENT '排序',
  `is_del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='头部轮播图';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_banner`
--

LOCK TABLES `zblog_banner` WRITE;
/*!40000 ALTER TABLE `zblog_banner` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_banner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_category`
--

DROP TABLE IF EXISTS `zblog_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `name` varchar(255) NOT NULL COMMENT '分类名',
  `pathname` varchar(255) NOT NULL COMMENT '分类路径',
  `description` varchar(1024) NOT NULL COMMENT '分类介绍',
  `is_del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章类别表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_category`
--

LOCK TABLES `zblog_category` WRITE;
/*!40000 ALTER TABLE `zblog_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_comment`
--

DROP TABLE IF EXISTS `zblog_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_comment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '评论id',
  `comment_id` int(10) DEFAULT NULL COMMENT '被回复评论的id',
  `user_id` int(10) unsigned NOT NULL COMMENT '评论者id',
  `pathname` varchar(1024) NOT NULL COMMENT '评论所属url路径',
  `markdown` text NOT NULL COMMENT '评论markdown',
  `richtext` text NOT NULL COMMENT '评论富文本',
  `created_date` datetime NOT NULL COMMENT '创建日期',
  `is_del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_comment`
--

LOCK TABLES `zblog_comment` WRITE;
/*!40000 ALTER TABLE `zblog_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_email_template`
--

DROP TABLE IF EXISTS `zblog_email_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_email_template` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '模板标题',
  `subject` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `html` text NOT NULL,
  `mark` varchar(255) NOT NULL COMMENT '模板标志',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='系统邮件模板列表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_email_template`
--

LOCK TABLES `zblog_email_template` WRITE;
/*!40000 ALTER TABLE `zblog_email_template` DISABLE KEYS */;
INSERT INTO `zblog_email_template` VALUES (1,'注册验证码模板','欢迎注册，我们需要验证您的邮箱身份','您正在进行邮箱验证，验证码为：${validCode}','<p>\r您正在进行邮箱验证，验证码为：<strong>${validCode}</strong>\r </p>','VALID_CODE');
/*!40000 ALTER TABLE `zblog_email_template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_layout`
--

DROP TABLE IF EXISTS `zblog_layout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_layout` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0: 基础设置，1：',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='布局设置';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_layout`
--

LOCK TABLES `zblog_layout` WRITE;
/*!40000 ALTER TABLE `zblog_layout` DISABLE KEYS */;
INSERT INTO `zblog_layout` VALUES (1,'show_banner','1',0),(2,'show_promotion','1',0),(3,'promotion_tag','热点',0),(4,'promotion_title','热点标题',0),(5,'promotion_description','热点内容',0),(6,'promotion_path','/',0);
/*!40000 ALTER TABLE `zblog_layout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_nav`
--

DROP TABLE IF EXISTS `zblog_nav`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_nav` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL COMMENT '导航名',
  `icon` varchar(64) NOT NULL COMMENT '导航项目icon',
  `url` varchar(1024) NOT NULL COMMENT '链接',
  `index` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `is_del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0为主菜单，1为副菜单',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='导航列表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_nav`
--

LOCK TABLES `zblog_nav` WRITE;
/*!40000 ALTER TABLE `zblog_nav` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_nav` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_options`
--

DROP TABLE IF EXISTS `zblog_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_options` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL COMMENT '配置key',
  `value` text COMMENT '配置值',
  `type` tinyint(1) NOT NULL COMMENT '0为基本设置，1为上传设置',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COMMENT='配置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_options`
--

LOCK TABLES `zblog_options` WRITE;
/*!40000 ALTER TABLE `zblog_options` DISABLE KEYS */;
INSERT INTO `zblog_options` VALUES (1,'title','个人网站',0),(2,'site','https://www.baidu.com',0),(3,'sub_title','<span>个人网站</span>\r <br>\r <span>个人网站</span>',0),(4,'description','hello,world!',0),(5,'keywords','个人网站',0),(6,'favicon','',0),(7,'copyright','版权信息',0),(8,'qiniu_access_key','',1),(9,'qiniu_secret_key','',1),(10,'qiniu_bucket','',1),(11,'qiniu_domain','',1),(12,'qiniu_prefix',NULL,1),(13,'qiniu_enabled','0',1),(14,'welcome_content','',0),(15,'passage_tag','',0),(16,'email_host','',2),(17,'email_port','',2),(18,'email_secure','1',2),(19,'email_user','',2),(20,'email_password','',2),(21,'email_enabled','1',2),(22,'email_show_name','',2),(23,'calculator_script','',3),(24,'custom_style','',4),(25,'custom_script','',4),(26,'wechat_enabled','0',5),(27,'wechat_appid','',5),(28,'wechat_appsecret','',5);
/*!40000 ALTER TABLE `zblog_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_page`
--

DROP TABLE IF EXISTS `zblog_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_page` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '页面id',
  `title` varchar(255) NOT NULL COMMENT '页面标题',
  `meta_keywords` longtext NOT NULL COMMENT '页面关键词',
  `meta_description` longtext NOT NULL COMMENT '页面描述',
  `pathname` varchar(255) NOT NULL COMMENT 'url别名',
  `markdown` longtext NOT NULL COMMENT 'markdown内容',
  `richtext` longtext NOT NULL COMMENT '富文本内容',
  `cover_url` varchar(1024) DEFAULT NULL COMMENT '文章封面url',
  `layout` varchar(255) NOT NULL COMMENT '采用的布局',
  `allow_comment` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0不允许评论，1允许评论',
  `script_list` longtext NOT NULL COMMENT '页面脚本列表',
  `style_list` longtext NOT NULL COMMENT '样式列表',
  `script_custom` longtext NOT NULL COMMENT '自定义脚本',
  `style_custom` longtext NOT NULL COMMENT '自定义样式',
  `created_date` datetime NOT NULL COMMENT '创建日期',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0为下架状态，1为上架状态',
  `is_del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='页面列表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_page`
--

LOCK TABLES `zblog_page` WRITE;
/*!40000 ALTER TABLE `zblog_page` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_post`
--

DROP TABLE IF EXISTS `zblog_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_post` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '文章id',
  `author_id` int(10) unsigned NOT NULL COMMENT '作者id',
  `type` tinyint(2) NOT NULL DEFAULT '0' COMMENT '0为原创，1为投稿发布，2为转载网络文章',
  `contributor_id` int(10) DEFAULT NULL COMMENT 'type为1时，投稿者的id',
  `reproduce_url` varchar(1024) DEFAULT NULL COMMENT 'type为2时的转载链接',
  `reproduce_name` varchar(255) DEFAULT NULL COMMENT '转载链接名',
  `reproduce_markdown` longtext NOT NULL COMMENT '转载观点',
  `reproduce_richtext` longtext NOT NULL,
  `cover_url` varchar(1024) DEFAULT NULL COMMENT '文章封面url',
  `title` varchar(255) NOT NULL COMMENT '文章标题',
  `pathname` varchar(255) NOT NULL COMMENT 'url别名',
  `summary` longtext NOT NULL COMMENT '文章摘要',
  `markdown` longtext NOT NULL COMMENT 'markdown内容',
  `richtext` longtext NOT NULL COMMENT '富文本内容',
  `allow_comment` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0不允许评论，1允许评论',
  `read_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '阅读量',
  `comment_count` int(10) NOT NULL DEFAULT '0' COMMENT '评论数',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0为下架状态，1为上架状态',
  `created_date` datetime NOT NULL COMMENT '文章创建日期',
  `updated_date` datetime NOT NULL COMMENT '文章更新日期',
  `is_del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='zblog文章表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_post`
--

LOCK TABLES `zblog_post` WRITE;
/*!40000 ALTER TABLE `zblog_post` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_post_category`
--

DROP TABLE IF EXISTS `zblog_post_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_post_category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '关系表id',
  `post_id` int(10) unsigned NOT NULL COMMENT '文章id',
  `category_id` int(10) unsigned NOT NULL COMMENT '分类id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章和分类关系表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_post_category`
--

LOCK TABLES `zblog_post_category` WRITE;
/*!40000 ALTER TABLE `zblog_post_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_post_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_post_tag`
--

DROP TABLE IF EXISTS `zblog_post_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_post_tag` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '关系id',
  `post_id` int(10) unsigned NOT NULL COMMENT '文章id',
  `tag_id` int(10) unsigned NOT NULL COMMENT '标签id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章标签关系表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_post_tag`
--

LOCK TABLES `zblog_post_tag` WRITE;
/*!40000 ALTER TABLE `zblog_post_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_post_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_praise`
--

DROP TABLE IF EXISTS `zblog_praise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_praise` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL COMMENT '用户id',
  `post_id` int(10) NOT NULL COMMENT '文章id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='注册用户和文章点赞关系表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_praise`
--

LOCK TABLES `zblog_praise` WRITE;
/*!40000 ALTER TABLE `zblog_praise` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_praise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_ptype`
--

DROP TABLE IF EXISTS `zblog_ptype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_ptype` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='系统中的页面种类';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_ptype`
--

LOCK TABLES `zblog_ptype` WRITE;
/*!40000 ALTER TABLE `zblog_ptype` DISABLE KEYS */;
INSERT INTO `zblog_ptype` VALUES (1,'cate','分类页'),(2,'index','首页'),(3,'page','普通页'),(5,'search','搜索页'),(6,'tag','标签页');
/*!40000 ALTER TABLE `zblog_ptype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_ptype_sidebar`
--

DROP TABLE IF EXISTS `zblog_ptype_sidebar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_ptype_sidebar` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ptype_id` int(11) NOT NULL COMMENT '页面id',
  `sidebar_id` int(11) NOT NULL COMMENT '侧栏id',
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `index` int(10) NOT NULL COMMENT '序列',
  `custom_style` text,
  `custom_script` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='页面侧栏关系表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_ptype_sidebar`
--

LOCK TABLES `zblog_ptype_sidebar` WRITE;
/*!40000 ALTER TABLE `zblog_ptype_sidebar` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_ptype_sidebar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_register_user`
--

DROP TABLE IF EXISTS `zblog_register_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_register_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `email` varchar(1024) NOT NULL COMMENT '邮箱',
  `nick_name` varchar(64) NOT NULL COMMENT '昵称',
  `password` varchar(64) NOT NULL COMMENT '用户密码',
  `avatar` varchar(1024) NOT NULL COMMENT '用户头像url',
  `status` tinyint(2) NOT NULL DEFAULT '1' COMMENT '用户状态（0:锁定，1：正常）',
  `allow_comment` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否允许评论',
  `access_token` varchar(32) NOT NULL COMMENT '访问令牌',
  `token_expired_date` datetime NOT NULL COMMENT '访问令牌过期时间',
  `created_date` datetime NOT NULL COMMENT '注册日期',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nick_name_UNIQUE` (`nick_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='qq注册用户';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_register_user`
--

LOCK TABLES `zblog_register_user` WRITE;
/*!40000 ALTER TABLE `zblog_register_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_register_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_sidebar`
--

DROP TABLE IF EXISTS `zblog_sidebar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_sidebar` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '侧边栏名字',
  `content` text NOT NULL,
  `mark` varchar(255) NOT NULL COMMENT '工具标志',
  `custom_style` text NOT NULL,
  `custom_script` text NOT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否为系统内置',
  `is_del` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='预置侧边栏列表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_sidebar`
--

LOCK TABLES `zblog_sidebar` WRITE;
/*!40000 ALTER TABLE `zblog_sidebar` DISABLE KEYS */;
INSERT INTO `zblog_sidebar` VALUES (1,'搜索组件','<div class=\"widget\">\n    {% if widget_title %}\n      <h3>{{widget_title}}</h3>\n    {% endif %}\n    <div class=\"widget-content\">\n      <form class=\"search\" action=\"/search\" method=\"get\">\n        <div class=\"input-group\">\n          <input type=\"text\" name=\"keyword\" class=\"input-group-input\" size=\"35\" placeholder=\"请输入关键字\" maxlength=\"15\" autocomplete=\"off\"/>\n          <span class=\"input-group-btn\">\n            <button class=\"btn\" type=\"submit\">搜索</button>\n          </span>\n        </div>\n      </form>\n    </div>\n  </div>','WIDGET_SEARCH','','',1,0),(2,'用户中心','<div class=\"widget\" id=\"widget-ucenter\">\n    {% if widget_title %}\n      <h3>{{widget_title}}</h3>\n    {% endif %}\n    <div class=\"widget-content\">\n      <div class=\"ucenter\">\n        <div class=\"box unlogin\">\n          <h3>登录后可享受更多特权</h3>\n          <a class=\"btn btn-primary\" href=\"/ucenter#signin\">快速登录</a>\n          &nbsp;\n          <a class=\"btn btn-default\" href=\"/ucenter#signup\">立即注册</a>\n        </div>\n        <div class=\"box login\">\n          <img src=\"/static/images/default-avatar.jpeg\" class=\"avatar\"/>\n          <div class=\"nick-name\"></div>\n          <a class=\"btn btn-default\" href=\"/ucenter\">进入个人中心</a>\n        </div>\n      </div>\n    </div>\n  </div>','WIDGET_UCENTER','','var ucenter = document.querySelector(\"#widget-ucenter\") || \"\";\nvar isUserLogin =\n  !!localStorage.getItem(\"client-user\") &&\n  !!localStorage.getItem(\"client-token\");\nif (!!ucenter) {\n  ucenter.querySelector(\".box.unlogin\").style.display = isUserLogin\n    ? \"none\"\n    : \"block\";\n\n  ucenter.querySelector(\".box.login\").style.display = !isUserLogin\n    ? \"none\"\n    : \"block\";\n\n  if (isUserLogin) {\n    var userInfo = JSON.parse(localStorage.getItem(\"client-user\"));\n    ucenter\n      .querySelector(\".box.login > .avatar\")\n      .setAttribute(\n        \"src\",\n        userInfo.avatar || \"/static/images/default-avatar.jpeg\"\n      );\n    ucenter.querySelector(\".box.login > .nick-name\").innerText = userInfo.name;\n  }\n}',1,0),(3,'热门标签','<div class=\"widget\">\n    {% if widget_title %}\n      <h3>{{widget_title}}</h3>\n    {% endif %}\n    <div class=\"widget-content\">\n      <div class=\"label\">\n        {% for tagItem in tagList%}\n          <a href=\"/tag/{{tagItem.pathname}}\" title=\"{{tagItem.name}}\">{{tagItem.name}}</a>\n        {% endfor %}\n      </div>\n    </div>\n  </div>','WIDGET_TAG','','',1,0),(6,'最新评论','<div class=\"widget\">','WIDGET_COMMENT','','',1,0);
/*!40000 ALTER TABLE `zblog_sidebar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_tag`
--

DROP TABLE IF EXISTS `zblog_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_tag` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '标签id',
  `name` varchar(255) NOT NULL COMMENT '标签名',
  `pathname` varchar(255) NOT NULL COMMENT '标签路径',
  `description` varchar(1024) DEFAULT NULL COMMENT '标签描述',
  `is_del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_tag`
--

LOCK TABLES `zblog_tag` WRITE;
/*!40000 ALTER TABLE `zblog_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zblog_upload`
--

DROP TABLE IF EXISTS `zblog_upload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zblog_upload` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '上传id',
  `type` tinyint(1) NOT NULL COMMENT '类型，0为本地文件，1为云文件',
  `name` varchar(255) NOT NULL COMMENT '文件原名',
  `extension` varchar(255) NOT NULL COMMENT '文件类型',
  `url` varchar(1024) NOT NULL COMMENT '网络路径',
  `path` varchar(1024) NOT NULL COMMENT '存储路径',
  `created_date` datetime NOT NULL COMMENT '创建时间',
  `is_del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='上传管理';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zblog_upload`
--

LOCK TABLES `zblog_upload` WRITE;
/*!40000 ALTER TABLE `zblog_upload` DISABLE KEYS */;
/*!40000 ALTER TABLE `zblog_upload` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-07-09  9:59:38

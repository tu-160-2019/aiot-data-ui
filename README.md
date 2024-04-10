## 项目说明
srt-cloud 是采用 Vue3，Ts，Spring Cloud Alibaba、SpringSecurity、Spring Cloud Gateway、SpringBoot、Nacos、Redis、Mybatis-Plus，Tidb，Flink，Hadoop 等最新技术，开发的全新数睿通数据中台，包含数据集成，数据开发，数据治理，数据资产，数据服务，数据集市六大模块，解决数据孤岛问题，实现数据统一口径标准，自定义数据开发任务，帮助企业，政府等解决数据问题！目前项目正在开发中，会尽快做出一版成型可用的产品。

## 功能模块说明

目前全局管理，应用管理，日志管理，系统管理，数据集成，数据开发，数据服务几大模块已基本完毕。

- 数据集成

  - 数据库管理 — 管理用户添加的数据源，支持 MYSQL/ORACLE/SQLSERVER/POSTGRESQL/GREENPLUM/MARIADB/DB2/DM/OSCAR/KINGBASE8/OSCAR/GBASE8A/HIVE/SQLITE3/SYBASE，支持库表查询，测试连接等
  - 文件管理 — 管理用户上传的文件数据
  - 数据接入 — 接入外部数据源的数据到中台 **ODS** 层，也可自定义接入目的端数据源，支持一次性全量同步和周期性增量同步；可自定义表名，字段名的映射规则，支持正则表达式匹配；支持查看执行记录及详细执行结果，可查看同步的数据量，数据大小，成功表数量，失败表数量，成功信息，失败信息，也可查看具体每张表同步的数据量，数据大小，错误信息等，帮助用户全面掌握数据接入的执行情况
  - 贴源数据 — 查看接入到ods层的数据表和数据，可查看每张表的同步记录
- 数据开发
  - 数据生产 — 对数据进行作业代码化编辑，自行 DDL 建模，运行，调试等
  - 调度中心
    - 调度管理 — 对生产作业进行流程编辑，可视化调度
    - 调度记录 — 查看调度结果，日志等
  - 运维中心 — 对作业执行运维管理
  - 资源中心
    - Flink 集群实例 — 管理 FLink 资源
    - Hadoop 集群配置 — 管理 Hadoop 资源
  - 配置中心 — 管理 FlinkSql 执行配置
- 数据服务
  - API 目录 — 用户自定义 API 目录，动态生成 API，对外提供服务
  - API 权限 — 对私有 API 进行授权操作
  - API 日志 — 查看 API 调用日志
- 数据治理
  - 元数据
    - 元模型 — 描述元数据的元数据，主要定义了元数据的属性，通常元模型都是系统内置的，如表元模型，字段元模型等
    - 元数据采集 — 根据定义的元模型对元数据进行采集，通常是每一种元模型有自己内置的采集逻辑，可以设置采集周期等
    - 元数据管理 — 对采集的元数据进行查看和管理
  - 数据血缘 — 通过数据接入，数据生产流程之间的关系自动构建数据血缘关系图，追溯数据流向（70%）
  - 数据标准
  - 数据质量
- 数据资产（开发中）
  - 资源管理 — 自定义资源目录，在每个目录下自定义资源，挂在数据库，api等
  - 资产总览 — 对中台资源做一个总的统计概览
- 数据集市（待开发）
  - 资源目录 — 中台资源目录以及目录下资源的查看，可对资源进行申请操作
  - API 目录 — 中台 API 目录以及目录下 API 的查看，可对 API 进行申请
  - 我的申请 — 可以查看自己的申请记录，审批结果
  - 服务审批 — 管理员对其他角色的申请做出审批，若审批通过，申请人便可以收到审批通过的消息，使用自己申请的服务资源
- 全局管理
  - 数据项目管理 — 中台项目（租户）的管理，每个项目下可以关联用户，用户只能查看自己关联的项目下的数据，选择自己的数据仓库，所有的模块数据都会有所属项目
  - 数仓分层展示 — 对中台数仓的分成做展示说明
- 应用管理
  - 消息管理
    - 短信平台 — 集成短信平台，支持阿里，腾讯等常用的短信平台
    - 短信日志 — 调用短信所产生的日志
- 日志管理

  - 登录日志 — 系统登录产生的日志
- 系统管理
  - 用户管理 — 对系统用户进行管理
  - 菜单管理 — 对系统菜单进行管理，用于实现动态菜单
  - 定时任务 — 可自定义定时任务，调度执行
  - 数据字典 — 系统的字典数据
  - 机构管理 — 机构数据，若各模块中的数据有所属机构概念，可用于数据权限管理
  - 岗位管理 — 岗位的管理
  - 角色管理 — 角色管理，可以为每个角色自定义菜单查看权限以及机构级的数据权限
  - 附件管理 — 系统附件管理，可以上传下载

## 系统数仓架构

系统数仓可以在全局项目管理中配置不同租户的数据仓库，在数据集成集成到ods层之后， 可以通过数据生产进行数据开发，数据整体流向图如下：

###### ![数睿通数仓架构图](images/数睿通数仓架构图.png)

关于数仓为什么要分层：分层可以有助于数据的管理，同时每次取数只需要获取统计分析过的成品就可以，不需要从源头数据反复计算，避免了计算资源的浪费，通常源头数据量较大，并且中间的处理逻辑较为复杂，所以采用建模分层的方式解决，通常表的前缀都用层级来定义。

## 系统核心技术栈

前台：

- vue3
- vite
- typeScript
- element-plus
- pinia 
- 。。。

后台：

- Spring Cloud Alibaba
- SpringSecurity
- Spring Cloud Gateway
- SpringBoot
- Nacos
- Redis
- Mybatis-Plus
- mysql8.0
- tidb
- doris
- flink
- flink cdc
- flink sql
- neo4j 
- 。。。

## 系统运行方式

### 下载Nacos

需要从GitHub下载Nacos，下载地址：https://github.com/alibaba/nacos/releases
下载2.1.1版本，因为本项目使用的是Nacos 2.1.1，如果版本号对应不上，后面项目启动会出错。

### nacos数据库

注意：Nacos 目前只支持MySQL数据库，请安装MySQL8.0版本，以免出现其他错误。

新建数据库nacos_config，并运行【conf/nacos-mysql.sql】文件，初始化数据库即可。

### 修改Nacos的配置文件

需要在【conf/application.properties】文件末尾，新增如下配置：

```bash
# 填自己的ip地址，本地填127.0.0.1就行
nacos.inetutils.ip-address=127.0.0.1

spring.datasource.platform=mysql
db.num=1
#填自己的数据库连接和密码
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user.0=root
db.password.0=root
```

### 启动Nacos

```bash
Windows：
startup.cmd -m standalone

Linux: 
sh startup.sh -m standalone

# 集群启动可关注公众号 螺旋编程极客 查看
```

访问Nacos管理界面(http://localhost:8848/nacos) ，初始用户名nacos，密码nacos，登录之后，如下所示：

![image-20221030203128590](images/nacos.png)

### 创建系统数据库

创建 `srt_cloud` 数据库，数据库编码为`utf8mb4`
执行`db/srt_cloud.sql`文件，初始化数据库脚本

### 导入Nacos配置文件

导入Nacos配置文件，配置文件在项目里，文件名为：【deploy/nacos_config.zip】，如下所示：

![](images/nacos-config.png)

导入配置文件后，还需要在Nacos里，修改datasource.yaml，如：Redis、MySQL信息等。

### 下载安装 neo4j

具体参考

[neo4j安装](https://blog.csdn.net/weixin_44593504/article/details/119903908)

安装 neo4j-community-3.5.3-unix.tar.gz 版本（相关安装包文件夹里有），否则可能不适配

### 启动后端

把系统导入 idea，注意部门 jdbc  驱动包 maven 官方仓库不存在，需要手动在本地 mvn install 一下，jar 包在网盘 jdbc 驱动包自取，导入项目后，右上角 profiles 勾选 flink1.14，多刷新几次，导入完 maven 依赖之后，依次启动：

#### 启动 srt-cloud-gateway

运行 GatewayApplication.java

#### 启动 srt-cloud-system

运行 SystemApplication.java

#### 启动 srt-cloud-data-integrate

运行 DataIntegrateApplication.java

#### 启动 srt-cloud-data-development

运行 DataDevelopmentApplication.java

#### 启动 srt-cloud-data-service

运行 DataServiceApplication.java

#### 启动 srt-cloud-data-governance

运行 DataGovernanceApplication.java

#### 启动 srt-cloud-quartz

运行  QuartzApplication.java

#### 启动 srt-cloud-message

运行 MessageApplication.java

### 启动前端

安装版本号为`16.15.0`的`nodejs`，如果已经安装了，请先卸载，推荐使用 nvm 安装 node.js，方便切换不同版本

1. 需要先把本地安装的`nodejs`卸载，然后再下载nvm，地址：
   https://github.com/coreybutler/nvm-windows/releases
2. 一般情况，找到最新版本，然后下载`nvm-setup.exe`文件就可以了，下载后，我们双击安装即可。
3. 我们使用`PowerShell`打开命令行，这里需要注意下，要使用`管理员`身份打开`PowerShell`
4. 命令`nvm version` ，可以查看版本号
5. 命令`nvm ls available`查看`nodejs`可用的版本
6. 命令`nvm install 16.15.0`，可以安装版本号为`16.15.0`的`nodejs`
7. 命令`nvm list`，可以查看已安装的版本号
8. 命令`nvm use 16.15.0`，可以切换到版本号为`16.15.0`的`nodejs`，现在就可以通过命令`node -v`查看当前的`nodejs`版本号
9. 命令`nvm uninstall 16.15.0`，可以卸载版本号为`16.15.0`的`nodejs`

用 vscode 或 hbuildx 打开 srt-cloud-web

安装依赖：

```bash
npm install
```

运行项目：

```bash
npm run dev
```

打包项目

```bash
npm run build
```

## 系统运行展示

![image-20221030205835569](images/login.png)

![](images/首页.png)

![image-20221030210227005](images/数据库管理.png)

![image-20221030210420292](images/修改数据库.png)

![image-20221030210549858](images/查看库表.png)

![image-20221030210702083](images/数据接入.png)

![image-20221030210802981](images/接入查看.png)

![image-20221030210913467](images/接入编辑.png)

![image-20221030211158654](images/执行记录.png)

![image-20221030211424876](images/同步结果.png)

![数据生产-sql](images/数据生产-sql.png)

![数据生产-flinksql校验](images/数据生产-flinksql校验.png)

![数据生产-msyql-cdc](images/数据生产-mysql-cdc.png)

![数据生产-调度](images/数据生产-调度.png)

![数据生产-执行](images/数据生产-执行.png)

![运维中心](images/运维中心.png)

![元模型](images/元模型.png)

![元数据采集](images/元数据采集.png)

![元数据采集记录](images/元数据采集记录.png)

![采集日志](images/采集日志.png)

![元数据管理](images/元数据管理.png)

## 帮助支持

想要了解更多的朋友请关注公众号 **螺旋编程极客** 添加作者微信或在菜单栏加入知识星球，一起进步，一起成长。
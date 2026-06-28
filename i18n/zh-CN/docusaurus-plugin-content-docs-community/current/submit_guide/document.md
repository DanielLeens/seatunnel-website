---
title: 文档须知
sidebar_position: 1
---

# 文档须知

良好的使用文档对任何类型的软件都是至关重要的。欢迎任何可以改进 Seatunnel 文档的贡献。

## 先确认该改哪个仓库

SeaTunnel 的文档工作现在分布在两个仓库中：

- **当前版本文档页面**，也就是 `https://seatunnel.apache.org/docs/...` 下的页面，source of truth 在 [apache/seatunnel](https://github.com/apache/seatunnel/tree/dev/docs)。
- **网站壳页面** 在 [apache/seatunnel-website](https://github.com/apache/seatunnel-website) 中维护，例如首页、导航、版本入口、搜索、样式、渲染、社区页面，以及历史版本文档快照。

如果您修改的是当前版本文档页面，请到 `apache/seatunnel` 提 PR。
如果您修改的是网站壳或历史版本快照，请到 `apache/seatunnel-website` 提 PR。

## 获取网站项目

如果您的改动属于 `apache/seatunnel-website`，请先 fork 该仓库，再克隆到本地：

```
git clone https://github.com/<your-github-user-name>/seatunnel-website
```

如果您的改动属于 `apache/seatunnel`，请改为参考主仓库中的文档构建与提交流程。

## 预览并生成静态文件

本网站是使用node编译的，使用的是Docusaurus框架组件

1. 下载并安装 nodejs(version>12.5.0)
2. 克隆代码到本地 `git clone  git@github.com:apache/seatunnel-website.git`
2. 运行 `npm install` 来安装所需的依赖库。
3. 在根目录运行`npm run start`，可以访问http://localhost:3000查看站点英文模式预览
4. 在根目录运行`npm run start-zh`，可以访问http://localhost:3000查看站点的中文模式预览
5. 要生成静态网站资源文件，运行 `npm run build`。构建的静态资源在build目录中。

## 目录结构
```html

|-- community //社区
|-- docs     //文档  存方下一个即将发布的版本
|-- download //下载
|-- faq      //Q&A
|-- i18n    
|   -- zh-CN  //国际化中文
|       |-- code.json
|       |-- docusaurus-plugin-content-docs
|       |-- docusaurus-plugin-content-docs-community
|       |-- docusaurus-plugin-content-docs-download
|       |-- docusaurus-plugin-content-docs-faq
|       `-- docusaurus-theme-classic
|-- resource // 架构/时序/流程图等的原始工程文件
|-- src
|   |-- components
|   |-- css
|   |-- js
|   |-- pages
|   |   |-- home
|   |   |-- index.jsx
|   |   |-- team
|   |   |-- user
|   |-- styles
|-- static //图片静态资源
|   |-- doc  //文档的图片
|   |-- user //用户的图片
|   |-- home //首页的图片
|   |-- img  //公用图片
|-- docusaurus.config.js

```

## 规范

### 目录命名规范

全部采用小写方式， 以中下划线分隔，有复数结构时，要采用复数命名法， 缩写不用复数

正例： `scripts / styles / components / images / utils / layouts / demo_styles / demo-scripts / img / doc`

反例： `script / style / demoStyles / imgs / docs`

### vue以及静态资源文件命名规范

全部采用小写方式， 以中划线分隔

正例： `render-dom.js / signup.css / index.html / company-logo.png`

反例： `renderDom.js / UserManagement.html`

### 资源路径

图片资源统一放在`static/{模块名}`下

css等样式文件放在`src/css`目录下

### 页面内容修改
> 当前版本文档页面底部的 `Edit this page` 会把贡献者导向 `apache/seatunnel`。首页、团队、用户、版本列表等网站壳页面仍然会导向 `apache/seatunnel-website`。

### 首页页面修改
访问页面  https://seatunnel.apache.org/
位于 `src/pages/home`

```
├─home
│      languages.json 首页中英文的配置  
│      index.less  首页样式
```
### 团队页面修改
访问页面  https://seatunnel.apache.org/zh-CN/team
位于 `src/pages/team`
```
├─team
│ languages.json
│ index.js
│ index.less
```
### 用户 列表页面修改
访问页面  https://seatunnel.apache.org/zh-CN/user/
```
位于 `src/pages/user`
└─versions
        data.json
        images.json
        index.js
        index.less
        languages.json
```

### version 列表页面修改
访问页面  https://seatunnel.apache.org/zh-CN/versions/
```
位于 `src/pages/versions`
└─versions
        languages.json
        index.jsorchestrator/overview.md
        index.less
```

# 概述

一个儿童绘本应用，基于next开发，做了PWA搁手机上能当个app用

# 快速开始
## 1. 安装
```sh
npm install
```

## 2. 数据准备

总的来说是准备一个远程的json数据，用于构建的时候拉取数据。结构同 [Book](src/types/book.ts)即可
没有现成的也可以爬虫，这里提供爬取步骤，但不提供数据

### 1. 数据爬取
```sh
node crawler/src/id.js
node crawler/src/book.js
node crawler/src/audio.js
node crawler/src/image.js
```
每个命令都能执行完的话就完成了绘本数据爬取、图片下载、音频下载的任务了

### 2. 资源上传

1. 手动上传下载的图片、音频数据
2. 修改books-raw.json中的图片、音频地址
3. 上传books-raw.json至远端，拿到 *BOOKS_FETCH_URL*

## 3. 部署

### 1. Vercel
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fh2562961224%2FPicture-Book-Next&env=BOOKS_FETCH_URL&project-name=picture-book-next&repository-name=Picture-Book-Next)
只需要填一个*BOOKS_FETCH_URL*即可

### 2. 本地部署

1. 复制*example.env* 至 *.env.local*
2. 修改变量*BOOKS_FETCH_URL*
```sh
npm run dev
```
# 精弘网络问卷系统  

使用Vue3 + TS + tailwindcss开发的问卷系统

## 介绍

这里是由浙江工业大学学生组织精弘网络完全独立自主开发的问卷系统的前端仓库,包含管理端和用户端.  
在用户端做了较为完好的移动端适配,是调研工作中的好帮手.  

## 技术栈

- Vue全家桶
- Typescript
- tailwindcss
- Axios

## 快速开始

1. fork仓库并clone到本地
2. 切换至dev分支
3. 依照`.env.sample`根目录配置`.env`文件
4. 安装依赖 `pnpm i`
5. 运行 `pnpm run dev`
6. 点击本地运行网址进行预览

## 贡献

如果你在使用过程中发现bug或者想提出新的点子,欢迎提出issue,我们会定期查阅.  

如果你想做出代码贡献,请按照以下步骤.  

1. fork仓库(不要main only)
2. clone仓库到本地
3. 切换至dev分支
4. 在本地dev分支上进行修改
5. Coding结束后运行`pnpm run lint`进行代码质量检测
6. 提交修改
7. pr至组织仓库的dev分支

## 打包部署

- `pnpm run build` 生成dist文件夹
- `pnpm run uploadCDN` 运行上传cdn脚本
- 压缩dist文件夹发给后端小伙伴

## 更多资料

- tailwindcss 官方文档: [https://tailwindcss.com/](https://tailwindcss.com/)

## 开发者

精弘问卷系统能走到今天，离不开这些开发者对前端的贡献❤️

<a href="https://github.com/zjutjh/JingHong-Questionnaire/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=zjutjh/JingHong-Questionnaire"/>
</a>

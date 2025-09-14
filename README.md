# JSONLint.com

## Overview

[**JSONLint**](https://jsonlint.com) is your go-to online solution for JSON data validation and formatting. Whether you are debugging a system, or just need to ensure your JSON data is in the correct format, JSONLint is here to assist.

> [!NOTE]
> We also recommend checking out our [JSON Formatter Google Chrome plugin](https://chrome.google.com/webstore/detail/json-formatter/ondecobpcidaehknoegeapmclapnkgcl) ([GitHub Repo](https://github.com/circlecell/jsonformatter))

## Features

- **JSON Validation**: Instantly verify if your JSON data is correctly formatted. Get precise error details for any discrepancies.
- **JSON Beautification**: Transform your JSON data into a human-friendly format, making it effortlessly readable and editable.
- **Lightweight & Fast**: Designed for efficiency, ensuring you get the results you need instantly.

## How to Use

1. Visit [JSONLint.com](https://jsonlint.com/)
2. Paste JSON data.
3. Click on the 'Validate JSON' button.
4. Review results. If there are issues, JSONLint will highlight them and suggest corrections.

## Feedback & Contributions

We are always looking to make JSONLint even better! If you have any suggestions, features requests, or found a bug, please:

- [Create an Issue](https://github.com/circlecell/jsonlint/issues) or
- [Submit a Pull Request](https://github.com/circlecell/jsonlint/pulls)

## How to develop and deploy
1. npm install --legacy-peer-deps
2. npm run dev =》 start server locally
3. npm run build =》 build depoly resource such as .next
4. 注册 Vercel (https://vercel.com)
5. 导入项目：连接你的 GitHub 账户，选择项目仓库
6. 自动部署：Vercel 会自动检测是 Next.js 项目并配置构建设置
7. 完成：每次向 main/master 分支推送代码时都会自动重新部署
# 北京实习流水

从北京实习第一天（**2026-06-04**）起记录打车、日用品、吃饭等支出，以及实习工资收入。玻璃态界面，数据保存在本机 **IndexedDB**（浏览器或 Tauri 桌面壳内）。

## 类目

| 类目 | 类型 |
|------|------|
| 打车 | 支出 |
| 日用品 | 支出 |
| 吃饭 | 支出 |
| 实习工资 | 收入 |

## 运行方式

### 方式一：桌面 exe（Tauri，推荐）

**环境（首次打包需要安装）：**

1. [Node.js](https://nodejs.org) LTS
2. [Rust](https://rustup.rs)（默认 `x86_64-pc-windows-msvc`）
3. Windows：**Visual Studio Build Tools**，勾选「使用 C++ 的桌面开发」

```bash
npm install
npm run tauri:dev    # 开发：弹出桌面窗口 + 热更新
npm run tauri:build      # 打 NSIS 安装包（需从 GitHub 拉工具，可能较慢）
npm run tauri:build:exe  # 只打 exe，不下载 WiX/安装器（推荐网络不稳时用）
```

**可执行文件（编译成功即有）：**

`src-tauri\target\release\app.exe`

**不要**在 Cursor 里点开 `app.exe`（会提示「无法打开 / Unable to resolve resource」，那是编辑器打不开二进制文件，不是程序坏了）。

请任选一种方式启动：

1. 双击项目根目录的 **`launch.bat`**（推荐；中文名 bat 会转调它）
2. 在资源管理器中双击 `src-tauri\target\release\app.exe`
3. PowerShell：`Start-Process .\src-tauri\target\release\app.exe`

**安装包（可选）：**

`src-tauri\target\release\bundle\nsis\` 下的 `.exe` 安装程序。

若 `tauri:build` 在下载 `wix` / `timeout: global` 处失败，说明 **程序已编译好**，只是 MSI 打包工具下载超时；请用 `tauri:build:exe` 或只运行上面的 `app.exe`。

**若 `tauri:build` 报 `crates-io` / `curl failed` / `Timeout`：** 是下载 Rust 依赖太慢。项目已在 `src-tauri/.cargo/config.toml` 配置国内镜像；请重新执行 `npm run tauri:build`。仍失败可开代理，或在用户目录 `C:\Users\lenovo\.cargo\config.toml` 复制同样内容后重试。

### 方式二：仅浏览器

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## 页面

概览 · 记一笔 · 流水（管理/删除）· 报表 · 设置

## 数据

- IndexedDB 库名：`intern-finance-db`
- **设置 → 导出/导入 JSON** 可备份
- 云端同步为占位功能

## 技术栈

Vite · React · TypeScript · Tailwind · Chart.js · Tauri 2 · IndexedDB

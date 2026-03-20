# IFDCS Frontend 部署指南

## 部署環境

- **平台**: AWS S3 靜態網站託管
- **區域**: ap-northeast-1 (Tokyo)
- **Bucket**: `ifdcs-frontend-jeff-2026`
- **網址**: http://ifdcs-frontend-jeff-2026.s3-website-ap-northeast-1.amazonaws.com/

## 部署指令

```bash
aws s3 sync /Users/jef/CodeRepository/ifdcs-frontend/ s3://ifdcs-frontend-jeff-2026/ \
  --exclude ".git/*" \
  --exclude ".claude/*" \
  --exclude "*.pen" \
  --exclude "DATA_MANAGEMENT.md" \
  --exclude "SKILL.md" \
  --exclude "CLAUDE.md" \
  --exclude "DEPLOY.md" \
  --exclude "報價資料/*" \
  --exclude "server/*" \
  --exclude ".DS_Store" \
  --exclude ".gitignore" \
  --exclude "node_modules/*"
```

## 排除檔案說明

| 排除項目 | 原因 |
|----------|------|
| `.git/*` | Git 版本控制目錄 |
| `.claude/*` | Claude Code 設定目錄 |
| `*.pen` | Pencil 設計稿檔案 |
| `CLAUDE.md`, `DEPLOY.md`, `SKILL.md`, `DATA_MANAGEMENT.md` | 開發文件，非前端頁面 |
| `報價資料/*` | 內部報價文件 |
| `server/*` | 後端程式碼 |
| `.DS_Store`, `.gitignore` | 系統/設定檔 |
| `node_modules/*` | Node.js 依賴套件 |

## 部署前檢查

1. 確認 AWS CLI 已設定且有 S3 寫入權限
2. 確認本地程式碼已測試通過
3. 建議先推送至 GitHub 再部署

## 完整部署流程

```bash
# 1. 推送至 GitHub
git add -A && git commit -m "描述變更內容" && git push origin main

# 2. 部署至 S3
aws s3 sync /Users/jef/CodeRepository/ifdcs-frontend/ s3://ifdcs-frontend-jeff-2026/ \
  --exclude ".git/*" \
  --exclude ".claude/*" \
  --exclude "*.pen" \
  --exclude "DATA_MANAGEMENT.md" \
  --exclude "SKILL.md" \
  --exclude "CLAUDE.md" \
  --exclude "DEPLOY.md" \
  --exclude "報價資料/*" \
  --exclude "server/*" \
  --exclude ".DS_Store" \
  --exclude ".gitignore" \
  --exclude "node_modules/*"
```

# Demo

小型內部系統接案練習模板。前後端同源、Spring Boot 自己打自己的 REST API，不需要處理 CORS。

## 技術棧

- Java 17 + Spring Boot 3.3.4
- Spring Security（Session-based 登入 + CSRF Cookie 模式）
- Spring Data JPA + MySQL 8.0
- 前端：純 HTML/CSS/JS（`src/main/resources/static`），用 `fetch` 呼叫同源的 `/api/**`

## 本機啟動

```
docker compose up -d
```

會同時啟動：
- `demo-app`：Spring Boot 應用程式（`localhost:8080`）
- `demo-mysql`：MySQL 8.0（`localhost:3306`）

第一次啟動會自動建立測試帳號：`admin` / `admin123`

登入頁：`http://localhost:8080/login.html`

## 本機開發 vs 正式上線的部署差異

`docker-compose.yml` 裡把 App 跟 MySQL 放在一起，是為了本機開發方便（一個指令跑完整環境）。**正式接案上線時不會這樣部署**，業界常見做法：

| | 本機開發（現況） | 正式上線 |
|---|---|---|
| DB 位置 | `docker-compose.yml` 裡的 `mysql` service | 目前規劃：交付到 VPS，用同一份 `docker-compose.yml`（MySQL 也跑 Docker），而不是雲端代管服務 |
| DB 生命週期 | 跟著 App 一起 up/down | 獨立運作，不受 App 部署影響 |
| 備份/高可用 | 沒有，資料在本機 Docker volume | 由代管服務或 DBA 負責 |
| App 怎麼接 DB | `docker-compose.yml` 裡的環境變數指向 `mysql` 這個 service name | 一樣用環境變數（`SPRING_DATASOURCE_URL`/`USERNAME`/`PASSWORD`），改指向正式 DB 位址即可，**App 程式碼不用改** |

因為連線資訊已經是透過環境變數注入（見 `docker-compose.yml` 的 `app.environment`），正式上線只需要：
1. 把 `docker-compose.yml` 的 `mysql` service 移除（或不使用）
2. App 啟動時的環境變數改指向正式 DB
3. `ddl-auto` 建議正式環境改用 `validate`，改用 migration 工具（Flyway/Liquibase）管理 schema，避免 `update` 誤動到正式資料表結構

## 待辦事項

- **資料庫備份**：目前 VPS 上的 MySQL 資料只存在單一台主機的 Docker volume 裡，沒有任何備份機制。如果 VPS 硬碟壞掉、誤刪、主機商出問題，資料會直接消失。正式交付前需要規劃：
  - 定期 `mysqldump` 備份（cron job）存到其他地方，或
  - 用 VPS 商提供的磁碟快照功能
  - 這件事跟「重新部署會不會蓋掉資料」是不同層次的風險——重新部署不會動到資料，但資料仍然只有這一份

## CI/CD

`.github/workflows/deploy.yml`：push 到 `main` 會自動編譯、build Docker image 並推到 Docker Hub。需要在 GitHub repo 設定 `DOCKERHUB_USERNAME`、`DOCKERHUB_TOKEN` 兩個 secrets。

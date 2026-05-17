# Navigator Invest 0.1 alpha

这是 Navigator Invest 的 0.1 alpha。当前版本已经包含本地后端、SQLite 数据库、实体 spec、前端页面和 API bootstrap。

启动方式：

```bash
cd "/Users/hong/Documents/New project/zhaoge_extraction/path_harness_site"
python3 backend/server.py --host 127.0.0.1 --port 8769
```

然后打开：

```text
http://127.0.0.1:8769/
```

本地数据：

```text
data/path_harness.sqlite
```

主要 API：

```text
GET  /api/health
GET  /api/bootstrap
GET  /api/entities/<table>
GET  /api/entities/<table>/<id>
POST /api/entities/<table>
```

重新从前端种子数据初始化数据库：

```bash
node scripts/export_seed_data.mjs
python3 backend/server.py --reset-db
```

0.1 alpha 仍不执行真实交易任务，不展示任何明文 token、webhook 或密钥。

服务器部署：

```bash
git clone <repo-url> /opt/path-harness-site
cd /opt/path-harness-site
HOST=0.0.0.0 PORT=8769 ./scripts/run_server.sh
```

如果用 systemd，可以参考 `deploy/path-harness.service.example`。当前固定端口默认是 `8769`，也可以通过 `PORT` 环境变量覆盖。

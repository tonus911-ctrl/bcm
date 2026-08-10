#!/usr/bin/env bash
# =====================================================================
#  ERGP · установка курса на российский сервер · v1 · 2026-08-10
#  Запускать один раз на чистой Ubuntu 24.04 из-под root:
#     bash <(curl -fsSL https://bcm.risk-place.ru/ergp-server/install.sh)
#  Скрипт ничего не спрашивает и не содержит секретов.
#  Ключ администратора создается случайным и печатается в конце ОДИН раз.
# =====================================================================
set -euo pipefail

SRC="https://bcm.risk-place.ru/ergp-server"
APP="/opt/ergp"
DATA="$APP/data"

echo "== 1/7 обновление системы и установка пакетов =="
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq nginx nodejs ca-certificates curl ufw >/dev/null

NODEV=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODEV" -lt 18 ]; then
  echo "ОШИБКА: нужен Node.js 18 или новее, установлен $NODEV"; exit 1
fi
echo "   node v$(node -v), nginx $(nginx -v 2>&1 | sed 's/.*\///')"

echo "== 2/7 каталоги =="
mkdir -p "$APP" "$DATA" "$APP/backups"

echo "== 3/7 загрузка кода приложения =="
curl -fsSL "$SRC/worker.js" -o "$APP/worker.js"
curl -fsSL "$SRC/server.js" -o "$APP/server.js"
node --check "$APP/worker.js"
node --check "$APP/server.js"
echo "   worker.js $(stat -c%s "$APP/worker.js") байт, server.js $(stat -c%s "$APP/server.js") байт, синтаксис в порядке"

echo "== 4/7 ключ администратора и служба =="
if [ ! -f "$APP/env" ]; then
  KEY="ergp-$(head -c 16 /dev/urandom | od -An -tx1 | tr -d ' \n')"
  printf 'ADMIN_KEY=%s\nERGP_DATA=%s\nERGP_PORT=8080\n' "$KEY" "$DATA" > "$APP/env"
  chmod 600 "$APP/env"
  NEWKEY=1
else
  NEWKEY=0
fi

cat > /etc/systemd/system/ergp.service <<'UNIT'
[Unit]
Description=ERGP course server
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/ergp
EnvironmentFile=/opt/ergp/env
ExecStart=/usr/bin/node /opt/ergp/server.js
Restart=always
RestartSec=3
User=root
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable --now ergp >/dev/null
sleep 2
systemctl is-active --quiet ergp && echo "   служба ergp запущена" || { echo "ОШИБКА: служба не поднялась"; journalctl -u ergp -n 20 --no-pager; exit 1; }

echo "== 5/7 веб-сервер nginx =="
cat > /etc/nginx/sites-available/ergp <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    client_max_body_size 8m;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 120s;
    }
}
NGINX
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/ergp /etc/nginx/sites-enabled/ergp
nginx -t >/dev/null 2>&1 && systemctl reload nginx && echo "   nginx настроен и перезапущен"

echo "== 6/7 фаервол =="
ufw allow 22/tcp >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
yes | ufw enable >/dev/null 2>&1 || true
echo "   открыты порты 22, 80, 443"

echo "== 7/7 ежедневные резервные копии =="
cat > "$APP/backup.sh" <<'BK'
#!/usr/bin/env bash
set -e
D=$(date +%F)
tar -czf /opt/ergp/backups/ergp-data-$D.tar.gz -C /opt/ergp data
find /opt/ergp/backups -name 'ergp-data-*.tar.gz' -mtime +30 -delete
BK
chmod +x "$APP/backup.sh"
cat > /etc/cron.d/ergp-backup <<'CRON'
17 3 * * * root /opt/ergp/backup.sh >/dev/null 2>&1
CRON
"$APP/backup.sh"
echo "   первая копия создана, дальше каждую ночь в 03:17, хранится 30 дней"

echo
echo "==================== ГОТОВО ===================="
echo "Проверка: curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1/"
curl -s -o /dev/null -w "   локальный ответ: %{http_code}\n" http://127.0.0.1/ || true
if [ "$NEWKEY" = "1" ]; then
  echo
  echo "КЛЮЧ АДМИНИСТРАТОРА (сохраните в Secret, показывается один раз):"
  grep '^ADMIN_KEY=' "$APP/env" | cut -d= -f2
fi
echo "================================================"

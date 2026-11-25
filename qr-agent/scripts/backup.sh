#!/usr/bin/env bash
# Sauvegarde quotidienne (à lancer par cron). Base hébergée : pg_dump ; base embarquée : copie du dossier (serveur arrêté ou au repos).
set -euo pipefail
OUT="${BACKUP_DIR:-./backups}"; mkdir -p "$OUT"; STAMP=$(date -u +%Y%m%dT%H%M%SZ)
if [ -n "${DATABASE_URL:-}" ]; then pg_dump "$DATABASE_URL" | gzip > "$OUT/qr-agent-$STAMP.sql.gz"
else tar -czf "$OUT/qr-agent-$STAMP.tar.gz" -C "${DATA_DIR:-./data}" pgdata; fi
find "$OUT" -type f -mtime +30 -delete; echo "backup ok: $OUT ($STAMP)"

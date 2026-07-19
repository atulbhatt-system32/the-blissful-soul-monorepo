#!/bin/bash
# =============================================================================
# The Blissful Soul — Container Backup Script
# =============================================================================
# Runs INSIDE the backup Docker container. Triggered by cron daily at 2 AM.
# Keeps last 15 days of backups, auto-deletes older ones.
# =============================================================================

set -euo pipefail

RETENTION_DAYS=15
BACKUP_ROOT="/backups"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H-%M-%S)
BACKUP_DIR="${BACKUP_ROOT}/${DATE}"
LOG_FILE="${BACKUP_ROOT}/backup.log"

log() {
    local message="$*"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[${timestamp}] ${message}"
    echo "[${timestamp}] ${message}" >> "$LOG_FILE"
}

mkdir -p "$BACKUP_DIR"

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "🔄 Blissful Soul Backup — Starting"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "Date: ${DATE} | Time: ${TIME}"

PASSED=0
FAILED=0
SKIPPED=0

# ─── Step 1: PostgreSQL Database Dump ────────────────────────────────────────

log "━━━ [1/4] PostgreSQL Database Dump ━━━"

PG_USER="${POSTGRES_USER:-postgres}"
PG_DB="${POSTGRES_DB:-medusa_db}"
PG_HOST="${POSTGRES_HOST:-postgres}"
PG_DUMP_FILE="${BACKUP_DIR}/medusa_db.sql.gz"

log "🐘 Dumping database '${PG_DB}'..."

if PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump -h "$PG_HOST" -U "$PG_USER" -d "$PG_DB" --no-owner --no-acl 2>/dev/null | gzip > "$PG_DUMP_FILE"; then
    SIZE=$(du -sh "$PG_DUMP_FILE" | cut -f1)
    log "✅ PostgreSQL dump complete (${SIZE})"
    ((PASSED++))
else
    log "❌ PostgreSQL dump FAILED"
    rm -f "$PG_DUMP_FILE"
    ((FAILED++))
fi

# ─── Step 2: Strapi CMS SQLite Database ─────────────────────────────────────

log "━━━ [2/4] Strapi CMS SQLite Database ━━━"

CMS_DB_SOURCE="/cms-data/data.db"
CMS_DB_FILE="${BACKUP_DIR}/cms_sqlite.db"

if [ -f "$CMS_DB_SOURCE" ]; then
    log "📦 Copying Strapi SQLite database..."
    if cp "$CMS_DB_SOURCE" "$CMS_DB_FILE" 2>/dev/null; then
        SIZE=$(du -sh "$CMS_DB_FILE" | cut -f1)
        log "✅ Strapi SQLite backup complete (${SIZE})"
        ((PASSED++))
    else
        log "❌ Strapi SQLite copy FAILED"
        ((FAILED++))
    fi
else
    log "⚠️  Strapi SQLite not found at ${CMS_DB_SOURCE} — skipping"
    ((SKIPPED++))
fi

# ─── Step 3: CMS Uploads ────────────────────────────────────────────────────

log "━━━ [3/4] CMS Uploads ━━━"

CMS_UPLOADS_DIR="/cms-uploads"
CMS_UPLOADS_ARCHIVE="${BACKUP_DIR}/cms_uploads.tar.gz"

if [ -d "$CMS_UPLOADS_DIR" ] && [ "$(ls -A "$CMS_UPLOADS_DIR" 2>/dev/null)" ]; then
    FILE_COUNT=$(find "$CMS_UPLOADS_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')
    log "📸 Archiving CMS uploads (${FILE_COUNT} files)..."
    if tar -czf "$CMS_UPLOADS_ARCHIVE" -C "$CMS_UPLOADS_DIR" . 2>/dev/null; then
        SIZE=$(du -sh "$CMS_UPLOADS_ARCHIVE" | cut -f1)
        log "✅ CMS uploads archived (${SIZE})"
        ((PASSED++))
    else
        log "❌ CMS uploads archive FAILED"
        ((FAILED++))
    fi
else
    log "⚠️  No CMS uploads found — skipping"
    ((SKIPPED++))
fi

# ─── Step 4: Backend Static Files ───────────────────────────────────────────

log "━━━ [4/4] Backend Static Files ━━━"

BACKEND_STATIC_DIR="/backend-static"
BACKEND_STATIC_ARCHIVE="${BACKUP_DIR}/backend_static.tar.gz"

if [ -d "$BACKEND_STATIC_DIR" ] && [ "$(ls -A "$BACKEND_STATIC_DIR" 2>/dev/null)" ]; then
    FILE_COUNT=$(find "$BACKEND_STATIC_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')
    log "📂 Archiving backend static files (${FILE_COUNT} files)..."
    if tar -czf "$BACKEND_STATIC_ARCHIVE" -C "$BACKEND_STATIC_DIR" . 2>/dev/null; then
        SIZE=$(du -sh "$BACKEND_STATIC_ARCHIVE" | cut -f1)
        log "✅ Backend static files archived (${SIZE})"
        ((PASSED++))
    else
        log "❌ Backend static archive FAILED"
        ((FAILED++))
    fi
else
    log "⚠️  No backend static files found — skipping"
    ((SKIPPED++))
fi

# ─── Cleanup: Delete backups older than 15 days ─────────────────────────────

log "━━━ Retention Cleanup (>${RETENTION_DAYS} days) ━━━"

DELETED_COUNT=0
NOW_EPOCH=$(date +%s)

for dir in "${BACKUP_ROOT}"/????-??-??/; do
    [ -d "$dir" ] || continue
    dir_name=$(basename "$dir")

    # Calculate age (cross-platform)
    if date -d "$dir_name" +%s &>/dev/null; then
        dir_epoch=$(date -d "$dir_name" +%s)
    else
        dir_epoch=$(date -j -f "%Y-%m-%d" "$dir_name" +%s 2>/dev/null || continue)
    fi

    age_days=$(( (NOW_EPOCH - dir_epoch) / 86400 ))

    if [ "$age_days" -gt "$RETENTION_DAYS" ]; then
        rm -rf "$dir"
        log "🗑️  Deleted old backup: ${dir_name} (${age_days} days old)"
        ((DELETED_COUNT++))
    fi
done

if [ "$DELETED_COUNT" -eq 0 ]; then
    log "✨ No old backups to clean up"
else
    log "🗑️  Cleaned up ${DELETED_COUNT} old backup(s)"
fi

# ─── Manifest ────────────────────────────────────────────────────────────────

cat > "${BACKUP_DIR}/manifest.json" <<EOF
{
  "backup_date": "${DATE}",
  "backup_time": "${TIME}",
  "retention_days": ${RETENTION_DAYS},
  "project": "the-blissful-soul",
  "files": {
    "postgres_dump": "$([ -f "$PG_DUMP_FILE" ] && echo "medusa_db.sql.gz" || echo "null")",
    "cms_sqlite": "$([ -f "$CMS_DB_FILE" ] && echo "cms_sqlite.db" || echo "null")",
    "cms_uploads": "$([ -f "$CMS_UPLOADS_ARCHIVE" ] && echo "cms_uploads.tar.gz" || echo "null")",
    "backend_static": "$([ -f "$BACKEND_STATIC_ARCHIVE" ] && echo "backend_static.tar.gz" || echo "null")"
  },
  "results": { "passed": ${PASSED}, "failed": ${FAILED}, "skipped": ${SKIPPED} }
}
EOF

# ─── Summary ────────────────────────────────────────────────────────────────

TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
BACKUP_COUNT=$(find "$BACKUP_ROOT" -maxdepth 1 -type d -name '????-??-??' 2>/dev/null | wc -l | tr -d ' ')

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "📊 Backup Size: ${TOTAL_SIZE}"
log "📊 Results: ✅ ${PASSED} passed | ❌ ${FAILED} failed | ⚠️  ${SKIPPED} skipped"
log "📊 Total backups stored: ${BACKUP_COUNT}"

if [ "$FAILED" -gt 0 ]; then
    log "🔴 Backup completed with errors!"
    exit 1
else
    log "🟢 Backup completed successfully!"
    exit 0
fi

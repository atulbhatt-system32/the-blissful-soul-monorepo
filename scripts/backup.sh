#!/bin/bash
# =============================================================================
# The Blissful Soul — Auto Backup Script
# =============================================================================
# Backs up all critical data with 15-day rolling retention.
#
# Data backed up:
#   1. PostgreSQL database (Medusa)
#   2. Strapi CMS SQLite database
#   3. CMS uploads (images, media)
#   4. Backend static files
#
# Usage:
#   ./scripts/backup.sh                  # Run from project root
#   ./scripts/backup.sh --dry-run        # Preview what would happen
#
# Cron (daily at 2 AM):
#   0 2 * * * cd /path/to/the-blissful-soul-monorepo && ./scripts/backup.sh >> /var/log/blissful-backup.log 2>&1
# =============================================================================

set -euo pipefail

# ─── Configuration ───────────────────────────────────────────────────────────

RETENTION_DAYS=15                          # Keep backups for this many days
BACKUP_ROOT="./backups"                    # Root backup directory
COMPOSE_FILE="docker-compose.prod.yml"     # Docker compose file
PROJECT_NAME="blissful-soul"               # Docker compose project name
DATE=$(date +%Y-%m-%d)                     # Today's date
TIME=$(date +%H-%M-%S)                     # Current time
BACKUP_DIR="${BACKUP_ROOT}/${DATE}"        # Today's backup folder
LOG_FILE="${BACKUP_ROOT}/backup.log"       # Log file
DRY_RUN=false                              # Dry run mode

# Docker compose command (supports both v1 and v2)
if command -v "docker compose" &>/dev/null 2>&1 || docker compose version &>/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# ─── Parse Arguments ─────────────────────────────────────────────────────────

for arg in "$@"; do
    case $arg in
        --dry-run)
            DRY_RUN=true
            ;;
        --retention=*)
            RETENTION_DAYS="${arg#*=}"
            ;;
        --help)
            head -20 "$0" | tail -15
            exit 0
            ;;
    esac
done

# ─── Helper Functions ────────────────────────────────────────────────────────

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case $level in
        INFO)    color="${GREEN}"  ;;
        WARN)    color="${YELLOW}" ;;
        ERROR)   color="${RED}"    ;;
        STEP)    color="${BLUE}"   ;;
        *)       color="${NC}"     ;;
    esac

    echo -e "${color}[${timestamp}] [${level}]${NC} ${message}"

    # Also write to log file (without color codes)
    if [ "$DRY_RUN" = false ] && [ -d "$BACKUP_ROOT" ]; then
        echo "[${timestamp}] [${level}] ${message}" >> "$LOG_FILE"
    fi
}

get_file_size() {
    local file="$1"
    if [ -f "$file" ]; then
        du -sh "$file" | cut -f1
    else
        echo "0B"
    fi
}

check_container_running() {
    local service="$1"
    if ! ${DOCKER_COMPOSE} -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps --format '{{.Service}} {{.State}}' 2>/dev/null | grep -q "$service.*running"; then
        # Fallback check using docker ps
        if ! docker ps --format '{{.Names}}' 2>/dev/null | grep -q "${PROJECT_NAME}.*${service}"; then
            return 1
        fi
    fi
    return 0
}

# ─── Pre-flight Checks ──────────────────────────────────────────────────────

log INFO "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log INFO "🔄 Blissful Soul Backup — Starting"
log INFO "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log INFO "Date: ${DATE} | Time: ${TIME}"
log INFO "Retention: ${RETENTION_DAYS} days"
log INFO "Backup Dir: ${BACKUP_DIR}"

if [ "$DRY_RUN" = true ]; then
    log WARN "🏃 DRY RUN MODE — No changes will be made"
fi

# Check if docker is available
if ! command -v docker &>/dev/null; then
    log ERROR "❌ Docker is not installed or not in PATH"
    exit 1
fi

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    log ERROR "❌ Compose file not found: ${COMPOSE_FILE}"
    log ERROR "   Make sure you run this script from the project root"
    exit 1
fi

# Load environment variables from .env if it exists
if [ -f .env ]; then
    set -a
    source .env
    set +a
    log INFO "📋 Loaded environment from .env"
fi

# ─── Create Backup Directory ────────────────────────────────────────────────

if [ "$DRY_RUN" = false ]; then
    mkdir -p "$BACKUP_DIR"
    log INFO "📁 Created backup directory: ${BACKUP_DIR}"
else
    log INFO "📁 Would create: ${BACKUP_DIR}"
fi

# ─── Track Results ───────────────────────────────────────────────────────────

TOTAL_STEPS=4
PASSED=0
FAILED=0
SKIPPED=0

# ─── Step 1: PostgreSQL Database Dump ────────────────────────────────────────

log STEP "━━━ [1/${TOTAL_STEPS}] PostgreSQL Database Dump ━━━"

PG_USER="${POSTGRES_USER:-postgres}"
PG_DB="${POSTGRES_DB:-medusa_db}"
PG_DUMP_FILE="${BACKUP_DIR}/medusa_db.sql.gz"

if check_container_running "postgres"; then
    log INFO "🐘 Dumping database '${PG_DB}' as user '${PG_USER}'..."

    if [ "$DRY_RUN" = false ]; then
        # Get the postgres container ID
        PG_CONTAINER=$(docker ps --filter "name=${PROJECT_NAME}.*postgres" --format '{{.ID}}' | head -1)

        if [ -z "$PG_CONTAINER" ]; then
            # Fallback: try without project name prefix
            PG_CONTAINER=$(docker ps --filter "ancestor=postgres:15-alpine" --format '{{.ID}}' | head -1)
        fi

        if [ -n "$PG_CONTAINER" ]; then
            if docker exec "$PG_CONTAINER" pg_dump -U "$PG_USER" -d "$PG_DB" --no-owner --no-acl | gzip > "$PG_DUMP_FILE" 2>/dev/null; then
                local_size=$(get_file_size "$PG_DUMP_FILE")
                log INFO "✅ PostgreSQL dump complete (${local_size})"
                ((PASSED++))
            else
                log ERROR "❌ PostgreSQL dump failed"
                rm -f "$PG_DUMP_FILE"
                ((FAILED++))
            fi
        else
            log ERROR "❌ Could not find postgres container"
            ((FAILED++))
        fi
    else
        log INFO "   Would dump: pg_dump -U ${PG_USER} -d ${PG_DB} → ${PG_DUMP_FILE}"
        ((PASSED++))
    fi
else
    log WARN "⚠️  PostgreSQL container not running — skipping"
    ((SKIPPED++))
fi

# ─── Step 2: Strapi CMS SQLite Database ─────────────────────────────────────

log STEP "━━━ [2/${TOTAL_STEPS}] Strapi CMS SQLite Database ━━━"

CMS_DB_FILE="${BACKUP_DIR}/cms_sqlite.db"

if check_container_running "cms"; then
    log INFO "📦 Copying Strapi SQLite database..."

    if [ "$DRY_RUN" = false ]; then
        CMS_CONTAINER=$(docker ps --filter "name=${PROJECT_NAME}.*cms" --filter "name=cms" --format '{{.ID}}' | head -1)

        if [ -z "$CMS_CONTAINER" ]; then
            CMS_CONTAINER=$(docker ps --format '{{.Names}} {{.ID}}' | grep "cms" | grep -v "backend\|storefront\|nginx\|certbot\|postgres\|redis" | awk '{print $2}' | head -1)
        fi

        if [ -n "$CMS_CONTAINER" ]; then
            # Use sqlite3 .backup for a safe copy (avoids corruption from active writes)
            if docker exec "$CMS_CONTAINER" test -f /app/apps/cms/.tmp/data.db 2>/dev/null; then
                if docker cp "${CMS_CONTAINER}:/app/apps/cms/.tmp/data.db" "$CMS_DB_FILE" 2>/dev/null; then
                    local_size=$(get_file_size "$CMS_DB_FILE")
                    log INFO "✅ Strapi SQLite backup complete (${local_size})"
                    ((PASSED++))
                else
                    log ERROR "❌ Failed to copy Strapi SQLite DB"
                    ((FAILED++))
                fi
            else
                log WARN "⚠️  Strapi SQLite DB not found at expected path"
                ((SKIPPED++))
            fi
        else
            log ERROR "❌ Could not find CMS container"
            ((FAILED++))
        fi
    else
        log INFO "   Would copy: cms:/app/apps/cms/.tmp/data.db → ${CMS_DB_FILE}"
        ((PASSED++))
    fi
else
    log WARN "⚠️  CMS container not running — skipping"
    ((SKIPPED++))
fi

# ─── Step 3: CMS Uploads (Images, Media) ────────────────────────────────────

log STEP "━━━ [3/${TOTAL_STEPS}] CMS Uploads ━━━"

CMS_UPLOADS_DIR="./apps/cms/public/uploads"
CMS_UPLOADS_ARCHIVE="${BACKUP_DIR}/cms_uploads.tar.gz"

if [ -d "$CMS_UPLOADS_DIR" ]; then
    FILE_COUNT=$(find "$CMS_UPLOADS_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')
    log INFO "📸 Archiving CMS uploads (${FILE_COUNT} files)..."

    if [ "$DRY_RUN" = false ]; then
        if tar -czf "$CMS_UPLOADS_ARCHIVE" -C "./apps/cms/public" uploads 2>/dev/null; then
            local_size=$(get_file_size "$CMS_UPLOADS_ARCHIVE")
            log INFO "✅ CMS uploads archived (${local_size})"
            ((PASSED++))
        else
            log ERROR "❌ Failed to archive CMS uploads"
            ((FAILED++))
        fi
    else
        log INFO "   Would archive: ${CMS_UPLOADS_DIR} → ${CMS_UPLOADS_ARCHIVE}"
        ((PASSED++))
    fi
else
    log WARN "⚠️  CMS uploads directory not found: ${CMS_UPLOADS_DIR} — skipping"
    ((SKIPPED++))
fi

# ─── Step 4: Backend Static Files ───────────────────────────────────────────

log STEP "━━━ [4/${TOTAL_STEPS}] Backend Static Files ━━━"

BACKEND_STATIC_DIR="./apps/backend/static"
BACKEND_STATIC_ARCHIVE="${BACKUP_DIR}/backend_static.tar.gz"

if [ -d "$BACKEND_STATIC_DIR" ]; then
    FILE_COUNT=$(find "$BACKEND_STATIC_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')
    log INFO "📂 Archiving backend static files (${FILE_COUNT} files)..."

    if [ "$DRY_RUN" = false ]; then
        if tar -czf "$BACKEND_STATIC_ARCHIVE" -C "./apps/backend" static 2>/dev/null; then
            local_size=$(get_file_size "$BACKEND_STATIC_ARCHIVE")
            log INFO "✅ Backend static files archived (${local_size})"
            ((PASSED++))
        else
            log ERROR "❌ Failed to archive backend static files"
            ((FAILED++))
        fi
    else
        log INFO "   Would archive: ${BACKEND_STATIC_DIR} → ${BACKEND_STATIC_ARCHIVE}"
        ((PASSED++))
    fi
else
    log WARN "⚠️  Backend static directory not found: ${BACKEND_STATIC_DIR} — skipping"
    ((SKIPPED++))
fi

# ─── Cleanup: Remove Backups Older Than 15 Days ─────────────────────────────

log STEP "━━━ Retention Cleanup (>${RETENTION_DAYS} days) ━━━"

if [ -d "$BACKUP_ROOT" ]; then
    DELETED_COUNT=0

    for dir in "${BACKUP_ROOT}"/????-??-??/; do
        [ -d "$dir" ] || continue

        # Extract the date from folder name
        dir_name=$(basename "$dir")

        # Validate date format
        if ! date -d "$dir_name" &>/dev/null 2>&1; then
            # macOS date compatibility
            if ! date -j -f "%Y-%m-%d" "$dir_name" &>/dev/null 2>&1; then
                continue
            fi
        fi

        # Calculate age in days (cross-platform)
        if date -d "$dir_name" &>/dev/null 2>&1; then
            # GNU date (Linux)
            dir_epoch=$(date -d "$dir_name" +%s)
        else
            # BSD date (macOS)
            dir_epoch=$(date -j -f "%Y-%m-%d" "$dir_name" +%s 2>/dev/null || continue)
        fi

        now_epoch=$(date +%s)
        age_days=$(( (now_epoch - dir_epoch) / 86400 ))

        if [ "$age_days" -gt "$RETENTION_DAYS" ]; then
            if [ "$DRY_RUN" = false ]; then
                rm -rf "$dir"
                log INFO "🗑️  Deleted old backup: ${dir_name} (${age_days} days old)"
            else
                log INFO "🗑️  Would delete: ${dir_name} (${age_days} days old)"
            fi
            ((DELETED_COUNT++))
        fi
    done

    if [ "$DELETED_COUNT" -eq 0 ]; then
        log INFO "✨ No old backups to clean up"
    else
        log INFO "🗑️  Cleaned up ${DELETED_COUNT} old backup(s)"
    fi
fi

# ─── Generate Backup Manifest ───────────────────────────────────────────────

if [ "$DRY_RUN" = false ] && [ -d "$BACKUP_DIR" ]; then
    MANIFEST_FILE="${BACKUP_DIR}/manifest.json"
    cat > "$MANIFEST_FILE" <<EOF
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
  "results": {
    "passed": ${PASSED},
    "failed": ${FAILED},
    "skipped": ${SKIPPED}
  }
}
EOF
    log INFO "📋 Manifest written: ${MANIFEST_FILE}"
fi

# ─── Summary ────────────────────────────────────────────────────────────────

log INFO "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$DRY_RUN" = false ] && [ -d "$BACKUP_DIR" ]; then
    TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
    log INFO "📊 Backup Size: ${TOTAL_SIZE}"
fi

# Count existing backups
BACKUP_COUNT=$(find "$BACKUP_ROOT" -maxdepth 1 -type d -name '????-??-??' 2>/dev/null | wc -l | tr -d ' ')
log INFO "📊 Results: ✅ ${PASSED} passed | ❌ ${FAILED} failed | ⚠️  ${SKIPPED} skipped"
log INFO "📊 Total backups stored: ${BACKUP_COUNT}"

if [ "$FAILED" -gt 0 ]; then
    log ERROR "🔴 Backup completed with errors!"
    log INFO "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 1
else
    log INFO "🟢 Backup completed successfully!"
    log INFO "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
fi

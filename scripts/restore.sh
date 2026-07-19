#!/bin/bash
# =============================================================================
# The Blissful Soul — Restore Script
# =============================================================================
# Restores data from a specific backup date.
#
# Usage:
#   ./scripts/restore.sh 2026-07-19                    # Restore everything from this date
#   ./scripts/restore.sh 2026-07-19 --only=postgres    # Restore only PostgreSQL
#   ./scripts/restore.sh 2026-07-19 --only=cms-db      # Restore only Strapi SQLite
#   ./scripts/restore.sh 2026-07-19 --only=cms-uploads # Restore only CMS uploads
#   ./scripts/restore.sh 2026-07-19 --only=static      # Restore only backend static
#   ./scripts/restore.sh --list                         # List available backups
#
# ⚠️  WARNING: This will OVERWRITE current data. Make sure you know what you're doing!
# =============================================================================

set -euo pipefail

# ─── Configuration ───────────────────────────────────────────────────────────

BACKUP_ROOT="./backups"
COMPOSE_FILE="docker-compose.prod.yml"
PROJECT_NAME="blissful-soul"
RESTORE_TARGET=""
ONLY=""

# Docker compose command
if docker compose version &>/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ─── Parse Arguments ─────────────────────────────────────────────────────────

for arg in "$@"; do
    case $arg in
        --list)
            echo -e "${BLUE}📋 Available backups:${NC}"
            echo ""
            if [ -d "$BACKUP_ROOT" ]; then
                for dir in "${BACKUP_ROOT}"/????-??-??/; do
                    [ -d "$dir" ] || continue
                    dir_name=$(basename "$dir")
                    dir_size=$(du -sh "$dir" 2>/dev/null | cut -f1)

                    # Check what's in the backup
                    contents=""
                    [ -f "${dir}medusa_db.sql.gz" ] && contents="${contents} 🐘 PostgreSQL"
                    [ -f "${dir}cms_sqlite.db" ] && contents="${contents} 📦 CMS-DB"
                    [ -f "${dir}cms_uploads.tar.gz" ] && contents="${contents} 📸 Uploads"
                    [ -f "${dir}backend_static.tar.gz" ] && contents="${contents} 📂 Static"

                    echo -e "  ${GREEN}${dir_name}${NC} (${dir_size}) →${contents}"
                done
            else
                echo -e "  ${RED}No backups found${NC}"
            fi
            echo ""
            exit 0
            ;;
        --only=*)
            ONLY="${arg#*=}"
            ;;
        --help)
            head -14 "$0" | tail -11
            exit 0
            ;;
        *)
            if [[ "$arg" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
                RESTORE_TARGET="$arg"
            fi
            ;;
    esac
done

# ─── Validate ────────────────────────────────────────────────────────────────

if [ -z "$RESTORE_TARGET" ]; then
    echo -e "${RED}❌ Please specify a backup date to restore.${NC}"
    echo ""
    echo "Usage: $0 <YYYY-MM-DD> [--only=postgres|cms-db|cms-uploads|static]"
    echo "       $0 --list"
    exit 1
fi

BACKUP_DIR="${BACKUP_ROOT}/${RESTORE_TARGET}"

if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}❌ Backup not found: ${BACKUP_DIR}${NC}"
    echo ""
    echo "Run '$0 --list' to see available backups."
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# ─── Confirmation ────────────────────────────────────────────────────────────

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}⚠️  WARNING: This will OVERWRITE current production data!${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Restoring from: ${GREEN}${RESTORE_TARGET}${NC}"
if [ -n "$ONLY" ]; then
    echo -e "Restoring only: ${BLUE}${ONLY}${NC}"
else
    echo -e "Restoring: ${BLUE}ALL data${NC}"
fi
echo ""
read -rp "Type 'RESTORE' to confirm: " confirmation

if [ "$confirmation" != "RESTORE" ]; then
    echo -e "${RED}❌ Restore cancelled.${NC}"
    exit 1
fi

echo ""

# ─── Restore Functions ──────────────────────────────────────────────────────

restore_postgres() {
    local dump_file="${BACKUP_DIR}/medusa_db.sql.gz"

    if [ ! -f "$dump_file" ]; then
        echo -e "${YELLOW}⚠️  No PostgreSQL dump found in this backup — skipping${NC}"
        return
    fi

    echo -e "${BLUE}🐘 Restoring PostgreSQL database...${NC}"

    PG_USER="${POSTGRES_USER:-postgres}"
    PG_DB="${POSTGRES_DB:-medusa_db}"
    PG_CONTAINER=$(docker ps --filter "name=${PROJECT_NAME}.*postgres" --format '{{.ID}}' | head -1)

    if [ -z "$PG_CONTAINER" ]; then
        PG_CONTAINER=$(docker ps --filter "ancestor=postgres:15-alpine" --format '{{.ID}}' | head -1)
    fi

    if [ -z "$PG_CONTAINER" ]; then
        echo -e "${RED}❌ PostgreSQL container not running${NC}"
        return 1
    fi

    # Drop and recreate the database
    echo "   Dropping existing database..."
    docker exec "$PG_CONTAINER" psql -U "$PG_USER" -c "DROP DATABASE IF EXISTS ${PG_DB};" postgres 2>/dev/null || true
    docker exec "$PG_CONTAINER" psql -U "$PG_USER" -c "CREATE DATABASE ${PG_DB};" postgres 2>/dev/null

    # Restore the dump
    echo "   Restoring from dump..."
    gunzip -c "$dump_file" | docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" --quiet 2>/dev/null

    echo -e "${GREEN}✅ PostgreSQL restored successfully${NC}"
}

restore_cms_db() {
    local db_file="${BACKUP_DIR}/cms_sqlite.db"

    if [ ! -f "$db_file" ]; then
        echo -e "${YELLOW}⚠️  No Strapi SQLite backup found — skipping${NC}"
        return
    fi

    echo -e "${BLUE}📦 Restoring Strapi SQLite database...${NC}"

    CMS_CONTAINER=$(docker ps --format '{{.Names}} {{.ID}}' | grep "cms" | grep -v "backend\|storefront\|nginx\|certbot\|postgres\|redis" | awk '{print $2}' | head -1)

    if [ -z "$CMS_CONTAINER" ]; then
        echo -e "${RED}❌ CMS container not running${NC}"
        return 1
    fi

    docker cp "$db_file" "${CMS_CONTAINER}:/app/apps/cms/.tmp/data.db"

    echo -e "${GREEN}✅ Strapi SQLite restored. Restart CMS container to apply:${NC}"
    echo -e "   ${DOCKER_COMPOSE} -f ${COMPOSE_FILE} -p ${PROJECT_NAME} restart cms"
}

restore_cms_uploads() {
    local archive="${BACKUP_DIR}/cms_uploads.tar.gz"

    if [ ! -f "$archive" ]; then
        echo -e "${YELLOW}⚠️  No CMS uploads archive found — skipping${NC}"
        return
    fi

    echo -e "${BLUE}📸 Restoring CMS uploads...${NC}"

    # Clear existing uploads and extract
    rm -rf ./apps/cms/public/uploads
    mkdir -p ./apps/cms/public
    tar -xzf "$archive" -C ./apps/cms/public

    FILE_COUNT=$(find ./apps/cms/public/uploads -type f 2>/dev/null | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ CMS uploads restored (${FILE_COUNT} files)${NC}"
}

restore_static() {
    local archive="${BACKUP_DIR}/backend_static.tar.gz"

    if [ ! -f "$archive" ]; then
        echo -e "${YELLOW}⚠️  No backend static archive found — skipping${NC}"
        return
    fi

    echo -e "${BLUE}📂 Restoring backend static files...${NC}"

    rm -rf ./apps/backend/static
    mkdir -p ./apps/backend
    tar -xzf "$archive" -C ./apps/backend

    FILE_COUNT=$(find ./apps/backend/static -type f 2>/dev/null | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ Backend static files restored (${FILE_COUNT} files)${NC}"
}

# ─── Execute Restore ────────────────────────────────────────────────────────

case "$ONLY" in
    postgres)
        restore_postgres
        ;;
    cms-db)
        restore_cms_db
        ;;
    cms-uploads)
        restore_cms_uploads
        ;;
    static)
        restore_static
        ;;
    "")
        # Restore everything
        restore_postgres
        echo ""
        restore_cms_db
        echo ""
        restore_cms_uploads
        echo ""
        restore_static
        ;;
    *)
        echo -e "${RED}❌ Unknown restore target: ${ONLY}${NC}"
        echo "   Valid options: postgres, cms-db, cms-uploads, static"
        exit 1
        ;;
esac

# ─── Done ────────────────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🟢 Restore from ${RESTORE_TARGET} complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}💡 Tip: You may need to restart your services:${NC}"
echo -e "   ${DOCKER_COMPOSE} -f ${COMPOSE_FILE} -p ${PROJECT_NAME} restart"

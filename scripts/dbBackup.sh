#!/bin/bash

# ==============================================================================
# NEXUSCOMMERCE MONGODB DOCKER AUTO-BACKUP CRON PIPELINE
# ==============================================================================
# Description: Automatically executes mongodump inside the active MongoDB container,
#              compresses the database schemas, and prunes archives older than 14 days.
#
# CRON REGISTRATION GUIDE:
# 1. Make this script executable on your Linux VPS:
#    chmod +x /var/www/nexuscommerce/scripts/dbBackup.sh
# 2. Open VPS system crontab configurations:
#    crontab -e
# 3. Add the following entry to execute the backups daily at midnight:
#    0 0 * * * /var/www/nexuscommerce/scripts/dbBackup.sh >> /var/log/nexus_db_backup.log 2>&1
# ==============================================================================

# Constants
CONTAINER_NAME="nexus-mongodb"
BACKUP_DIR="/var/backups/nexuscommerce"
DB_NAME="nexuscommerce"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/backup_nexuscommerce_${TIMESTAMP}.archive.gz"

# Enforce backup directory presence on host
mkdir -p "${BACKUP_DIR}"

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Starting automated MongoDB backup pipeline..."

# Check if target Mongo container is running
if [ ! "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
    echo "❌ ERROR: Container '${CONTAINER_NAME}' is not running. Backup operation aborted."
    exit 1
fi

# Execute database compression dump
docker exec -t "${CONTAINER_NAME}" mongodump --db "${DB_NAME}" --archive --gzip > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo "✅ SUCCESS: Database compression backup completed safely: ${BACKUP_FILE}"
else
    echo "❌ ERROR: Database backup operation failed."
    exit 1
fi

# Auto-pruning retention loop: purge archive packages older than 14 days
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Scanning retention limits for files older than 14 days..."
find "${BACKUP_DIR}" -name "backup_nexuscommerce_*.archive.gz" -mtime +14 -type f -delete -print | while read -r deleted_file; do
    echo "🧹 Pruned expired backup: ${deleted_file}"
done

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Database backup pipeline session ended successfully."

#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
LINE=$(grep localhost ~/.pgpass | head -1)
PG_USER=$(echo $LINE | awk -F: '{print $4}') \
PG_PASSWORD=$(echo $LINE | awk -F: '{print $5}') \
PG_DATABASE=$(echo $LINE | awk -F: '{print $3}') \
PG_HOST=localhost \
PG_PORT=5432 \
LOG_LEVEL=info \
node $SCRIPT_DIR/dist/$1.js
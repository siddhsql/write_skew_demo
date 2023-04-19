#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
MYSQL_USER=root \
MYSQL_PASSWORD=GbjMg+s+K9E= \
MYSQL_DATABASE=test \
MYSQL_HOST=localhost \
MYSQL_PORT=13306 \
LOG_LEVEL=info \
node $SCRIPT_DIR/dist/$1.js
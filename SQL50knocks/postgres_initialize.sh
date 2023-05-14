#!/bin/bash
set -eu

docker compose down
docker compose up -d

echo "#================"
echo "# login postgres"
echo "#================"

sleep 5

while !(docker compose exec db psql -U postgres -h localhost -p 5432)
do
  echo "wait PostgreSQL server..."
  docker compose ps
  sleep 5
done

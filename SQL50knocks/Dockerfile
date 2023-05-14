FROM postgres:15.1

RUN apt-get update && \
  apt-get install -y wget unzip && \
  wget https://github.com/devrimgunduz/pagila/archive/refs/tags/pagila-v3.0.0.zip -O /tmp/pagila.zip && \
  unzip /tmp/pagila.zip -d /tmp && \
  rm /tmp/pagila.zip

RUN cp /tmp/pagila-pagila-v3.0.0/pagila-schema.sql /docker-entrypoint-initdb.d/01_pagila-schema.sql && \
  cp /tmp/pagila-pagila-v3.0.0/pagila-data.sql /docker-entrypoint-initdb.d/02_pagila-data.sql

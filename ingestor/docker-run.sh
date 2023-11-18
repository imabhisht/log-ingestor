#!/bin/bash
docker build -t ingestor-raw-build .
docker run -p 3000:3000 -d --rm --name ingestor-standalone ingestor-raw-build


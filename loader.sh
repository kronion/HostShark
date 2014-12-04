#!/bin/bash
node app.js &
source hostshark.sh
trap "kill -- -$$" SIGINT SIGTERM EXIT

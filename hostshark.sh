#!/bin/bash
tshark='/Applications/Wireshark.app/Contents/Resources/bin/tshark'
exec $tshark -lIY "tcp.port==443 or http.request" -T fields -E separator="|" -e ip.dst -e http.host 2> /dev/null | python process.py

import json
from socketIO_client import SocketIO
import sys
import time
import urllib2

ips = {}
hosts = {}

with SocketIO('localhost', 7717) as socketIO:
    try:
        buff = ''
        while True:
            buff += sys.stdin.read(1)
            if buff.endswith('\n'):
                parts = buff[:-1].split('|')
                if (parts[1] is ''):
                    if parts[0] not in ips:
                        # make the API call here
                        data = json.load(urllib2.urlopen('http://stat.ripe.net/data/reverse-dns-ip/data.json?resource=' + parts[0]))
                        if data['data']['result'] is not None:
                            ips[parts[0]] = data['data']['result'][0]
                            socketIO.emit('host', { 'host': data['data']['result'][0] });
                        else:
                            ips[parts[0]] = None
                    else:
                        lookup = ips[parts[0]]
                        if lookup is not None:
                            socketIO.emit('host', { 'host': lookup });
                else:
                    if parts[1] != "stat.ripe.net":
                        socketIO.emit('host', { 'host': parts[1] });
                buff = ''
    except KeyboardInterrupt:
       sys.stdout.flush()
       pass

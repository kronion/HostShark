import json
import sys
import time
import urllib2

ips = {}
hosts = {}

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
                        # print data['data']['result'][0]
                    else:
                        ips[parts[0]] = None
                else:
                    lookup = ips[parts[0]]
                    if lookup is not None:
                        print lookup
            else:
                if parts[1] != "stat.ripe.net":
                    print parts[1]
            buff = ''
except KeyboardInterrupt:
   sys.stdout.flush()
   pass

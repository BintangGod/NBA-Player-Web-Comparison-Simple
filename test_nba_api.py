import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://stats.nba.com/stats/playerindex?LeagueID=00&Season=2024-25'
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://www.nba.com/',
    'Origin': 'https://www.nba.com',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive'
})

try:
    resp = urllib.request.urlopen(req, context=ctx, timeout=5)
    data = json.loads(resp.read().decode('utf-8'))
    print("Success! Got players:", len(data['resultSets'][0]['rowSet']))
except Exception as e:
    print("Error:", e)

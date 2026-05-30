import urllib.request, urllib.error
req = urllib.request.Request('https://api.balldontlie.io/v1/players?search=LeBron', headers={'Authorization': '3a6e852d-053e-4a3c-a452-fad24ad45d40'})
try:
    print(urllib.request.urlopen(req).read().decode('utf-8')[:100])
except urllib.error.HTTPError as e:
    print("PLAYERS ENDPOINT:", e.read().decode('utf-8'))

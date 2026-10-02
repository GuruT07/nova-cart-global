import json
import urllib.request
import urllib.parse
import re
import os
import time

# Load products
with open('src/data.json', 'r') as f:
    data = json.load(f)

products = data['products']

os.makedirs('public/products', exist_ok=True)

# Very simple DuckDuckGo Image scraper
def get_image_url(query):
    try:
        url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(query + ' product packaging india bigbasket')
        req = urllib.request.Request(
            url, 
            data=None, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        )
        html = urllib.request.urlopen(req, timeout=5).read().decode('utf-8')
        
        # In DDG HTML version, images are in <img class="z-core-image" src="...">
        # or we can extract external image URLs from the hrefs.
        # Actually a simpler way for DDG HTML is looking for "?u=" in the image links
        links = re.findall(r'vqd=.*?&amp;u=(http.*?)&amp;', html)
        if links:
            return urllib.parse.unquote(links[0])
            
        # fallback to wikimedia or anywhere
        return None
    except Exception as e:
        return None

# We will only fetch the first 24 to save time (the user will see these first)
print("Fetching real product images...")
image_map = {}

for p in products[:24]:
    print(f"Searching for {p['name']}...")
    img_url = get_image_url(p['name'])
    if img_url:
        image_map[p['name']] = img_url
        print(f"Found: {img_url}")
    else:
        print("Failed to find image.")
    time.sleep(0.5)

with open('src/imageMap.json', 'w') as f:
    json.dump(image_map, f, indent=2)

print("Done! Image map saved.")

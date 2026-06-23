import urllib.request
import re
import json
from urllib.parse import urljoin

url = 'https://www.dhibrisk.us/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    css_links = re.findall(r'<link[^>]*rel=[\"\']stylesheet[\"\'][^>]*href=[\"\']([^\"\']+)[\"\']', html)
    
    print('Found CSS Links:')
    css_contents = []
    for link in css_links:
        full_url = urljoin(url, link)
        print("Fetching:", full_url)
        try:
            css_req = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
            css_text = urllib.request.urlopen(css_req).read().decode('utf-8')
            css_contents.append(css_text)
        except Exception as ce:
            print("Failed to fetch", full_url, ce)
            
    # Also grab style blocks
    style_blocks = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL | re.IGNORECASE)
    css_contents.extend(style_blocks)
    
    all_css = '\n'.join(css_contents)
    with open('f:/brisk-dhi/scraped_styles.css', 'w', encoding='utf-8') as f:
        f.write(all_css)
    print(f"Saved {len(all_css)} bytes of CSS to scraped_styles.css")
    
except Exception as e:
    print('Error:', e)

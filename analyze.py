import urllib.request
import re
from collections import Counter
import json

url = 'https://www.dhibrisk.us/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    with open('scraped_html.html', 'w', encoding='utf-8') as f:
        f.write(html)
except Exception as e:
    pass

try:
    with open('scraped_styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # Find common fonts
    fonts = re.findall(r'font-family:\s*([^;\}]+)', css, re.IGNORECASE)
    font_counter = Counter([f.strip().strip('"\'') for f in fonts])
    
    # Colors
    colors = re.findall(r'color:\s*(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|[a-zA-Z]+)\s*[;\}]', css, re.IGNORECASE)
    color_counter = Counter([c.strip().lower() for c in colors if c.strip().lower() not in ['inherit', 'transparent', 'initial']])
    
    bg_colors = re.findall(r'background-color:\s*(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|[a-zA-Z]+)\s*[;\}]', css, re.IGNORECASE)
    bg_counter = Counter([c.strip().lower() for c in bg_colors if c.strip().lower() not in ['inherit', 'transparent', 'initial']])
    
    # Headings sizes
    # We will look for h1, h2, h3 font-size
    h_sizes = {}
    for h in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']:
        match = re.search(h + r'\s*\{[^}]*font-size:\s*([^;\}]+)', css, re.IGNORECASE)
        if match:
            h_sizes[h] = match.group(1).strip()
            
    # Links hover
    hover_effects = re.findall(r'a:hover\s*\{([^}]+)\}', css, re.IGNORECASE)
    
    # Animations
    animations = re.findall(r'animation:\s*([^;\}]+)', css, re.IGNORECASE)
    anim_counter = Counter([a.strip() for a in animations])
    
    # Line height
    lh = re.findall(r'line-height:\s*([^;\}]+)', css, re.IGNORECASE)
    lh_counter = Counter([l.strip() for l in lh])

    # Find straight lines in HTML (hr, borders)
    hr_tags = len(re.findall(r'<hr[^>]*>', html, re.IGNORECASE))
    borders = re.findall(r'border:\s*([^;\}]+)', css, re.IGNORECASE)
    border_counter = Counter([b.strip() for b in borders])

    print("--- FONTS ---")
    print(font_counter.most_common(5))
    print("\n--- COLORS ---")
    print("Text Colors:", color_counter.most_common(5))
    print("Backgrounds:", bg_counter.most_common(5))
    print("\n--- SIZES ---")
    print(h_sizes)
    print("\n--- LINE HEIGHT ---")
    print(lh_counter.most_common(5))
    print("\n--- ANIMATIONS ---")
    print(anim_counter.most_common(5))
    print("\n--- BORDERS/LINES ---")
    print("HR tags:", hr_tags)
    print("Borders:", border_counter.most_common(5))
    print("\n--- LINK HOVER EFFECTS ---")
    print(hover_effects[:5])
    
except Exception as e:
    print('Error:', e)

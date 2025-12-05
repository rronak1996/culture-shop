import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the premium-animations.js script before closing body tag, after main.js
pattern = r'(<script type="module" src="main\.js"></script>)'
replacement = r'\1\n    <script type="module" src="premium-animations.js"></script>'

content = re.sub(pattern, replacement, content)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Premium animations JS linked successfully!")

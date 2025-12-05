import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the premium-enhancements.css link after whatsapp-styles.css
pattern = r'(<link rel="stylesheet" href="/whatsapp-styles.css">)'
replacement = r'\1\n    <link rel="stylesheet" href="/premium-enhancements.css">'

content = re.sub(pattern, replacement, content)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Premium enhancements CSS linked successfully!")

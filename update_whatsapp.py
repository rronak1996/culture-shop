import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the SVG with img tag
pattern = r'<svg viewBox="0 0 32 32".*?</svg>'
replacement = '<img src="/assets/whatsapp-icon.png" alt="WhatsApp" />'

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("WhatsApp icon updated successfully!")

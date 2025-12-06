import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Instagram link
content = content.replace(
    '<a href="#" aria-label="Instagram">IG</a>',
    '<a href="https://www.instagram.com/culture_choco" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">📸 Instagram</a>'
)

# Update WhatsApp footer link
content = content.replace(
    '<a href="#" aria-label="WhatsApp">WA</a>',
    '<a href="https://wa.me/919327735606" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">💬 WhatsApp</a>'
)

# Remove Facebook link
content = content.replace(
    '<a href="#" aria-label="Facebook">FB</a>',
    ''
)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Instagram and WhatsApp links updated successfully!")

import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add review-form.css link
pattern = r'(<link rel="stylesheet" href="/premium-enhancements.css">)'
replacement = r'\1\n    <link rel="stylesheet" href="/review-form.css">'
content = re.sub(pattern, replacement, content)

# Add review-form.js script
pattern = r'(<script type="module" src="premium-animations.js"></script>)'
replacement = r'\1\n    <script type="module" src="review-form.js"></script>'
content = re.sub(pattern, replacement, content)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Review form CSS and JS linked successfully!")

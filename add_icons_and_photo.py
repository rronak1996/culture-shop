import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Instagram link with icon
instagram_link = '''<a href="https://www.instagram.com/culture_choco" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" class="social-link">
                        <img src="/assets/instagram-icon.png" alt="Instagram" class="social-icon">
                        <span>Instagram</span>
                    </a>'''

content = content.replace(
    '<a href="https://www.instagram.com/culture_choco" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">📸 Instagram</a>',
    instagram_link
)

# Add product photo to About section - replace placeholder
about_image_section = '''<div class="about-image-placeholder">
                    <img src="/assets/product-hero.jpg" alt="Culture Handcrafted Chocolates" class="about-product-image">
                </div>'''

content = re.sub(
    r'<div class="about-image-placeholder">.*?</div>',
    about_image_section,
    content,
    flags=re.DOTALL
)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Instagram icon and product photo added successfully!")

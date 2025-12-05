import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Testimonials HTML
testimonials_html = '''
    <!-- Testimonials Section -->
    <section class="testimonials">
        <div class="container">
            <div class="section-header text-center">
                <span class="section-subtitle">Customer Love</span>
                <h2 class="section-title">What Our Customers Say</h2>
                <p class="section-desc">Join thousands of happy chocolate lovers</p>
            </div>

            <div class="testimonials-grid">
                <div class="testimonial-card">
                    <div class="testimonial-rating">
                        ★★★★★
                    </div>
                    <p class="testimonial-text">
                        "Absolutely delicious! The chocolates are so fresh and flavorful. The strawberry ones are my favorite. Will definitely order again!"
                    </p>
                    <div class="testimonial-author">
                        <div class="author-avatar">P</div>
                        <div class="author-info">
                            <div class="author-name">Priya Sharma</div>
                            <div class="author-location">Ahmedabad</div>
                        </div>
                    </div>
                </div>

                <div class="testimonial-card featured">
                    <div class="testimonial-rating">
                        ★★★★★
                    </div>
                    <p class="testimonial-text">
                        "Best homemade chocolates in the city! The quality is outstanding and you can really taste the love that goes into making them. Perfect for gifting!"
                    </p>
                    <div class="testimonial-author">
                        <div class="author-avatar">R</div>
                        <div class="author-info">
                            <div class="author-name">Rahul Patel</div>
                            <div class="author-location">Satellite</div>
                        </div>
                    </div>
                </div>

                <div class="testimonial-card">
                    <div class="testimonial-rating">
                        ★★★★★
                    </div>
                    <p class="testimonial-text">
                        "I ordered for my mom's birthday and she loved them! The packaging was beautiful and the taste was divine. Thank you Culture!"
                    </p>
                    <div class="testimonial-author">
                        <div class="author-avatar">M</div>
                        <div class="author-info">
                            <div class="author-name">Meera Shah</div>
                            <div class="author-location">Ahmedabad</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
'''

# Find the end of about section and insert testimonials before contact
pattern = r'(</section>\s+<!-- Contact Section -->)'
replacement = rf'</section>{testimonials_html}\n\n    <!-- Contact Section -->'

content = re.sub(pattern, replacement, content, count=1, flags=re.DOTALL)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Testimonials section added successfully!")

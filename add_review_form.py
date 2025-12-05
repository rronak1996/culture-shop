import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Review form HTML
review_form_html = '''
    <!-- Add Your Review Section -->
    <section class="add-review-section">
        <div class="container">
            <div class="review-form-wrapper">
                <div class="section-header text-center">
                    <span class="section-subtitle">Share Your Experience</span>
                    <h2 class="section-title">Write a Review</h2>
                    <p class="section-desc">Help others discover our chocolates!</p>
                </div>

                <form class="review-form" id="reviewForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="review-name">Your Name *</label>
                            <input type="text" id="review-name" name="name" required placeholder="Enter your name">
                        </div>
                        <div class="form-group">
                            <label for="review-location">Location</label>
                            <input type="text" id="review-location" name="location" placeholder="e.g., Ahmedabad">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Your Rating *</label>
                        <div class="star-rating" id="starRating">
                            <span class="star" data-rating="1">☆</span>
                            <span class="star" data-rating="2">☆</span>
                            <span class="star" data-rating="3">☆</span>
                            <span class="star" data-rating="4">☆</span>
                            <span class="star" data-rating="5">☆</span>
                        </div>
                        <input type="hidden" id="rating-value" name="rating" required>
                    </div>

                    <div class="form-group">
                        <label for="review-text">Your Review *</label>
                        <textarea id="review-text" name="review" rows="5" required 
                            placeholder="Share your thoughts about our chocolates..."></textarea>
                    </div>

                    <div class="form-group">
                        <label for="review-email">Email (optional)</label>
                        <input type="email" id="review-email" name="email" 
                            placeholder="We'll notify you when your review is published">
                    </div>

                    <div class="review-note">
                        <small>Your review will be published after verification. Thank you for sharing!</small>
                    </div>

                    <button type="submit" class="btn btn-primary full-width" id="submitReviewBtn">
                        <span id="review-btn-text">Submit Review</span>
                        <span id="review-spinner" class="spinner" style="display: none;">⏳</span>
                    </button>

                    <div id="review-success" class="success-message" style="display: none;">
                        ✓ Thank you! Your review has been submitted successfully.
                    </div>
                    <div id="review-error" class="error-message" style="display: none;">
                        ✗ Sorry, something went wrong. Please try again.
                    </div>
                </form>
            </div>
        </div>
    </section>
'''

# Find testimonials section and add review form after it
pattern = r'(</section>\s*<!-- Contact Section -->)'
replacement = rf'</section>{review_form_html}\n\n    <!-- Contact Section -->'

content = re.sub(pattern, replacement, content, count=1, flags=re.DOTALL)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Review form section added successfully!")

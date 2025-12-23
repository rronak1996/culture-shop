// Review Form Functionality

document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const starRating = document.getElementById('starRating');
    const ratingValue = document.getElementById('rating-value');
    const stars = starRating?.querySelectorAll('.star');

    // Star Rating Interaction
    if (stars) {
        stars.forEach((star, index) => {
            // Click to select rating
            star.addEventListener('click', () => {
                const rating = star.getAttribute('data-rating');
                ratingValue.value = rating;

                // Update star display
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.textContent = '★';
                        s.classList.add('selected');
                    } else {
                        s.textContent = '☆';
                        s.classList.remove('selected');
                    }
                });
            });

            // Hover effect
            star.addEventListener('mouseenter', () => {
                const rating = star.getAttribute('data-rating');
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.textContent = '★';
                        s.classList.add('hover');
                    }
                });
            });

            star.addEventListener('mouseleave', () => {
                const currentRating = ratingValue.value;
                stars.forEach((s, i) => {
                    s.classList.remove('hover');
                    if (i < currentRating) {
                        s.textContent = '★';
                    } else {
                        s.textContent = '☆';
                    }
                });
            });
        });
    }

    // Form Submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitReviewBtn');
            const btnText = document.getElementById('review-btn-text');
            const spinner = document.getElementById('review-spinner');
            const successMsg = document.getElementById('review-success');
            const errorMsg = document.getElementById('review-error');

            // Validate rating
            if (!ratingValue.value) {
                alert('Please select a rating!');
                return;
            }

            // Show loading
            btnText.style.display = 'none';
            spinner.style.display = 'inline';
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            // Get form data
            const formData = {
                name: document.getElementById('review-name').value,
                location: document.getElementById('review-location').value || 'Not specified',
                rating: ratingValue.value,
                review: document.getElementById('review-text').value,
                email: document.getElementById('review-email').value || 'Not provided',
                dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            };

            try {
                // Submit to Google Sheets (using your existing Apps Script)
                // You'll need to add a new sheet called "Reviews" in your Google Sheet
                const response = await fetch(GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'submitReview',
                        apiKey: 'culture-secure-2025',
                        ...formData
                    })
                });

                // Show success
                successMsg.style.display = 'block';
                reviewForm.reset();
                ratingValue.value = '';
                stars.forEach(s => {
                    s.textContent = '☆';
                    s.classList.remove('selected');
                });

                // Scroll to success message
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);

            } catch (error) {
                console.error('Review submission error:', error);
                errorMsg.style.display = 'block';

                setTimeout(() => {
                    errorMsg.style.display = 'none';
                }, 5000);
            } finally {
                btnText.style.display = 'inline';
                spinner.style.display = 'none';
            }
        });
    }
});

console.log('Review form loaded!');

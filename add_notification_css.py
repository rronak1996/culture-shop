# Add notification CSS to style.css

notification_css = """

/* === Add to Cart Notification === */
.add-to-cart-notification {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: var(--primary-color);
    color: white;
    padding: 16px 24px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    font-weight: 600;
}

.add-to-cart-notification.show {
    transform: translateY(0);
    opacity: 1;
}

.add-to-cart-notification .notif-icon {
    background-color: var(--accent-gold);
    color: var(--primary-color);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: bold;
}

.add-to-cart-notification .notif-text {
    font-size: 0.95rem;
}
"""

# Append to style.css
with open('style.css', 'a', encoding='utf-8') as f:
    f.write(notification_css)

print("✓ Notification CSS added to style.css")

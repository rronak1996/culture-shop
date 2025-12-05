import"./main-Ct1u9Npn.js";document.addEventListener("DOMContentLoaded",async()=>{async function r(e=50,o=100){for(let n=0;n<e;n++){if(window.auth&&typeof window.auth.getCurrentUser=="function")return!0;await new Promise(t=>setTimeout(t,o))}return!1}if(!await r()){console.error("Auth module failed to load"),alert("Failed to load authentication. Please refresh the page.");return}window.auth.requireAuth();function a(){const e=window.auth.getCurrentUser();if(!e){console.error("No user found in session"),window.location.href="login.html";return}document.getElementById("user-name").textContent=e.name||"N/A",document.getElementById("user-email").textContent=e.email||"N/A",document.getElementById("user-mobile").textContent=e.mobile||"N/A",document.getElementById("user-initial").textContent=e.name?e.name.charAt(0).toUpperCase():"U"}async function d(){const e=document.getElementById("orders-loading"),o=document.getElementById("orders-empty"),n=document.getElementById("orders-list");try{const t=await window.auth.getUserOrders();e.style.display="none",t.success&&t.orders&&t.orders.length>0?(n.style.display="grid",n.innerHTML=t.orders.map(s=>`
                            <div class="order-card">
                                <div class="order-header">
                                    <div>
                                        <h3>${s.orderId}</h3>
                                        <p class="order-date">${s.dateTime}</p>
                                    </div>
                                    <span class="status-badge status-${s.status.toLowerCase()}">${s.status}</span>
                                </div>
                                <div class="order-items">
                                    <p><strong>Items:</strong> ${s.items}</p>
                                </div>
                                <div class="order-footer">
                                    <div class="order-total">
                                        <span>Total:</span>
                                        <strong>₹${s.total}</strong>
                                    </div>
                                    <div class="order-details">
                                        <p><strong>Payment:</strong> ${s.paymentMethod}</p>
                                        <p><strong>Delivery:</strong> ${s.deliveryTime}</p>
                                    </div>
                                </div>
                            </div>
                        `).join("")):o.style.display="flex"}catch(t){console.error("Error loading orders:",t),e.style.display="none",o.style.display="flex"}}a(),await d()});

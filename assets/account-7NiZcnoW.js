import"./auth-DofNTN9U.js";document.addEventListener("DOMContentLoaded",async()=>{async function a(e=50,s=100){for(let n=0;n<e;n++){if(window.auth&&typeof window.auth.getCurrentUser=="function")return!0;await new Promise(r=>setTimeout(r,s))}return!1}if(!await a()){console.error("Auth module failed to load"),alert("Failed to load authentication. Please refresh the page.");return}window.auth.requireAuth();function i(){const e=window.auth.getCurrentUser();return!e||!e.email?(console.error("No user found in session or invalid session data"),alert("Your session has expired. Please log in again."),window.location.href="login.html",!1):(console.log("Loading profile for user:",e.email),document.getElementById("user-name").textContent=e.name||"N/A",document.getElementById("user-email").textContent=e.email||"N/A",document.getElementById("user-mobile").textContent=e.mobile||"N/A",document.getElementById("user-initial").textContent=e.name?e.name.charAt(0).toUpperCase():"U",!0)}async function l(){const e=document.getElementById("orders-loading"),s=document.getElementById("orders-empty"),n=document.getElementById("orders-list"),r=setTimeout(()=>{e.style.display!=="none"&&(e.innerHTML=`
                    <p>⚠️ Loading is taking longer than expected...</p>
                    <p style="font-size: 0.9em; color: #666;">This may be due to slow network or backend issues.</p>
                    <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 10px;">Retry</button>
                `)},1e4);try{console.log("Fetching user orders...");const t=await window.auth.getUserOrders();clearTimeout(r),console.log("Orders API response:",t),e.style.display="none",t.success&&t.orders&&t.orders.length>0?(console.log(`Displaying ${t.orders.length} orders`),n.style.display="grid",n.innerHTML=t.orders.map(o=>`
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <h3>${o.orderId}</h3>
                                <p class="order-date">${o.dateTime}</p>
                            </div>
                            <span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span>
                        </div>
                        <div class="order-items">
                            <p><strong>Items:</strong> ${o.items}</p>
                        </div>
                        ${o.verificationCode?`
                        <div class="order-verification">
                            <span class="verification-label">🔐 Delivery Code:</span>
                            <span class="verification-code">${o.verificationCode}</span>
                        </div>
                        `:""}
                        <div class="order-footer">
                            <div class="order-total">
                                <span>Total:</span>
                                <strong>₹${o.total}</strong>
                            </div>
                            <div class="order-details">
                                <p><strong>Payment:</strong> ${o.paymentMethod}</p>
                                <p><strong>Delivery:</strong> ${o.deliveryTime}</p>
                            </div>
                        </div>
                    </div>
                `).join("")):t.success?(console.log("No orders found for user"),s.style.display="flex"):(console.error("API error:",t.error),e.style.display="none",s.innerHTML=`
                    <span class="empty-icon">⚠️</span>
                    <h3>Error Loading Orders</h3>
                    <p>${t.error||"Unable to fetch orders. Please try again later."}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Retry</button>
                `,s.style.display="flex")}catch(t){clearTimeout(r),console.error("Error loading orders:",t),e.style.display="none",s.innerHTML=`
                <span class="empty-icon">⚠️</span>
                <h3>Error Loading Orders</h3>
                <p>${t.message||"Failed to fetch orders. Please check your connection and try again."}</p>
                <button class="btn btn-primary" onclick="location.reload()">Retry</button>
            `,s.style.display="flex"}}i()&&await l()});

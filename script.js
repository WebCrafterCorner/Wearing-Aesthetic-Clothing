const productsData = [
    {
        id: 1,
        name: "AESTHETIC VINTAGE TEE (BLACK, M)",
        price: 3899,
        oldPrice: 4999,
        img: "user_tshirt_1.png",
        desc: "Heavyweight 240GSM cotton vintage washed tee with custom minimalist typography and boxy streetwear fit."
    },
    {
        id: 2,
        name: "BOXY FIT CARGO SHORTS (OFF-WHITE, L)",
        price: 5999,
        oldPrice: 7499,
        img: "user_tshirt_2.png",
        desc: "Premium utility cargo shorts featuring durable hardware, relaxed tailoring, and understated aesthetic branding."
    },
    {
        id: 3,
        name: "MINIMALIST OVERSIZED HOODIE (CHARCOAL)",
        price: 4899,
        oldPrice: 6499,
        img: "user_tshirt_3.png",
        desc: "Ultra-plush fleece hoodie built with double-layered hood and clean drop-shoulder cinematic silhouette."
    },
    {
        id: 4,
        name: "STREETWEAR GRAPHIC TEE (WHITE)",
        price: 2999,
        oldPrice: 3999,
        img: "user_tshirt_4.png",
        desc: "Breathable combed cotton tee with high-density aesthetic back graphic print."
    }
];

let cart = JSON.parse(localStorage.getItem('wearing_aesthetic_cart')) || [];

function saveCart() {
    localStorage.setItem('wearing_aesthetic_cart', JSON.stringify(cart));
}

function renderProducts() {
    const container = document.getElementById('product-grid-container');
    if(!container) return;
    container.innerHTML = '';

    productsData.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <span class="sale-badge">Drop</span>
            <div class="product-img-box" onclick="openProductModal(${p.id})">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="product-name" onclick="openProductModal(${p.id})">${p.name}</div>
            <div class="price-line">
                <span class="old-price">₹${p.oldPrice}.00</span>
                <span class="new-price">₹${p.price}.00</span>
            </div>
            <button class="add-cart-btn" onclick="addToCart('${p.name}', ${p.price}, ${p.oldPrice}, '${p.img}')">Add to cart</button>
        `;
        container.appendChild(card);
    });
}

function openProductModal(productId) {
    const p = productsData.find(item => item.id === productId);
    if (!p) return;

    document.getElementById('modal-product-img').src = p.img;
    document.getElementById('modal-product-title').innerText = p.name;
    document.getElementById('modal-old-price').innerText = `₹${p.oldPrice}.00`;
    document.getElementById('modal-new-price').innerText = `₹${p.price}.00`;
    document.getElementById('modal-product-desc').innerText = p.desc;
    
    document.getElementById('modal-add-btn').onclick = function() {
        addToCart(p.name, p.price, p.oldPrice, p.img);
        closeProductModal();
    };

    document.getElementById('modal-buynow-btn').onclick = function() {
        addToCart(p.name, p.price, p.oldPrice, p.img);
        closeProductModal();
        goToCheckout();
    };

    document.getElementById('product-modal-overlay').classList.add('active');
}

function closeProductModal(event) {
    if (!event || event.target.id === 'product-modal-overlay' || event.target.className === 'modal-close-btn') {
        document.getElementById('product-modal-overlay').classList.remove('active');
    }
}

function addToCart(name, price, oldPrice, img) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, oldPrice, img, qty: 1 });
    }
    saveCart();
    updateCartUI();
    openCart();
}

function updateQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const cartList = document.getElementById('cart-list');
    const checkoutItemsList = document.getElementById('checkout-items-list');
    const floatCount = document.getElementById('float-cart-count');
    const headerCount = document.getElementById('header-cart-count');
    
    let totalItems = 0;
    let subtotal = 0;
    let totalSavings = 0;

    if(cartList) cartList.innerHTML = '';
    if(checkoutItemsList) checkoutItemsList.innerHTML = '';

    cart.forEach((item, index) => {
        totalItems += item.qty;
        subtotal += item.price * item.qty;
        totalSavings += (item.oldPrice - item.price) * item.qty;

        if(cartList) {
            const row = document.createElement('div');
            row.className = 'cart-item-row';
            row.innerHTML = `
                <img src="${item.img}" class="cart-item-img" alt="">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">₹${item.price}.00</div>
                    <div class="qty-box">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                    <div class="cart-item-total">₹${item.price * item.qty}.00</div>
                </div>
                <i class="fa-solid fa-xmark remove-icon" onclick="removeItem(${index})"></i>
            `;
            cartList.appendChild(row);
        }

        if(checkoutItemsList) {
            const checkRow = document.createElement('div');
            checkRow.className = 'checkout-item-row';
            checkRow.innerHTML = `
                <span>${item.name} (x${item.qty})</span>
                <span style="font-weight:700;">₹${item.price * item.qty}.00</span>
            `;
            checkoutItemsList.appendChild(checkRow);
        }
    });

    if(floatCount) floatCount.innerText = totalItems;
    if(headerCount) headerCount.innerText = totalItems;
    
    document.getElementById('subtotal-amount').innerText = `₹${subtotal}.00`;
    document.getElementById('savings-amount').innerText = `₹${totalSavings}.00`;
    document.getElementById('checkout-total').innerText = `₹${subtotal}.00`;

    const pageSub = document.getElementById('checkout-page-subtotal');
    const pageSav = document.getElementById('checkout-page-savings');
    const pageTot = document.getElementById('checkout-page-total');
    
    if(pageSub) pageSub.innerText = `₹${subtotal}.00`;
    if(pageSav) pageSav.innerText = `₹${totalSavings}.00`;
    if(pageTot) pageTot.innerText = `₹${subtotal}.00`;
}

function openCart() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('active');
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('active');
}

function goToCheckout() {
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    closeCart();
    document.getElementById('shop-view-container').style.display = 'none';
    document.getElementById('checkout-page-view').classList.add('active');
    window.scrollTo(0,0);
}

function showShopView() {
    document.getElementById('checkout-page-view').classList.remove('active');
    document.getElementById('shop-view-container').style.display = 'block';
    window.scrollTo(0,0);
}

function completeOrder() {
    alert("Order placed successfully! Thank you for shopping with Wearing Aesthetic Clothing.");
    cart = [];
    saveCart();
    updateCartUI();
    showShopView();
}

window.onload = function() {
    renderProducts();
    updateCartUI();
};

// Fake loading screen + animated transition between pages

const pageLoader = document.getElementById("pageLoader");
const PAGE_TRANSITION_DELAY = 500;

if(pageLoader){
    setTimeout(()=>{
        pageLoader.classList.add("hide");
    },PAGE_TRANSITION_DELAY);

    document.querySelectorAll('a[href$=".html"]').forEach(link=>{
        if(link.target === "_blank") return;

        link.addEventListener("click",(e)=>{
            const href = link.getAttribute("href");
            e.preventDefault();
            pageLoader.classList.remove("hide");
            setTimeout(()=>{
                window.location.href = href;
            },PAGE_TRANSITION_DELAY);
        })
    })
}

const navList = document.querySelector(".nav-list");
const bars = document.querySelector(".bars");
const line1=document.querySelector(".line1");
const line2=document.querySelector(".line2");
const line3=document.querySelector(".line3");


bars.addEventListener("click",()=>{
    navList.classList.toggle("active");
    bars.classList.toggle("active");
})



const nav = document.querySelector(".nav");
console.log(nav);

window.addEventListener("scroll",()=>{
    if(window.scrollY>250){
        nav.classList.add("active");
    }
    else{
        if(nav.classList.contains("active")){
            nav.classList.remove("active")
        }
    }
})

// Up Arrow function

const upArrow = document.querySelector(".up-arrow");

upArrow.addEventListener("click",()=>{

    window.scrollTo({
        top:0,behavior:"smooth"
    })
})

// Dark mode toggle (theme is set early by the inline anti-flash script in <head>)

const themeToggleBtn = document.querySelector(".theme-toggle");

if(themeToggleBtn){
    themeToggleBtn.addEventListener("click",()=>{
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const next = isDark ? "light" : "dark";
        document.documentElement.setAttribute("data-theme",next);
        localStorage.setItem("theme",next);
    })
}

// Simple cart system

const CART_KEY = "steakin_cart";

const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const formatPrice = (n) => `£${n.toFixed(2)}`;

const cartCountEls = document.querySelectorAll(".cart-count");

const updateCartCount = () => {
    const count = getCart().reduce((sum,item)=>sum+item.qty,0);
    cartCountEls.forEach(el=>{
        el.textContent = count;
        el.classList.toggle("show",count>0);
    })
}

const cartOverlay = document.createElement("div");
cartOverlay.className = "cart-overlay";

const cartDrawer = document.createElement("div");
cartDrawer.className = "cart-drawer";
cartDrawer.innerHTML = `
    <div class="cart-drawer-head">
        <h3>Your Cart</h3>
        <button type="button" class="cart-close" aria-label="Close cart"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="cart-items"></div>
    <div class="cart-drawer-footer">
        <div class="cart-total"><span>Total</span><span class="cart-total-amount">£0.00</span></div>
        <a href="" class="cart-checkout">CHECKOUT</a>
    </div>
`;

document.body.appendChild(cartOverlay);
document.body.appendChild(cartDrawer);

const cartItemsEl = cartDrawer.querySelector(".cart-items");
const cartTotalEl = cartDrawer.querySelector(".cart-total-amount");

const openCart = () => {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
}
const closeCart = () => {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
}

cartDrawer.querySelector(".cart-close").addEventListener("click",closeCart);
cartOverlay.addEventListener("click",closeCart);
cartDrawer.querySelector(".cart-checkout").addEventListener("click",(e)=>e.preventDefault());

const changeQty = (index,delta) => {
    const cart = getCart();
    cart[index].qty += delta;
    if(cart[index].qty<=0){
        cart.splice(index,1);
    }
    saveCart(cart);
    renderCart();
}

const removeItem = (index) => {
    const cart = getCart();
    cart.splice(index,1);
    saveCart(cart);
    renderCart();
}

function renderCart(){
    const cart = getCart();
    cartItemsEl.innerHTML = "";

    if(cart.length === 0){
        cartItemsEl.innerHTML = `<p class="cart-empty">Your cart is empty</p>`;
    } else {
        cart.forEach((item,index)=>{
            const row = document.createElement("div");
            row.className = "cart-item";
            row.innerHTML = `
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-qty">
                    <button type="button" class="qty-minus">&minus;</button>
                    <span>${item.qty}</span>
                    <button type="button" class="qty-plus">+</button>
                </div>
                <button type="button" class="cart-item-remove" aria-label="Remove"><i class="fa-solid fa-trash"></i></button>
            `;
            row.querySelector(".qty-minus").addEventListener("click",()=>changeQty(index,-1));
            row.querySelector(".qty-plus").addEventListener("click",()=>changeQty(index,1));
            row.querySelector(".cart-item-remove").addEventListener("click",()=>removeItem(index));
            cartItemsEl.appendChild(row);
        })
    }

    const total = cart.reduce((sum,item)=>sum+item.price*item.qty,0);
    cartTotalEl.textContent = formatPrice(total);
    updateCartCount();
}

const addToCart = (name,price) => {
    const cart = getCart();
    const existing = cart.find(item=>item.name===name);
    if(existing){
        existing.qty += 1;
    } else {
        cart.push({name,price,qty:1});
    }
    saveCart(cart);
    renderCart();
    openCart();
}

document.querySelectorAll(".cart-link").forEach(link=>{
    link.addEventListener("click",(e)=>{
        e.preventDefault();
        openCart();
    })
})

document.querySelectorAll(".card-button").forEach(btn=>{
    btn.addEventListener("click",(e)=>{
        e.preventDefault();
        const card = btn.closest(".card");
        const name = card.querySelector(".name").textContent.trim();
        const priceText = card.querySelector(".price").textContent.trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g,""));
        addToCart(name,price);
    })
})

renderCart();

// Book a Table modal (index.html only)

const bookBtns = document.querySelectorAll(".book-table-trigger");

if(bookBtns.length){
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.innerHTML = `
        <div class="modal-box">
            <button type="button" class="modal-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
            <h3>Book a Table</h3>
            <p>Reserve your table and we'll confirm shortly.</p>
            <form>
                <input type="text" placeholder="Full Name" required>
                <input type="tel" placeholder="Phone Number" required>
                <input type="date" required>
                <button type="submit">RESERVE</button>
            </form>
            <p class="modal-success">Thank you! We'll be in touch soon.</p>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeModal = () => modalOverlay.classList.remove("open");
    const openModal = () => modalOverlay.classList.add("open");

    bookBtns.forEach(btn=>{
        btn.addEventListener("click",(e)=>{
            e.preventDefault();
            openModal();
        })
    })

    modalOverlay.addEventListener("click",(e)=>{
        if(e.target === modalOverlay) closeModal();
    })

    modalOverlay.querySelector(".modal-close").addEventListener("click",closeModal);

    modalOverlay.querySelector("form").addEventListener("submit",(e)=>{
        e.preventDefault();
        modalOverlay.querySelector("form").style.display = "none";
        modalOverlay.querySelector(".modal-success").classList.add("show");
    })
}


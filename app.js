const discountFactor = 0.5;

const categoryFilters = [
  { id: "all", label: "All" },
  { id: "brownies", label: "Brownies" },
  { id: "cookies", label: "Cookies" },
  { id: "cake", label: "Cake" }
];
const categories = categoryFilters.slice(1);
let activeCategory = "all";
let searchTerm = "";

const menu = [
  {
    id: "velvet-brownie",
    name: "Velvet Brownie Bloom",
    desc: "Molten dark cocoa with espresso nibs and a salt ribbon.",
    badge: "Fudgy",
    image:
      "https://images.unsplash.com/photo-1505253758473-5cc0c0a7d8f4?auto=format&fit=crop&w=480&q=80",
    category: "brownies",
    basePrice: 760
  },
  {
    id: "caramel-brownie",
    name: "Caramel Crust Brownie",
    desc: "Burnt sugar glaze over a chewy cocoa core.",
    badge: "Caramel",
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=480&q=80",
    category: "brownies",
    basePrice: 720
  },
  {
    id: "berry-brownie",
    name: "Berry Bloom Brownie",
    desc: "Blackberry compote swirled into a malted brownie base.",
    badge: "Bloom",
    image:
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=480&q=80",
    category: "brownies",
    basePrice: 700
  },
  {
    id: "starlight-cookie",
    name: "Starlight Snickerdoodle",
    desc: "Cracked sugar crust, warm cinnamon, and cloud-soft crumb.",
    badge: "Cloudy",
    image:
      "https://images.unsplash.com/photo-1512058564366-c9e3cdb7c3c0?auto=format&fit=crop&w=480&q=80",
    category: "cookies",
    basePrice: 480
  },
  {
    id: "honey-rose-cookie",
    name: "Honey Rose Cookie",
    desc: "Honey-glazed rounds with dried rose petals and almond dust.",
    badge: "Honey",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=480&q=80",
    category: "cookies",
    basePrice: 520
  },
  {
    id: "matcha-chunk-cookie",
    name: "Matcha Chunk",
    desc: "Matcha butter cookie studded with pistachio and white chocolate.",
    badge: "Green",
    image:
      "https://images.unsplash.com/photo-1501696351850-6b7c1ee4b1d2?auto=format&fit=crop&w=480&q=80",
    category: "cookies",
    basePrice: 560
  },
  {
    id: "midnight-cake",
    name: "Midnight Layer Cake",
    desc: "Mocha sponge, violet buttercream, and candied citrus.",
    badge: "Layer",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=480&q=80",
    category: "cake",
    basePrice: 840
  },
  {
    id: "moon-tart",
    name: "Moon Tart",
    desc: "Charcoal crumb, lemon curd, and cloud meringue peaks.",
    badge: "Glaze",
    image:
      "https://images.unsplash.com/photo-1481390967422-88a83ee5be8d?auto=format&fit=crop&w=480&q=80",
    category: "cake",
    basePrice: 700
  },
  {
    id: "hibiscus-cake",
    name: "Hibiscus Chiffon",
    desc: "Feather-light hibiscus sponge layered with rose mousse.",
    badge: "Bloom",
    image:
      "https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=480&q=80",
    category: "cake",
    basePrice: 780
  }
].map((item) => ({
  ...item,
  price: Math.round(item.basePrice * discountFactor)
}));

const formatPrice = (cents) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);

const heroLede = document.querySelector(".hero-lede");
const heroPill = document.querySelectorAll(".hero-pill span");
if (heroLede) {
  heroLede.textContent = "Gentle pastels, playful treats, always half off.";
}
if (heroPill.length >= 3) {
  heroPill[0].textContent = "Pickup ready";
  heroPill[1].textContent = "Local drops";
  heroPill[2].textContent = "Sweet at 50%";
}

const sectionHead = document.querySelector(".section-head");
const productGrid = document.getElementById("productGrid");
const cartBody = document.getElementById("cartBody");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const snackbar = document.getElementById("snackbar");

const cartCountSpan = document.getElementById("cartCount");
const cartFooter = document.querySelector(".cart-footer");
const checkoutBtn = document.getElementById("checkoutBtn");
if (cartFooter) {
  cartFooter.remove();
}

const viewCartExisting = document.getElementById("cartToggle");
if (viewCartExisting) {
  viewCartExisting.remove();
}

const appShell = document.querySelector(".app-shell");
const footer = document.createElement("footer");
footer.className = "mobile-footer";

const viewCartBtn = document.createElement("button");
viewCartBtn.id = "viewCartBtn";
viewCartBtn.className = "ghost-btn";
viewCartBtn.type = "button";
viewCartBtn.append("View cart (");
viewCartBtn.append(cartCountSpan);
viewCartBtn.append(")");

const footerCheckout = document.createElement("div");
footerCheckout.className = "footer-checkout";
footerCheckout.innerHTML = `
  <div class="footer-total">
    <span>Total</span>
    <strong id="footerTotal">$0.00</strong>
  </div>
`;

if (checkoutBtn) {
  checkoutBtn.textContent = "Checkout";
  footerCheckout.appendChild(checkoutBtn);
}

footer.append(viewCartBtn, footerCheckout);
appShell.appendChild(footer);

const footerTotalEl = document.getElementById("footerTotal");
const cartCountEl = document.getElementById("cartCount");

const cart = {};

const createCategoryTabs = () => {
  if (!sectionHead) return;
  const tabs = document.createElement("div");
  tabs.id = "categoryTabs";
  tabs.className = "category-tabs";
  tabs.innerHTML = categoryFilters
    .map(
      (category) => `<button type="button" data-target="${category.id}"${category.id === activeCategory ? " class=\"active\"" : ""}>${category.label}</button>`
    )
    .join("");
  sectionHead.insertAdjacentElement("afterend", tabs);

  const searchWrapper = document.createElement("div");
  searchWrapper.className = "search-bar";
  searchWrapper.innerHTML = `<input type="search" aria-label="Search treats" placeholder="Search treats" value="" />`;
  tabs.insertAdjacentElement("afterend", searchWrapper);

  const searchInput = searchWrapper.querySelector("input");
  searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  tabs.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-target]");
    if (!target) return;
    tabs.querySelector(".active")?.classList.remove("active");
    target.classList.add("active");
    activeCategory = target.dataset.target;
    renderProducts();
  });
};

const renderCard = (product) => `
  <article class="product-card">
    <p class="product-badge">${product.badge}</p>
    <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
    <h3 class="product-name">${product.name}</h3>
    <p class="product-desc">${product.desc}</p>
    <div class="price-stack">
      <span class="original-price">${formatPrice(product.basePrice)}</span>
      <span class="product-price">${formatPrice(product.price)}</span>
    </div>
    <button class="add-btn" data-id="${product.id}">Add</button>
  </article>
`;

const renderProducts = () => {
  const normalized = (text) => text.toLowerCase();
  const filteredItems = menu.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = !searchTerm || normalized(item.name).includes(searchTerm) || normalized(item.desc).includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const sections = categories
    .filter((category) => activeCategory === "all" || category.id === activeCategory)
    .map((category) => {
      const items = filteredItems.filter((item) => item.category === category.id);
      if (!items.length) return "";
      return `
        <section class="category-section" data-category="${category.id}">
          <div class="category-heading">
            <p>${category.label}</p>
            <span>${items.length} picks</span>
          </div>
          <div class="category-grid">
            ${items.map(renderCard).join("")}
          </div>
        </section>
      `;
    })
    .join("");

  productGrid.innerHTML = sections || '<p class="empty-state">No treats match that search yet.</p>';
};

const updateCartDisplay = () => {
  const entries = Object.values(cart);
  if (cartCountEl) {
    cartCountEl.textContent = entries.reduce((sum, entry) => sum + entry.qty, 0);
  }
  if (footerTotalEl) {
    footerTotalEl.textContent = formatPrice(
      entries.reduce((sum, entry) => sum + entry.qty * entry.item.price, 0)
    );
  }

  if (!entries.length) {
    cartBody.innerHTML = '<p class="cart-empty">Add something luminous to your cart.</p>';
    return;
  }

  cartBody.innerHTML = entries
    .map(
      ({ item, qty }) => `
      <div class="cart-item">
        <div class="cart-item-main">
          <p class="cart-item-title">${item.name}</p>
          <p class="cart-item-desc">${formatPrice(item.price)} × ${qty}</p>
        </div>
        <div class="cart-item-controls">
          <button class="control-btn" data-id="${item.id}" data-action="decrease">–</button>
          <span>${qty}</span>
          <button class="control-btn" data-id="${item.id}" data-action="increase">+</button>
        </div>
      </div>
    `
    )
    .join("");
};

const addToCart = (id) => {
  const item = menu.find((product) => product.id === id);
  if (!item) return;
  cart[id] = cart[id] ?? { item, qty: 0 };
  cart[id].qty += 1;
  updateCartDisplay();
  showSnackbar(`${item.name} added.`);
};

const changeQuantity = (id, delta) => {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) {
    delete cart[id];
  }
  updateCartDisplay();
};

const showSnackbar = (text) => {
  snackbar.textContent = text;
  snackbar.classList.add("show");
  clearTimeout(snackbar.timeout);
  snackbar.timeout = setTimeout(() => snackbar.classList.remove("show"), 1800);
};

productGrid.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-id]");
  if (!btn) return;
  const id = btn.dataset.id;
  addToCart(id);
});

cartBody.addEventListener("click", (event) => {
  if (!event.target.dataset.action) return;
  const { id, action } = event.target.dataset;
  changeQuantity(id, action === "increase" ? 1 : -1);
});

const toggleCart = (open) => {
  cartPanel.classList.toggle("open", open);
};

viewCartBtn.addEventListener("click", () => toggleCart(true));
closeCart.addEventListener("click", () => toggleCart(false));

checkoutBtn.addEventListener("click", () => {
  const entries = Object.values(cart);
  if (!entries.length) {
    showSnackbar("Your cart is empty. Add a treat first.");
    return;
  }

  checkoutBtn.disabled = true;
  checkoutBtn.textContent = "Sending to Stripe…";

  fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      items: entries.map(({ item, qty }) => ({
        id: item.id,
        quantity: qty
      }))
    })
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error("Failed to start checkout.");
      }
      const data = await res.json();
      if (data.url) {
        window.location = data.url;
      } else {
        throw new Error("Stripe session missing.");
      }
    })
    .catch((error) => {
      console.error(error);
      showSnackbar("Could not start checkout. Try again soon.");
    })
    .finally(() => {
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = "Checkout";
    });
});

createCategoryTabs();
renderProducts();
updateCartDisplay();

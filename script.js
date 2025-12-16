// ================================
// VARIABLES GLOBALES
// ================================
const contenedorProductos = document.getElementById("productos-container"); // ← CORREGIDO
const carrito = document.getElementById("carrito");
const carritoItems = document.getElementById("carrito-items");
const carritoTotal = document.getElementById("carrito-total");
const contadorCarrito = document.getElementById("contador-carrito");

const btnCarrito = document.getElementById("btn-carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");

let carritoArray = JSON.parse(localStorage.getItem("carrito")) || [];

// ================================
// INICIO: CARGAR PRODUCTOS
// ================================
async function cargarProductos() {
    const res = await fetch("https://fakestoreapi.com/products");
    const productos = await res.json();
    mostrarProductos(productos);
}

cargarProductos();

// ================================
// RENDER DE PRODUCTOS
// ================================
function mostrarProductos(productos) {
    productos.forEach(prod => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${prod.image}" alt="${prod.title}">
            <h3>${prod.title}</h3>
            <p>$${prod.price}</p>
            <button class="btn-agregar" 
                data-id="${prod.id}" 
                data-title="${prod.title}" 
                data-price="${prod.price}" 
                data-image="${prod.image}">
                Agregar al carrito
            </button>
        `;

        contenedorProductos.appendChild(card);
    });

    document.querySelectorAll(".btn-agregar").forEach(btn => {
        btn.addEventListener("click", agregarAlCarrito);
    });
}

// ================================
// AGREGAR AL CARRITO
// ================================
function agregarAlCarrito(e) {
    const btn = e.target;

    const item = {
        id: btn.getAttribute("data-id"),
        title: btn.getAttribute("data-title"),
        price: Number(btn.getAttribute("data-price")),
        image: btn.getAttribute("data-image"),
        cantidad: 1
    };

    const existe = carritoArray.find(p => p.id === item.id);

    if (existe) {
        existe.cantidad++;
    } else {
        carritoArray.push(item);
    }

    guardarCarrito();
    renderCarrito();
}

// ================================
// MOSTRAR CARRITO
// ================================
function renderCarrito() {
    carritoItems.innerHTML = "";
    let total = 0;

    carritoArray.forEach(prod => {
        total += prod.price * prod.cantidad;

        const item = document.createElement("div");
        item.classList.add("carrito-item");

        item.innerHTML = `
            <img src="${prod.image}">
            <div class="carrito-info">
                <h4>${prod.title}</h4>
                <p>$${prod.price}</p>

                <div class="carrito-controles">
                    <button class="menos" data-id="${prod.id}">-</button>
                    <span>${prod.cantidad}</span>
                    <button class="mas" data-id="${prod.id}">+</button>
                </div>

                <button class="eliminar" data-id="${prod.id}">Eliminar</button>
            </div>
        `;

        carritoItems.appendChild(item);
    });

    carritoTotal.textContent = total.toFixed(2);
    contadorCarrito.textContent = carritoArray.length;

    agregarEventosCarrito();
}

// ================================
// BOTONES + - ELIMINAR
// ================================
function agregarEventosCarrito() {
    document.querySelectorAll(".mas").forEach(btn => {
        btn.addEventListener("click", () => cambiarCantidad(btn.dataset.id, 1));
    });

    document.querySelectorAll(".menos").forEach(btn => {
        btn.addEventListener("click", () => cambiarCantidad(btn.dataset.id, -1));
    });

    document.querySelectorAll(".eliminar").forEach(btn => {
        btn.addEventListener("click", () => eliminarProducto(btn.dataset.id));
    });
}

function cambiarCantidad(id, cambio) {
    const producto = carritoArray.find(p => p.id === id);
    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
        carritoArray = carritoArray.filter(p => p.id !== id);
    }

    guardarCarrito();
    renderCarrito();
}

function eliminarProducto(id) {
    carritoArray = carritoArray.filter(p => p.id !== id);
    guardarCarrito();
    renderCarrito();
}

// ================================
// LOCAL STORAGE
// ================================
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carritoArray));
}

// ================================
// ABRIR Y CERRAR CARRITO
// ================================
btnCarrito.addEventListener("click", () => {
    carrito.classList.add("visible");
});

cerrarCarrito.addEventListener("click", () => {
    carrito.classList.remove("visible");
});

// Render inicial al cargar la página
renderCarrito();

// OCULTAR / MOSTRAR CARRITO SEGÚN LA SECCIÓN
document.addEventListener("scroll", () => {
    const carritoBtn = document.getElementById("btn-carrito");
    const productosSection = document.getElementById("productos");

    const rect = productosSection.getBoundingClientRect();

    // Si la sección "productos" está visible, mostrar el botón
    if (rect.bottom > 400 && rect.top < window.innerHeight - 150) {
        carritoBtn.classList.remove("oculto");
    } else {
        carritoBtn.classList.add("oculto");
    }
});
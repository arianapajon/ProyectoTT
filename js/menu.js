// ================================
// MENÚ HAMBURGUESA
// ================================
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector(".nav-aero");

console.log(menuToggle);
console.log(nav);

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        console.log("CLICK");
        menuToggle.classList.toggle("activo");
        nav.classList.toggle("activo");
    });
}
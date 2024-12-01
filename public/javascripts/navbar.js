const navbar = document.getElementById("navbarLeft");
const openNavbarBtn = document.getElementById("openNavbar");
const closeNavbarBtn = document.getElementById("closeNavbar");

document.addEventListener("DOMContentLoaded", function () {
  if (!navbar || !openNavbarBtn || !closeNavbarBtn) return;

  closeNavbarBtn.addEventListener("click", (e) => {
    navbar.style.setProperty("transform", "translateX(-128px)");
  });

  openNavbarBtn.addEventListener("click", (e) => {
    navbar.style.setProperty("transform", "translateX(0)");
  });
});

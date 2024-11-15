document.addEventListener("DOMContentLoaded", function () {
  const characterDropdownContainer = document.getElementById(
    "characterDropdownContainer"
  );

  if (characterDropdownContainer) {
    const dropdownMenu =
      characterDropdownContainer.querySelector(".characterdropdown");

    // Toggles dropdown visibility when clicking on the container
    characterDropdownContainer.addEventListener("click", (event) => {
      const isVisible = dropdownMenu.style.display === "block";

      // Close other dropdowns, if necessary
      document.querySelectorAll(".characterdropdown").forEach((menu) => {
        menu.style.display = "none";
      });

      // Toggle current dropdown
      dropdownMenu.style.display = isVisible ? "none" : "block";
    });

    // Close the dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!characterDropdownContainer.contains(event.target)) {
        dropdownMenu.style.display = "none";
      }
    });
  }
});

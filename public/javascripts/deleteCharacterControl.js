"use strict";

const showModalButton = document.getElementById("deleteButtonShowModal");
const modal = document.getElementById("deleteCharModal");
const hideModalButton = document.getElementById("cancelDeleteButton");

document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;
  const pathArray = path?.split("/");

  const isPageDeleteCharacter = pathArray?.includes("myCharacters");

  if (isPageDeleteCharacter) {
    showModalButton.addEventListener(
      "click",
      () => (modal.style.display = "flex")
    );

    hideModalButton.addEventListener(
      "click",
      (e) => (modal.style.display = "none")
    );
  }
});

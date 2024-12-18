"use strict";

const tabActiveBgColor = "#6366f1";

document.addEventListener("DOMContentLoaded", function () {
  const allInputs = document.querySelectorAll("#createCharForm input");
  const allSelects = document.querySelectorAll("#createCharForm select");

  const tabsContent = document.querySelector(".tabsContent");
  const allTabs = document.querySelectorAll(".tabsContent > div");

  const tabsContainer = document.querySelector("#tabsContainer");
  const tabsButtons = document.querySelectorAll("#tabsContainer button");

  const createCharButton = document.querySelector("#createCharButton");
  const createCharForm = document.querySelector("#createCharForm");

  // change active tab
  if (createCharForm) {
    tabsContainer.addEventListener("click", (e) => {
      const targetTab = e.target.closest("button");
      if (!targetTab) return;

      const tabName = targetTab.dataset.name;

      tabsButtons.forEach((button) => {
        button.classList.remove("activeTab");
        button.style.removeProperty("background-color");
        button.style.removeProperty("color");
      });

      targetTab.style.setProperty("background-color", tabActiveBgColor);
      targetTab.style.color = "white";
      targetTab.classList.add("activeTab");

      localStorage.setItem("activeTabButtonName", tabName);

      allTabs.forEach((tab) => tab.classList.add("hidden"));

      const divToShow = document.querySelector(`#${tabName}`);
      divToShow.classList.remove("hidden");
    });
  }

  // flash tab color when input is invalid
  if (tabsContent) {
    createCharButton.addEventListener("click", (e) => {
      allInputs.forEach((inp) => {
        if (!inp.checkValidity()) {
          const inputTabId = inp.closest(".tab").id;
          const tabButtonsArray = Array.from(tabsButtons);
          const tabButtonToFlash = tabButtonsArray.filter(
            (button) => button.dataset.name === inputTabId
          )[0];
          flashButton(tabButtonToFlash);
        }
      });
      allSelects.forEach((sel) => {
        if (!sel.checkValidity()) {
          const selectTabId = sel.closest(".tab").id;
          const tabButtonsArray = Array.from(tabsButtons);
          const tabButtonToFlash = tabButtonsArray.filter(
            (button) => button.dataset.name === selectTabId
          )[0];
          flashButton(tabButtonToFlash);
        }
      });
    });
  }
});

// function to flash tab color when input is invalid
function flashButton(button) {
  button.style.backgroundColor = "crimson";
  setTimeout(function () {
    button.style.removeProperty("background-color");
    if (button.classList.contains("activeTab")) {
      button.style.backgroundColor = tabActiveBgColor;
    }
  }, 250);
}

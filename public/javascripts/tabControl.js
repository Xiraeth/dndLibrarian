"use strict";

const tabMainBgColor = "#fcd34d";
const tabActiveBgColor = "#008080";

document.addEventListener("DOMContentLoaded", function () {
  const allInputs = document.querySelectorAll("#createCharForm input");
  const allSelects = document.querySelectorAll("#createCharForm select");

  const tabsContent = document.querySelector(".tabsContent");
  const allTabs = document.querySelectorAll(".tabsContent > div");

  const tabsContainer = document.querySelector("#tabsContainer");
  const tabsButtons = document.querySelectorAll("#tabsContainer button");

  const createCharButton = document.querySelector("#createCharButton");
  const createCharForm = document.querySelector("#createCharForm");

  const errorList = document.querySelector("#errorList");

  window.addEventListener("load", (e) => {
    if (!createCharForm || !errorList) return;

    const buttonsArray = Array.from(tabsButtons);

    const targetTab =
      buttonsArray.find(
        (button) =>
          button.dataset.name === sessionStorage.getItem("activeTabButtonName")
      ) || "";
    if (!targetTab) return;

    tabsButtons.forEach((button) => {
      button.classList.remove("activeTab");
      button.style.backgroundColor = tabMainBgColor;
    });

    targetTab.style.backgroundColor = tabActiveBgColor;
    targetTab.classList.add("activeTab");

    allTabs.forEach((tab) => tab.classList.add("hidden"));
    const divToShow = document.querySelector(`#${targetTab.dataset.name}`);
    divToShow.classList.remove("hidden");
  });

  // change active tab
  if (createCharForm) {
    tabsContainer.addEventListener("click", (e) => {
      const targetTab = e.target.closest("button");
      if (!targetTab) return;

      const tabName = targetTab.dataset.name;

      tabsButtons.forEach((button) => {
        button.classList.remove("activeTab");
        button.style.backgroundColor = tabMainBgColor;
      });

      targetTab.style.backgroundColor = tabActiveBgColor;
      targetTab.classList.add("activeTab");

      sessionStorage.setItem("activeTabButtonName", tabName);

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
    button.style.backgroundColor = tabMainBgColor;
    if (button.classList.contains("activeTab")) {
      button.style.backgroundColor = tabActiveBgColor;
    }
  }, 250);
}

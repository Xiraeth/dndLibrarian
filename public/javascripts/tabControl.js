"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const tabsContent = document.querySelector(".tabsContent");
  const allTabs = document.querySelectorAll(".tabsContent > div");

  const tabsContainer = document.querySelector("#tabsContainer");
  const tabsButtons = document.querySelectorAll("#tabsContainer button");

  if (tabsContainer) {
    tabsContainer.addEventListener("click", (e) => {
      const targetTab = e.target;
      tabsButtons.forEach((button) => button.classList.remove("activeTab"));
      targetTab.classList.add("activeTab");

      allTabs.forEach((tab) => tab.classList.add("hidden"));
      const divToShow = document.querySelector(`#${targetTab.dataset.name}`);
      divToShow.classList.remove("hidden");
    });
  }
});

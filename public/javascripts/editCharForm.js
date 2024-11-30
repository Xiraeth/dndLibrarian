const submitFormBtn = document.getElementById("submitEditCharForm");
const form = document.getElementById("editCharacterForm");

document.addEventListener("DOMContentLoaded", function () {
  if (form) {
    submitFormBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (form.checkValidity()) {
        form.submit();
      } else {
        form.reportValidity();
      }
    });
  }
});

/* ==========================================================================
   GameHub — interacciones de la portada y de los formularios de acceso
   Sin backend: solo validación en el navegador.
   ========================================================================== */

(function () {
  "use strict";

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var MESSAGES = {
    login: "Los datos están completos. Todavía no hay servidor ni base de datos, así que no se envió nada.",
    registro: "Los datos están correctos. Todavía no hay base de datos, así que tu cuenta no se guardó."
  };

  /* --- Mostrar u ocultar contraseñas ------------------------------------ */

  function initPasswordToggles() {
    var toggles = document.querySelectorAll("[data-password-toggle]");

    Array.prototype.forEach.call(toggles, function (toggle) {
      var input = document.getElementById(toggle.getAttribute("data-password-toggle"));
      if (!input) return;

      toggle.addEventListener("click", function () {
        var reveal = input.type === "password";
        input.type = reveal ? "text" : "password";
        toggle.setAttribute("aria-pressed", String(reveal));
        toggle.setAttribute("aria-label", reveal ? "Ocultar contraseña" : "Mostrar contraseña");
      });
    });
  }

  /* --- Validación -------------------------------------------------------- */

  function getErrorElement(input) {
    var field = input.closest(".field");
    return field ? field.querySelector(".field__error") : null;
  }

  function getPasswordInput(form) {
    return form.querySelector('[data-validate="password"]');
  }

  function validateField(input) {
    var value = input.value.trim();
    var key = input.getAttribute("data-validate");

    if (key === "email") {
      if (!value) return "Escribe tu correo electrónico.";
      if (!EMAIL_PATTERN.test(value)) return "Escribe un correo válido, por ejemplo nombre@correo.com.";
    }

    if (key === "name") {
      if (!value) return "Escribe tu nombre.";
      if (value.length < 2) return "El nombre debe tener al menos 2 caracteres.";
    }

    if (key === "password") {
      if (!value) return "Escribe tu contraseña.";
      if (input.minLength > 0 && value.length < input.minLength) {
        return "Usa al menos " + input.minLength + " caracteres.";
      }
    }

    if (key === "confirm") {
      var password = getPasswordInput(input.form);
      if (!value) return "Repite tu contraseña.";
      if (password && value !== password.value) return "Las contraseñas no coinciden.";
    }

    return "";
  }

  function setFieldError(input, message) {
    var error = getErrorElement(input);
    if (!error) return;

    if (message) {
      input.setAttribute("aria-invalid", "true");
      error.textContent = message;
    } else {
      input.removeAttribute("aria-invalid");
      error.textContent = "";
    }
  }

  function initForms() {
    var forms = document.querySelectorAll("[data-auth-form]");

    Array.prototype.forEach.call(forms, function (form) {
      var fields = form.querySelectorAll("[data-validate]");
      var status = form.querySelector(".form__status");

      Array.prototype.forEach.call(fields, function (field) {
        field.addEventListener("input", function () {
          if (field.hasAttribute("aria-invalid")) {
            setFieldError(field, validateField(field));
          }
          if (status) status.textContent = "";
        });
      });

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var firstInvalid = null;

        Array.prototype.forEach.call(fields, function (field) {
          var message = validateField(field);
          setFieldError(field, message);
          if (message && !firstInvalid) firstInvalid = field;
        });

        if (status) status.textContent = "";

        if (firstInvalid) {
          firstInvalid.focus();
          return;
        }

        if (status) {
          status.textContent = MESSAGES[form.getAttribute("data-form")] || MESSAGES.login;
        }
      });
    });
  }

  initPasswordToggles();
  initForms();
})();

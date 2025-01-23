import Cleave from "cleave.js";
import isEmail from "validator/lib/isEmail";
import cardValidator from "card-validator";

const cardNumberInput = document.getElementById("cardNumber") as HTMLInputElement;
const expiryDateInput = document.getElementById("expiryDate") as HTMLInputElement;
const cvcInput = document.getElementById("cvc") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const submitButton = document.getElementById("submitButton") as HTMLButtonElement;

new Cleave(cardNumberInput, {creditCard: true});
new Cleave(expiryDateInput, {date: true, datePattern: ["m", "y"]});
new Cleave(cvcInput, {numeral: true, numeralDecimalMark: '', numeralIntegerScale: 3});

function validateForm() {
    const cardNumberValid = cardValidator.number(cardNumberInput.value).isValid;
  
    // Проверяем дату окончания
    const expiryValid = (() => {
      const expiryRegex = /^[01][0-9]\/\d{2}$/;
      if (!expiryRegex.test(expiryDateInput.value)) return false;
  
      const [month, year] = expiryDateInput.value.split("/").map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = Number(String(currentDate.getFullYear()).slice(-2));
  
      return (
        month >= 1 &&
        month <= 12 &&
        (year > currentYear || (year === currentYear && month >= currentMonth))
      );
    })();
  
    const cvcValid = /^\d{3}$/.test(cvcInput.value);
    const emailValid = isEmail(emailInput.value);
  
    // Активируем или отключаем кнопку
    submitButton.disabled = !(cardNumberValid && expiryValid && cvcValid && emailValid);
  }
  



function clearErrors() {
    document.querySelectorAll(".error-message").forEach(el => el.textContent = '');
}

[cardNumberInput, expiryDateInput, cvcInput, emailInput].forEach(input => {
    input.addEventListener("input", () => {
        clearErrors();
        validateForm();
    });
    input.addEventListener("blur", () => {
        // Функция для отображения ошибок
function showError(input: HTMLInputElement, message: string) {
    const errorElement = document.getElementById(`${input.id}Error`) as HTMLElement;
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
  
  // Функция для скрытия ошибок
  function hideError(input: HTMLInputElement) {
    const errorElement = document.getElementById(`${input.id}Error`) as HTMLElement;
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
  
  // Обработчик события blur для каждого поля
  function handleBlur(input: HTMLInputElement) {
    if (input.id === "cardNumber") {
      const isValidCard = cardValidator.number(input.value).isValid;
      if (!isValidCard) {
        showError(input, "Некорректный номер карты");
      }
    }
  
    if (input.id === "expiryDate") {
      const expiryRegex = /^[01][0-9]\/\d{2}$/;
      if (!expiryRegex.test(input.value)) {
        showError(input, "Некорректный формат даты (MM/YY)");
        return;
      }
  
      const [month, year] = input.value.split("/").map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = Number(String(currentDate.getFullYear()).slice(-2));
  
      if (month < 1 || month > 12 || (year < currentYear || (year === currentYear && month < currentMonth))) {
        showError(input, "Срок действия карты истёк или неверен");
      }
    }
  
    if (input.id === "cvc") {
      const cvcRegex = /^\d{3}$/;
      if (!cvcRegex.test(input.value)) {
        showError(input, "CVC/CVV должен состоять из 3 цифр");
      }
    }
  
    if (input.id === "email") {
      const isValidEmail = isEmail(input.value);
      if (!isValidEmail) {
        showError(input, "Введите корректный email-адрес");
      }
    }
  }
  
  // Добавление обработчиков blur для всех полей
  [cardNumberInput, expiryDateInput, cvcInput, emailInput].forEach((input) => {
    input.addEventListener("blur", () => {
      hideError(input); // Сначала скрываем любые предыдущие ошибки
      handleBlur(input); // Затем проверяем текущее поле
    });
  
    input.addEventListener("input", () => {
      hideError(input); // Ошибки сбрасываются при вводе
      validateForm(); // Проверка всей формы
    });
  });
  
    })
});
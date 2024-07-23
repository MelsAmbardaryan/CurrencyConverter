"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector(".table");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  const modal = document.querySelector(".modal");
  const elementAMD = modal.querySelector('[data-value="AMD"]');
  const elementEUR = modal.querySelector('[data-value="EUR"]');
  const elementUSD = modal.querySelector('[data-value="USD"]');
  const input = document.querySelector("#input");
  const valResult = document.querySelector("#result");
  const selectControl = document.querySelector(".form-control");
  const inputName = document.querySelector("#exampleFormControlSelect1");
  const inputChangeName = document.querySelector("#select");

  getCurrency();

  async function getCurrency() {
    try {
      const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
      const data = await response.json();
      favoriteValutes(data);
      createArrayCurrency(data);
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  }

  function favoriteValutes(result) {
    const { AMD, EUR, USD } = result.Valute;

    elementAMD.textContent = AMD.Value.toFixed(2);
    elementEUR.textContent = EUR.Value.toFixed(2);
    elementUSD.textContent = USD.Value.toFixed(2);

    inputName.innerHTML += `<option value="${AMD.CharCode}">${AMD.Name}-${AMD.CharCode}</option>`;

    setClassBasedOnValue(elementAMD, AMD.Value, AMD.Previous);
    setClassBasedOnValue(elementEUR, EUR.Value, EUR.Previous);
    setClassBasedOnValue(elementUSD, USD.Value, USD.Previous);
  }

  function setClassBasedOnValue(element, currentValue, previousValue) {
    if (currentValue > previousValue) {
      element.classList.add('top');
    } else {
      element.classList.add('bottom');
    }
  }

  function createArrayCurrency(result) {
    const arr = Object.values(result.Valute);
    changeCourses(arr);

    thead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>NumCode</th>
        <th>CharCode</th>
        <th>Nominal</th>
        <th>Value</th>
        <th>Previous</th>
      </tr>
    `;

    arr.forEach(({ ID, NumCode, CharCode, Nominal, Value, Previous }) => {
      tbody.innerHTML += `
        <tr>
          <td>${ID}</td>
          <td>${NumCode}</td>
          <td>${CharCode}</td>
          <td>${Nominal}</td>
          <td>${Value}</td>
          <td>${Previous}</td>
        </tr>
      `;
    });
  }

  function changeCourses(arr) {
    arr.forEach(({ CharCode, Name }) => {
      inputChangeName.innerHTML += `<option value="${CharCode}">${Name} - ${CharCode}</option>`;
    });

    const calculateResult = () => {
      const filterArr = arr.filter(item => item.CharCode === inputChangeName.value);
      if (filterArr.length > 0) {
        const { Value } = filterArr[0];
        if (selectControl.value === inputChangeName.value) {
          valResult.value = input.value;
        } else {
          valResult.value = (parseFloat(input.value) / Value).toFixed(2);
        }
      }
    };

    inputChangeName.addEventListener("input", calculateResult);
    input.addEventListener("input", calculateResult);
  }
});

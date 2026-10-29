// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

function showError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

function clearError() {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

function clearAlerts() {
  document.getElementById("alerts-display").innerHTML = "";
}

function displayAlerts(data) {
  const features = data.features || [];

  const heading = document.createElement("h2");
  heading.textContent = `${data.title}: ${features.length}`;

  const list = document.createElement("ul");
  for (const { properties } of features) {
    const item = document.createElement("li");
    item.textContent = properties.headline;
    list.appendChild(item);
  }

  const display = document.getElementById("alerts-display");
  display.innerHTML = "";
  display.append(heading, list);
}

async function fetchAlerts(state) {
  try {
    const response = await fetch(`${weatherApi}${state}`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    displayAlerts(await response.json());
    clearError();
  } catch (error) {
    clearAlerts();
    showError(error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("input");
  const button = document.querySelector("button");

  // Never attach the click handler twice to the same button.
  if (button.dataset.bound) return;
  button.dataset.bound = "true";

  button.addEventListener("click", () => {
    const state = input.value.trim().toUpperCase();

    if (!/^[A-Z]{2}$/.test(state)) {
      showError("Please enter a valid two-letter state abbreviation (e.g. CA).");
      return;
    }

    input.value = "";
    fetchAlerts(state);
  });
});

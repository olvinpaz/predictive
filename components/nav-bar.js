const btnHome = document.getElementById('btnHome');
const btnRepeatedNumbers = document.getElementById('btnRN');
const btnSelectedNumbers = document.getElementById('btnSN');

// Cuando el documento se carga completamente, se ejecutará este código.
window.addEventListener('load', function () {
    var currentURL = window.location.href;
    console.log("URL actual: " + currentURL);

    // Verificar si estás en una página específica:
    if (window.location.href.includes("index.html")) {
        console.log("Estás en la página 'index.html'");

        btnHome.classList.add("selected");
        btnRepeatedNumbers.classList.remove("selected");
        btnSelectedNumbers.classList.remove("selected");
    }

    if (window.location.href.includes("repeat.html")) {
        console.log("Estás en la página 'repeat.html'");

        btnHome.classList.remove("selected");
        btnRepeatedNumbers.classList.add("selected");
        btnSelectedNumbers.classList.remove("selected");
    }

    if (window.location.href.includes("selected-numbers.html")) {
        console.log("Estás en la página 'elected-numbers.html'");

        btnHome.classList.remove("selected");
        btnRepeatedNumbers.classList.remove("selected");
        btnSelectedNumbers.classList.add("selected");
    }
});
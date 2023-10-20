const googleSheetsUrl = "https://docs.google.com/spreadsheets/d/1HsyO8Jt7s3zegg7p47T-6YI80zC3m38zs5IV7CjzaWM/gviz/tq?tqx=out:json&gid=1712153455"; //"URL_GENERADA_POR_GOOGLE_SHEETS"

const buttonML = document.getElementById('buttonML');
const buttonTL = document.getElementById('buttonTL');
const buttonNL = document.getElementById('buttonNL');

window.addEventListener('load', function () {
    buttonML.classList.add("selected");
    buttonTL.classList.remove("selected");
    buttonNL.classList.remove("selected");

    const selectedDate = datePicker.value;
    const selectedButton = document.querySelector('button.opt-button.selected');
    if (selectedButton) {
        const buttonValue = selectedButton.getAttribute('data-value');
        fetchDataAndDisplay(buttonValue, selectedDate);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const datePicker = document.getElementById('datePicker');

    // Obtén la fecha actual
    const currentDate = new Date();

    // Resta siete días a la fecha actual
    currentDate.setDate(currentDate.getDate() - 7);

    // Formatea la fecha en "YYYY-MM-DD"
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Establece la fecha en el date picker
    datePicker.value = formattedDate;
});

const datePicker = document.getElementById('datePicker');
    // Agrega un evento de cambio al datePicker
datePicker.addEventListener('change', function () {
    const selectedDate = datePicker.value;
    const selectedButton = document.querySelector('button.opt-button.selected');
    if (selectedButton) {
        const buttonValue = selectedButton.getAttribute('data-value');
        fetchDataAndDisplay(buttonValue, selectedDate);
    }
});


buttonML.addEventListener('click', () => {
   // const selectedDate = prompt("Ingrese la fecha en formato 'YYYY-MM-DD':");
    const datePicker = document.getElementById('datePicker');
    const selectedDate = datePicker.value;

    if (selectedDate) {
        fetchDataAndDisplay(2, selectedDate);
        //console.log("Haz hecho click en Mostrar Col 2")
        buttonML.classList.add("selected");
        buttonTL.classList.remove("selected");
        buttonNL.classList.remove("selected");
    }
});


buttonTL.addEventListener('click', () => {
    const datePicker = document.getElementById('datePicker');
    const selectedDate = datePicker.value;

    if (selectedDate) {
        fetchDataAndDisplay(3, selectedDate);

        buttonML.classList.remove("selected");
        buttonTL.classList.add("selected");
        buttonNL.classList.remove("selected");
    }
});


buttonNL.addEventListener('click', () => {
    const datePicker = document.getElementById('datePicker');
    const selectedDate = datePicker.value;

    if (selectedDate) {
        fetchDataAndDisplay(4, selectedDate);

        buttonML.classList.remove("selected");
        buttonTL.classList.remove("selected");
        buttonNL.classList.add("selected");
    }
});


function fetchDataAndDisplay(columnIndex, selectedDate) {
    fetch(googleSheetsUrl)
    .then(function (response) {
        return response.text(); // Obtener el texto de la respuesta
    })
    .then(function (data) {
        // Elimina los primeros 47 caracteres y los dos últimos caracteres
        const jsonData = data.slice(47, -2);

        // Convierte la cadena en JSON
        const parsedData = JSON.parse(jsonData);
        
         // Encuentra la posición en el array de objetos donde la fecha coincide
         const rowIndex = parsedData.table.rows.findIndex(function (row) {
            return row.c[1].f === selectedDate;
        });

         const startIndex = rowIndex;

        // Verifica si el índice de inicio es válido
        if (startIndex >= 0 && startIndex < parsedData.table.rows.length) {
            //console.log("index: "+ rowIndex);

            // Inicializa un array para almacenar los valores de la columna 2 a partir del índice
            const mlColumnValues = [];

            // Recorre el array a partir del índice proporcionado
            for (let i = startIndex; i < parsedData.table.rows.length; i++) {
                const row = parsedData.table.rows[i];
                // Asegúrate de que la fila tenga la propiedad 'c' y 'v' en la columna 2
                if (row.c && row.c[columnIndex] && row.c[columnIndex].v !== null) {
                    const mlValue = row.c[columnIndex].v;
                    mlColumnValues.push(mlValue);
                }
            }
            
            // Filtra los números repetidos (al menos 2 veces)
            const repeatedNumbers = {};
            mlColumnValues.forEach(function (number) {
                if (repeatedNumbers[number]) {
                    repeatedNumbers[number]++;
                } else {
                    repeatedNumbers[number] = 1;
                }
            });

            // Crear un elemento de cuadrícula para cada número con repeticiones >= 2
            const gridContainer = document.getElementById('gridContainer');
            gridContainer.innerHTML = '';

            for (const number in repeatedNumbers) {
                if (repeatedNumbers[number] >= 2) {
                    const gridItem = document.createElement('div');

                  
                    gridItem.classList.add('gridItem', 'unread');
                    gridItem.innerHTML = number < 10 ? `0${number}` : number.toString(); //number;//gridItem.innerHTML = `${number} (${repeatedNumbers[number]})`;
                    gridItem.setAttribute('data-unread-count', repeatedNumbers[number]);
                    gridContainer.appendChild(gridItem);
                }
            }
        } else {
            console.log('Índice de inicio no válido.');
        }
    })
    .catch(function (error) {
        // Maneja errores de la solicitud.
        console.error(error);
    });
}
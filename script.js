const googleSheetsUrl = "https://docs.google.com/spreadsheets/d/1HsyO8Jt7s3zegg7p47T-6YI80zC3m38zs5IV7CjzaWM/gviz/tq?tqx=out:json&gid=1712153455"; //"URL_GENERADA_POR_GOOGLE_SHEETS"

const btnFetchDataML = document.getElementById('fetchDataML');
const btnFetchDataTL = document.getElementById('fetchDataTL');
const btnFetchDataNL = document.getElementById('fetchDataNL');

window.addEventListener('load', function () {
    // Cuando el documento se carga completamente, se ejecutará este código.
    btnHome.classList.add("selected");
    btnRepeatedNumbers.classList.remove("selected");
    btnSelectedNumbers.classList.remove("selected");
});

// Agrega un evento click a los botones - Fetch Data
// Llama a la función processMissingNumbers con los datos JSON obtenidos
btnFetchDataML.addEventListener('click', function () {
    processMissingNumbers(2); // Accede a la columna "C" y obtén sus valores

    btnFetchDataML.classList.add("selected");
    btnFetchDataTL.classList.remove("selected");
    btnFetchDataNL.classList.remove("selected");
});

btnFetchDataTL.addEventListener('click', function () {
    processMissingNumbers(3); // Accede a la columna "D" y obtén sus valores

    btnFetchDataTL.classList.add("selected");
    btnFetchDataML.classList.remove("selected");
    btnFetchDataNL.classList.remove("selected");
});

btnFetchDataNL.addEventListener('click', function () {
    processMissingNumbers(4); // Accede a la columna "E" y obtén sus valores

    btnFetchDataNL.classList.add("selected");
    btnFetchDataML.classList.remove("selected");
    btnFetchDataTL.classList.remove("selected");
});


function processMissingNumbers(col) {
    fetch(googleSheetsUrl)
        .then(function (response) {
            return response.text(); // Obtener el texto de la respuesta
        })
        .then(function (data) {
            // Elimina los primeros 47 caracteres y los dos últimos caracteres
            const jsonData = data.slice(47, -2);

            // Convierte la cadena en JSON
            const parsedData = JSON.parse(jsonData);

            // Accede a la columna "ML" y obtén sus valores
            const mlColumn = parsedData.table.rows.map(function (row) {
                return row.c[col] ? row.c[col].v : null;
            });

            // Genera una lista de números del 0 al 99
            const allNumbers = Array.from({ length: 100 }, function (_, i) {
                return i;
            });

            // Encuentra los números faltantes
            const missingNumbers = allNumbers.filter(function (num) {
                return !mlColumn.includes(num);
            });

            // Divide los números faltantes en bloques de diez
            const blocksOfTen = [];
            for (let i = 0; i < missingNumbers.length; i += 10) {
                blocksOfTen.push(missingNumbers.slice(i, i + 10));
            }

            // Formatea los valores de un solo dígito a dos dígitos
            const formattedBlocks = blocksOfTen.map(function (block) {
                return block.map(function (value) {
                    return value < 10 ? `0${value}` : value.toString();
                });
            });

            // Muestra los números faltantes en el elemento con id "missingNumbers" en el HTML
            const missingNumbersElement = document.getElementById('missingNumbers');
            missingNumbersElement.innerHTML = '';
            formattedBlocks.forEach(function (block) {
                const blockString = block.join(', ');
                const blockDiv = document.createElement('div');
                blockDiv.textContent = blockString;
                missingNumbersElement.appendChild(blockDiv);
            });
        })
        .catch(function (error) {
            // Maneja errores de la solicitud.
            console.error(error);
        });
}
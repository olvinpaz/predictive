const googleSheetsUrl = "https://docs.google.com/spreadsheets/d/1HsyO8Jt7s3zegg7p47T-6YI80zC3m38zs5IV7CjzaWM/gviz/tq?tqx=out:json&gid=1712153455"; //"URL_GENERADA_POR_GOOGLE_SHEETS"

window.addEventListener('load', function () {
    const mlButton = document.getElementById('mlButton');
    const alButton = document.getElementById('alButton');
    const nlButton = document.getElementById('nlButton');

    // Cuando el documento se carga completamente, se ejecutará este código.
    mlButton.classList.add("selected");
    alButton.classList.remove("selected");
    nlButton.classList.remove("selected");

    // Añade la propiedad data-value="" pare definir el index de cada columna en la que se buscaran los datos de la fuente.
    // Column Index: "2" for Column ML, "3" for Column AL, "4" for Column NL from data src.
    const colindex = "coli-" // prefijo para comprender el valor, este se elimina cuando cuando se pasa el parametro "culumnIndex" a la funcion que realiza el proceso de la informacion.
    mlButton.setAttribute("data-value", colindex+"2");
    alButton.setAttribute("data-value", colindex+"3");
    nlButton.setAttribute("data-value", colindex+"4");

    const selectedDate = datePicker.value;
    const selectedButton = document.querySelector('button.opt-button.selected');
    if (selectedButton) {
        const buttonValue = selectedButton.getAttribute('data-value');
        const columnIndex = buttonValue.slice(-1);
        fetchDataAndDisplay(columnIndex, selectedDate);
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


    // Agrega un evento de cambio al datePicker
    datePicker.addEventListener('change', function () {
        const selectedDate = datePicker.value;
        const selectedButton = document.querySelector('button.opt-button.selected');
        if (selectedButton) {
            const buttonValue = selectedButton.getAttribute('data-value');
            const columnIndex = buttonValue.slice(-1);
            fetchDataAndDisplay(columnIndex, selectedDate);
        }
    });


    // Obten el nodo por su ID
    const optionButtonsNode = document.getElementById("repeatControlButtons");

    // Selecciona todos los botones dentro del nodo
    const optionButtonsChildren = optionButtonsNode.querySelectorAll("button");

    // Agrega un evento de clic a los botones
    optionButtonsChildren.forEach(function (button) {
        button.addEventListener('click', function () {
            const selectedDate = datePicker.value;
            const buttonValue = button.getAttribute('data-value');
            const columnIndex = buttonValue.slice(-1); // Obtiene el indice de la columna definido en el "data-value="" 2, 3 o 4"
            fetchDataAndDisplay(columnIndex, selectedDate);
        });
    });

    // Agrega un estilo para resaltar el botón seleccionado
    optionButtonsChildren.forEach(function (button) {
        button.addEventListener('click', function () {
            optionButtonsChildren.forEach(function (btn) {
                btn.classList.remove('selected');
            });
            button.classList.add('selected');
        });
    });
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

            const totalNumbers = document.getElementById('totalNumbers');
            let count = 0;
            
            for (const number in repeatedNumbers) {
                if (repeatedNumbers[number] > 0 && repeatedNumbers[number] <= 1) {
                    const gridItem = document.createElement('div');

                    // Total numbers
                    count++;

                    gridItem.classList.add('gridItem', 'unread');
                    gridItem.innerHTML = number < 10 ? `0${number}` : number.toString();
                    gridItem.setAttribute('data-unread-count', repeatedNumbers[number]);
                    gridContainer.appendChild(gridItem);
                }
            }

            // Total numeros
            totalNumbers.innerHTML = "Total: "+ count ;

        } else {
            console.log('Índice de inicio no válido.');
        }
    })
    .catch(function (error) {
        // Maneja errores de la solicitud.
        console.error(error);
    });
}
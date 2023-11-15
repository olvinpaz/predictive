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
          
            // Inicializa un array para almacenar los valores de la columna 2 a partir del índice
            const columnValues = [];

            // Recorre el array a partir del índice proporcionado
            for (let i = startIndex; i < parsedData.table.rows.length; i++) {
                const row = parsedData.table.rows[i];
                // Asegúrate de que la fila tenga la propiedad 'c' y 'v' en la columna indicada
                if (row.c && row.c[columnIndex] && row.c[columnIndex].v !== null) {
                    const value = row.c[columnIndex].v;
                    columnValues.push(value);
                }
            }

            // Genera una lista de números del 0 al 99
            const allNumbers = Array.from({ length: 100 }, function (_, i) {
                return i;
            });

            // Encuentra los números faltantes
            const missingNumbers = allNumbers.filter(function (num) {
                return !columnValues.includes(num);
            });

            //console.log("Numeros Faltantes: ",missingNumbers);


            // Muestra los números faltantes en el elemento con id "missingNumbers" en el HTML
            const gridContainer = document.getElementById('gridContainer');
            gridContainer.innerHTML = '';

            const totalNumbers = document.getElementById('totalNumbers');
            let count = 0;

            // Crear un elemento de cuadrícula para cada número
            missingNumbers.forEach(function (block) {
                const gridItem = document.createElement('div');
                gridItem.classList.add('gridItem');
                gridItem.innerHTML = block < 10 ? `0${block}` : block.toString();
                gridContainer.appendChild(gridItem);

                // Total numbers
                count++;
            });
          
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























/*
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
*/
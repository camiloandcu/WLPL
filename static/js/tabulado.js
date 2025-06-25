let numVars = 2;
let contadorRestricciones = 0;
const maxRestricciones = 8;
const maxVars = 5;

function agregarVariable() {
    if (numVars >= maxVars) {
        alert(`Máximo ${maxVars} variables permitidas`);
        return;
    }
    numVars++;
    // Agregar input a la función objetivo
    const masVars = document.getElementById('mas-vars');
    const input = document.createElement('input');
    input.type = 'number';
    input.step = '1';
    input.value = '1';
    input.placeholder = `c${numVars}`;
    input.className = 'coef-c';
    input.setAttribute('aria-label', `Coeficiente c${numVars} de la función objetivo`);
    input.id = `c${numVars}`;
    masVars.appendChild(document.createTextNode(' + '));
    masVars.appendChild(input);
    masVars.appendChild(document.createElement('span')).innerHTML = `x<sub>${numVars}</sub>`;
    // Actualizar restricciones existentes
    actualizarRestriccionesParaVariables();
}

function actualizarRestriccionesParaVariables() {
    const restricciones = document.querySelectorAll('.constraint-item');
    restricciones.forEach((div) => {
        const row = div.querySelector('.form-row');
        // Elimina los inputs extra si hay menos variables
        while (row.querySelectorAll('.coef-a').length > numVars) {
            row.removeChild(row.querySelectorAll('.coef-a')[row.querySelectorAll('.coef-a').length-1].nextSibling); // elimina xN
            row.removeChild(row.querySelectorAll('.coef-a')[row.querySelectorAll('.coef-a').length-1]);
            if (row.querySelectorAll('.coef-a').length > 1) row.removeChild(row.querySelectorAll('.coef-a')[row.querySelectorAll('.coef-a').length-1].previousSibling); // elimina +
        }
        // Agrega inputs si faltan
        let currentVars = row.querySelectorAll('.coef-a').length;
        for (let i = currentVars + 1; i <= numVars; i++) {
            row.insertBefore(document.createTextNode(' + '), row.querySelector('.restriccion-final'));
            const input = document.createElement('input');
            input.type = 'number';
            input.step = '1';
            input.value = '1';
            input.placeholder = `a${i}`;
            input.className = 'coef-a';
            input.setAttribute('data-var', i);
            row.insertBefore(input, row.querySelector('.restriccion-final'));
            row.insertBefore(document.createElement('span'), row.querySelector('.restriccion-final')).innerHTML = `x<sub>${i}</sub>`;
        }
    });
}

function agregarRestriccion() {
    if (contadorRestricciones >= maxRestricciones) {
        alert(`Máximo ${maxRestricciones} restricciones permitidas`);
        return;
    }
    contadorRestricciones++;
    const container = document.getElementById('restricciones-container');
    const restriccionDiv = document.createElement('div');
    restriccionDiv.className = 'constraint-item';
    restriccionDiv.id = `restriccion-${contadorRestricciones}`;
    // Construye la fila de inputs para la restricción
    let html = `<div class="form-row">`;
    for (let i = 1; i <= numVars; i++) {
        if (i > 1) html += ' + ';
        html += `<input type="number" step="1" value="1" placeholder="a${i}" class="coef-a" data-var="${i}">`;
        html += `<span>x<sub>${i}</sub></span>`;
    }
    html += `<span class="restriccion-final"> ≤ </span>
        <input type="number" step="1" value="1" placeholder="b" class="coef-b">
        <button class="btn btn-danger" onclick="eliminarRestriccion(${contadorRestricciones})">🗑️</button>
    </div>`;
    restriccionDiv.innerHTML = html;
    container.appendChild(restriccionDiv);
    actualizarContador();
}

function eliminarRestriccion(id) {
    const elemento = document.getElementById(`restriccion-${id}`);
    if (elemento) {
        elemento.remove();
        contadorRestricciones--;
        actualizarContador();
    }
}

function actualizarContador() {
    document.getElementById('contador-restricciones').textContent = 
        `Restricciones: ${contadorRestricciones || 0}/${maxRestricciones}`;
}

function obtenerCoeficientes() {
    // Devuelve un array con todos los coeficientes de la función objetivo
    const coefInputs = document.querySelectorAll('.coef-c');
    const coeficientes = [];
    coefInputs.forEach(input => {
        coeficientes.push(parseFloat(input.value));
    });
    return coeficientes;
}

function obtenerRestricciones() {
    const restricciones = [];
    const elementos = document.querySelectorAll('.constraint-item');
    
    elementos.forEach(elemento => {
        const coefInputs = elemento.querySelectorAll('.coef-a');
        const coefs = [];
        coefInputs.forEach(input => {
            coefs.push(parseFloat(input.value));
        });
        const b = elemento.querySelector('.coef-b').value;
        if (coefs.every(v => !isNaN(v)) && b) {
            restricciones.push({
                coefs: coefs,
                b: parseFloat(b)
            });
        }
    });
    
    return restricciones;
}

async function resolverProblema() {
    const c = obtenerCoeficientes();
    const tipo = document.getElementById('tipoOptimizacion').value;
    const restricciones = obtenerRestricciones();

    if (c.some(v => isNaN(v))) {
        mostrarError('Complete los coeficientes de la función objetivo');
        return;
    }

    if (restricciones.length === 0) {
        mostrarError('Agregue al menos una restricción');
        return;
    }

    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('resultados').style.display = 'none';
    document.getElementById('error-mensaje').style.display = 'none';

    try {
        // Hace llamado al servidor para resolver el problema
        const response = await fetch('/resolver/tabulado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                c: c,
                tipo: tipo,
                restricciones: restricciones
            })
        });

        const data = await response.json();
        console.log(data);

        if (data.error) {
            mostrarError(data.error);
        } else {
            mostrarResultados(data);
        }

    } catch (error) {
        mostrarError('Error de conexión: ' + error.message);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function mostrarResultados(data) {
    document.getElementById('resultados').style.display = 'block';

    // Mostrar pasos del método simplex tabulado
    mostrarSimplexTabulado(data);
}

function mostrarSimplexTabulado(verificacion) {
    const pasosDiv = document.getElementById('simplex-tabla-pasos');
    const solucionDiv = document.getElementById('simplex-solucion');
    const sensibilidadDiv = document.getElementById('analisis-sensibilidad');
    pasosDiv.innerHTML = '';
    solucionDiv.innerHTML = '';
    sensibilidadDiv.innerHTML = '';

    if (!verificacion || !verificacion.pasos) {
        pasosDiv.innerHTML = '<em>No se pudo calcular el método tabulado.</em>';
        return;
    }

    verificacion.pasos.forEach(paso => {
        const iterDiv = document.createElement('div');
        iterDiv.className = 'simplex-iter';
        iterDiv.innerHTML = `<div class="simplex-iter-title">Iteración ${paso.iteracion}</div>` +
            tablaSimplexHTML(paso.tabla);
        pasosDiv.appendChild(iterDiv);
    });

    // Solución final
    let sol = verificacion.solucion || {};
    let z = verificacion.z !== undefined ? verificacion.z : '';
    let solStr = Object.entries(sol).map(([k, v]) => `${k} = ${parseFloat(v).toFixed(3)}`).join(', ');
    solucionDiv.innerHTML = `<b>Solución óptima:</b> ${solStr}<br><b>Valor óptimo:</b> Z = ${parseFloat(z).toFixed(3)}`;

    // Análisis de sensibilidad
    if (verificacion.analisis_sensibilidad && verificacion.analisis_sensibilidad.length > 0) {
        let html = `<div class="simplex-sensibilidad">
            <div style="overflow-x:auto;">
            <table class="simplex-table" style="margin-bottom:16px;">
                <thead>
                    <tr>
                        <th>Restricción</th>
                        <th>Valor sombra</th>
                        <th>Mínimo LD</th>
                        <th>Máximo LD</th>
                    </tr>
                </thead>
                <tbody>`;
        verificacion.analisis_sensibilidad.forEach(item => {
            html += `<tr>
                <td>#${item.restriccion}</td>
                <td>${parseFloat(item.valor_sombra).toFixed(4)}</td>
                <td>${item.min !== undefined && item.min !== null ? item.min : 'N/A'}</td>
                <td>${item.max !== undefined && item.max !== null ? item.max : 'N/A'}</td>
            </tr>`;
        });
        html += `</tbody></table></div>
            <b>Análisis de sensibilidad (valores sombra):</b>
            <div style="margin: 10px 0 18px 0; font-size: 14px;">
                El valor sombra indica cuánto varía el valor óptimo Z si se incrementa en una unidad el lado derecho de la restricción.<br><br> 
                Los valores mínimo y máximo indican el rango en el que puedes mover el lado derecho sin cambiar la base óptima (si está disponible).
            </div>
            <ul>`;
        verificacion.analisis_sensibilidad.forEach(item => {
            html += `<li><b>${item.descripcion}</b><br><span style="color:#555;">${item.efecto}</span></li>`;
        });
        html += `</ul></div>`;
        sensibilidadDiv.innerHTML = html;
    }
}

function tablaSimplexHTML(tabla) {
    // tabla: {columns: [...], index: [...], data: [[...], ...]}
    if (!tabla || !tabla.columns || !tabla.data) return '';
    let html = '<table class="simplex-table"><thead><tr>';
    html += tabla.columns.map(col => `<th>${col}</th>`).join('');
    html += '</tr></thead><tbody>';
    tabla.data.forEach(row => {
        html += '<tr>' + row.map(cell => `<td>${typeof cell === 'number' ? cell.toFixed(3) : cell}</td>`).join('') + '</tr>';
    });
    html += '</tbody></table>';
    return html;
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-mensaje');
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
}

// Agregar restricciones iniciales
window.onload = function() {
    agregarRestriccion();
    agregarRestriccion();
};
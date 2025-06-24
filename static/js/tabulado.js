let contadorRestricciones = 0;
const maxRestricciones = 8;

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
    
    restriccionDiv.innerHTML = `
        <div class="form-row">
            <input type="number" step="0.1" value="1" placeholder="a₁" class="coef-a1">
            <span>x₁ +</span>
            <input type="number" step="0.1" value="1" placeholder="a₂" class="coef-a2">
            <span>x₂ ≤</span>
            <input type="number" step="0.1" value="1" placeholder="b" class="coef-b">
            <button class="btn btn-danger" onclick="eliminarRestriccion(${contadorRestricciones})">🗑️</button>
        </div>
    `;
    
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
        `Restricciones: ${contadorRestricciones}/${maxRestricciones}`;
}

function obtenerRestricciones() {
    const restricciones = [];
    const elementos = document.querySelectorAll('.constraint-item');
    
    elementos.forEach(elemento => {
        const a1 = elemento.querySelector('.coef-a1').value;
        const a2 = elemento.querySelector('.coef-a2').value;
        const b = elemento.querySelector('.coef-b').value;
        
        if (a1 && a2 && b) {
            restricciones.push({
                a1: parseFloat(a1),
                a2: parseFloat(a2),
                b: parseFloat(b)
            });
        }
    });
    
    return restricciones;
}

async function resolverProblema() {
    const c1 = document.getElementById('c1').value;
    const c2 = document.getElementById('c2').value;
    const tipo = document.getElementById('tipoOptimizacion').value;
    const restricciones = obtenerRestricciones();

    if (!c1 || !c2) {
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
                c1: parseFloat(c1),
                c2: parseFloat(c2),
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
    pasosDiv.innerHTML = '';
    solucionDiv.innerHTML = '';

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
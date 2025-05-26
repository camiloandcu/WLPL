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
        const response = await fetch('/resolver', {
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

    // Solución gráfica
    if (data.punto_optimo && data.valor_optimo !== null) {
        document.getElementById('solucion-grafico').innerHTML = 
            `x₁ = ${data.punto_optimo[0].toFixed(3)}, x₂ = ${data.punto_optimo[1].toFixed(3)}<br>
            Valor óptimo: f* = ${data.valor_optimo.toFixed(3)}`;
    } else {
        document.getElementById('solucion-grafico').innerHTML = 'No se encontró solución factible';
    }

    // Solución analítica
    if (data.solucion_analitica) {
        document.getElementById('solucion-analitica').innerHTML = 
            `x₁ = ${data.solucion_analitica.punto[0].toFixed(3)}, x₂ = ${data.solucion_analitica.punto[1].toFixed(3)}<br>
            Valor óptimo: f* = ${data.solucion_analitica.valor.toFixed(3)}`;
    } else {
        document.getElementById('solucion-analitica').innerHTML = 'No disponible';
    }

    // Vértices
    const verticesContainer = document.getElementById('vertices-lista');
    verticesContainer.innerHTML = '';
    
    if (data.vertices && data.vertices.length > 0) {
        data.vertices.forEach((vertice, index) => {
            const div = document.createElement('div');
            div.className = 'vertex-item';
            div.innerHTML = `V${index + 1}: (${vertice[0].toFixed(3)}, ${vertice[1].toFixed(3)})`;
            verticesContainer.appendChild(div);
        });
    } else {
        verticesContainer.innerHTML = 'No se encontraron vértices';
    }

    // Gráfico
    if (data.imagen) {
        const img = document.getElementById('grafico');
        img.src = `data:image/png;base64,${data.imagen}`;
        img.style.display = 'block';
    }
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
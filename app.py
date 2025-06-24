from flask import Flask, render_template, request, jsonify
from grafico import resolver_problema_grafico
from tabulado import resolver_problema_tabulado
import json 

app = Flask(__name__)

app.config['MAX_CONSTRAINTS'] = 8  

@app.route('/grafico')
def grafico_index():
    return render_template('grafico.html', max_constraints=app.config['MAX_CONSTRAINTS'])

@app.route('/tabulado')
def tabulado_index():
    return render_template('tabulado.html', max_constraints=app.config['MAX_CONSTRAINTS'])

@app.route('/resolver/grafico', methods=['POST'])
def grafico():
    try:
        data = request.json

        c1 = float(data['c1'])
        c2 = float(data['c2'])
        maximizar = data['tipo'] == 'maximizar'

        restricciones = data['restricciones']

        
        if(len(restricciones) > app.config['MAX_CONSTRAINTS']):
            return jsonify({'error': f'Máximo {app.config["MAX_CONSTRAINTS"]} restricciones permitidas'})

        c = [c1, c2]
        A = []
        b = []

        for rest in restricciones: 
            A.append([float(rest['a1']), float(rest['a2'])])
            b.append(float(rest['b']))

        if not A: 
            return jsonify({'error': 'Debe ingresar al menos una restricción'})
    
        # Determinar límites del gráfico 
        max_b = max(b) if b else 10
        xlim = (0, max_b * 1.2)
        ylim = (0, max_b * 1.2)

        # Resolver problema
        resultado = resolver_problema_grafico(
            c, A, b, maximizar, xlim, ylim)
        
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': f'Error al resolver: {str(e)}'})

@app.route('/resolver/tabulado', methods=['POST'])
def tabulado():
    try:
        data = request.json

        c = data['c']
        maximizar = data['tipo'] == 'maximizar'
        restricciones = data['restricciones']

        if(len(restricciones) > app.config['MAX_CONSTRAINTS']):
            return jsonify({'error': f'Máximo {app.config["MAX_CONSTRAINTS"]} restricciones permitidas'})
        elif not restricciones:
            return jsonify({'error': 'Debe ingresar al menos una restricción'})

        A = []
        b = []

        for rest in restricciones: 
            A.append(rest['coefs'])
            b.append(rest['b'])

        # Resolver problema gráfico
        resultado = resolver_problema_tabulado(
            c, A, b, maximizar)

        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': f'Error al resolver: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True)
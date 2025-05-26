import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import linprog
from itertools import combinations
import base64
import io

def encontrar_interseccion(coef1, coef2, c1, c2):
  '''
  Encuentra la intersección entre dos líneas ax + by = c

  Args:
    coef1: Coeficientes de la primera línea (a, b)
    coef2: Coeficientes de la segunda línea (a, b)
    c1, c2: Términos independientes

  Returns:
    Interseccion de las líneas
  '''

  A = np.array([coef1, coef2])
  b = np.array([c1, c2])

  try:
    det = np.linalg.det(A)
    if abs(det) < 1e-10: # Determinante se asemeja a 0 (aproximación)
      return None # Las lineas son paralelas
    else:
      return np.linalg.solve(A, b) # Devolver intersección
  except:
    return None
  
def es_factible(punto, A, b):
  '''
  Verifica si un punto está en la región factible

  Args:
    punto: Punto a verificar
    A: Matriz de Coeficientes Tecnológicos
    b: Vector de Recursos
  '''

  x, y = punto

  # Verificar restricciones de no negatividad
  if x < 0 or y < 0:
    return False

  # Verificar restricciones de desigualdad
  for i in range(len(A)):
    if np.dot(A[i], punto) > b[i]:
      return False

  return True

def es_factible(punto, A, b):
  '''
  Verifica si un punto está en la región factible

  Args:
    punto: Punto a verificar
    A: Matriz de Coeficientes Tecnológicos
    b: Vector de Recursos
  '''

  x, y = punto

  # Verificar restricciones de no negatividad
  if x < 0 or y < 0:
    return False

  # Verificar restricciones de desigualdad
  for i in range(len(A)):
    if np.dot(A[i], punto) > b[i]:
      return False

  return True

def encontrar_vertices(A, b, xlim, ylim):
  '''
  Encuentra los vértices de la región factible

  Args:
    A: Matriz de Coeficientes Tecnológicos
    b: Vector de Recursos
    xlim, ylim: Límites de las variables de decisión

  Returns:
    Vertices de la región factible
  '''
  vertices = []

  # Crear todas las líneas de restricción incluyendo ejes
  lineas = []

  # Restricciones funcionales
  for i in range(len(A)):
    lineas.append((A[i], b[i]))

  # Restricciones de signo
  lineas.append(([1, 0], 0)) # x = 0
  lineas.append(([0, 1], 0)) # y = 0

  for i,j in combinations(range(len(lineas)), 2):
    coef1, b1 = lineas[i]
    coef2, b2 = lineas[j]

    interseccion = encontrar_interseccion(coef1, coef2, b1, b2)

    if interseccion is not None:
      x, y = interseccion

      # Verificar si está dentro de los límites
      if xlim[0] <= x <= xlim[1] and ylim[0] <= y <= ylim[1]:
        if es_factible((x, y), A, b):
          vertices.append((x, y))

  # Eliminar duplicados
  vertices = list(set(vertices))

  return vertices

def evaluar_objetivo(punto, c, maximizar=True):
    """
    Evalúa la función objetivo en un punto

    Args:
        punto: coordenadas [x, y]
        c: coeficientes de función objetivo
        maximizar: True para maximización, False para minimización

    Returns:
        valor de la función objetivo
    """
    valor = np.dot(c, punto)
    return valor if maximizar else -valor

def evaluar_objetivo(punto, c, maximizar=True):
    """
    Evalúa la función objetivo en un punto

    Args:
        punto: coordenadas [x, y]
        c: coeficientes de función objetivo
        maximizar: True para maximización, False para minimización

    Returns:
        valor de la función objetivo
    """
    valor = np.dot(c, punto)
    return valor if maximizar else -valor

def resolver_problema_grafico(c, A, b, maximizar=True, xlim=(0,10), ylim=(0,10), figsize=(12,8)):
  """
  Generar visualización del método gráfico

  Args:
    c: Vector de coeficientes de costo
    A: Matriz de coeficientes tecnológicos
    b: Vector de recursos
    maximizar: Tipo de optimización
    xlim, ylim: Límites del gráfico
    figsize: Tamaño del gráfico

  Returns:
    punto_optimo, valor_optimo
  """
  fig, ax = plt.subplots(figsize=figsize)

  # Crear una malla de puntos (400x400)
  x = np.linspace(xlim[0], xlim[1], 400)
  y = np.linspace(ylim[0], ylim[1], 400)
  X, Y = np.meshgrid(x, y)

  # Hallar la región factible
  factible = np.ones_like(X, dtype=bool) # Inicializar
  factible &= (X >= 0) & (Y >= 0) # Restricción de signo

  # Restricciones funcionales
  for i in range(len(A)):
    factible &= A[i][0] * X + A[i][1] * Y <= b[i]

  # Sombrear región factible
  ax.contourf(X, Y, factible.astype(int), levels=[0,1], colors=['white', 'lightblue'], alpha=0.5)

  # Dibujar lineas de restricción
  for i, (coefs,b_i) in enumerate(zip(A,b)):
    if coefs[1] != 0:
      y_linea = (b_i - coefs[0] * x) / coefs[1]
      mascara = (y_linea >= ylim[0]) & (y_linea <= ylim[1])
      ax.plot(x[mascara], y_linea[mascara], 'r--', linewidth=2,
              label=f'Restricción {i+1}: {coefs[0]:.1f}x₁ + {coefs[1]:.1f}x₂ ≤ {b_i:.1f}')

    else:
      x_linea = b_i / coefs[0]
      if xlim[0] <= x_linea <= xlim[1]:
        ax.axvline(x=x_linea, color='r', linewidth=2,
                   label=f'Restricción {i+1}: {coefs[0]:.1f}x₁ ≤ {b_i:.1f}')

  # Encontrar y evaluar vértices para encontrar punto optimo
  vertices = encontrar_vertices(A, b, xlim, ylim)
  punto_optimo = None
  valor_optimo = None

  if vertices:
        valores_vertices = []
        for vertice in vertices:
            valor = evaluar_objetivo(vertice, c, maximizar)
            valores_vertices.append(valor)
            ax.plot(vertice[0], vertice[1], 'ro', markersize=8)
            ax.annotate(f'({vertice[0]:.2f}, {vertice[1]:.2f})\nf = {valor:.2f}',
                       (vertice[0], vertice[1]), xytext=(5, 5),
                       textcoords='offset points', fontsize=9,
                       bbox=dict(boxstyle='round,pad=0.3', facecolor='yellow', alpha=0.7))

        # Encontrar solución óptima
        if maximizar:
            idx_opt = np.argmax(valores_vertices)
        else:
            idx_opt = np.argmin(valores_vertices)

        punto_optimo = vertices[idx_opt]
        valor_optimo = valores_vertices[idx_opt]

        # Resaltar punto óptimo
        ax.plot(punto_optimo[0], punto_optimo[1], 'go', markersize=12,
               label=f'Óptimo: ({punto_optimo[0]:.2f}, {punto_optimo[1]:.2f})')

        # Dibujar líneas de isoutilidad
        vals_obj = np.linspace(min(valores_vertices), max(valores_vertices), 5)
        for i, val in enumerate(vals_obj):
            if c[1] != 0:
                y_obj = (val - c[0] * x) / c[1]
                mascara = (y_obj >= ylim[0]) & (y_obj <= ylim[1])
                if np.any(mascara):
                    label_iso = 'Líneas de isoutilidad' if i == 0 else None
                    ax.plot(x[mascara], y_obj[mascara], 'g--', alpha=0.7, linewidth=1,
                            label = label_iso)

  # Configurar gráfico
  ax.set_xlim(xlim)
  ax.set_ylim(ylim)
  ax.set_xlabel('x₁')
  ax.set_ylabel('x₂')
  ax.grid(True, alpha=0.3)
  ax.legend()

  tipo_objetivo = "Maximizar" if maximizar else "Minimizar"
  ax.set_title(f'{tipo_objetivo}: f(x₁,x₂) = {c[0]:.1f}x₁ + {c[1]:.1f}x₂')

  plt.tight_layout()

  # Guardar gráfico a base64  
  img_buffer = io.BytesIO()
  plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
  img_buffer.seek(0)
  img_base64 = base64.b64encode(img_buffer.read()).decode()
  plt.close()

  return {
    'imagen': img_base64,
    'vertices': vertices,
    'punto_optimo': list(punto_optimo) if punto_optimo is not None else None,
    'valor_optimo': float(valor_optimo) if valor_optimo is not None else None
}

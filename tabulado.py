import numpy as np
import pandas as pd

def resolver_problema_tabulado(c, A, b, maximizar=True):
    n_vars = len(c)
    n_constraints = len(A)
    c = np.array(c)
    A = np.array(A)
    b = np.array(b)

    if not maximizar:
        c = -c  # Minimización como maximización

    total_vars = n_vars + n_constraints
    table = np.zeros((n_constraints + 1, total_vars + 2))

    # Restricciones
    table[:-1, :n_vars] = A
    table[:-1, n_vars:n_vars + n_constraints] = np.eye(n_constraints)
    table[:-1, -1] = b

    # Función objetivo
    table[-1, :n_vars] = -c if maximizar else c

    basic_vars = [f"s{i+1}" for i in range(n_constraints)]
    pasos = []

    def snapshot(table, basic_vars, iteracion):
        cols = [f"x{i+1}" for i in range(n_vars)] + \
               [f"s{i+1}" for i in range(n_constraints)] + ["Z", "RHS"]
        df = pd.DataFrame(table, columns=cols)
        df.insert(0, "BV", basic_vars + ["Z"])
        pasos.append({
            "iteracion": iteracion,
            "tabla": df.to_dict(orient="split")
        })

    iteracion = 0
    snapshot(table.copy(), basic_vars.copy(), iteracion)

    while True:
        last_row = table[-1, :-1]
        entering = np.argmin(last_row)
        if last_row[entering] >= 0:
            break

        ratios = []
        for i in range(len(table) - 1):
            if table[i][entering] <= 0:
                ratios.append(np.inf)
            else:
                ratios.append(table[i][-1] / table[i][entering])

        if all(r == np.inf for r in ratios):
            break

        leaving = np.argmin(ratios)
        basic_vars[leaving] = f"x{entering+1}"

        # Pivot
        table[leaving] = table[leaving] / table[leaving][entering]
        for i in range(len(table)):
            if i != leaving:
                table[i] -= table[i][entering] * table[leaving]
        iteracion += 1
        snapshot(table.copy(), basic_vars.copy(), iteracion)

    # Solución
    solucion = {var: 0 for var in [f"x{i+1}" for i in range(n_vars)]}
    for i, var in enumerate(basic_vars):
        if var in solucion:
            solucion[var] = table[i, -1]
    z = table[-1, -1]

    return {
        "pasos": pasos,
        "solucion": solucion,
        "z": z
    }
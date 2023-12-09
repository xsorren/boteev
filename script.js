// Variables globales
let impuesto_tasa, EV_SALES, EV_EBITDA, EV_EBIT, descuento_liquidez, rango_respuesta;

function calcularValores(inputs) {
    // Paso 1: Cálculo de ventas futuras
    let ventas_a1 = inputs.ventas_a1;
    let crecimiento_anual = inputs.crecimiento_anual;
    let ventas_a2 = (1 + crecimiento_anual) * ventas_a1;
    let ventas_a3 = (1 + crecimiento_anual) * ventas_a2;
    let ventas_a4 = (1 + crecimiento_anual) * ventas_a3;
    let ventas_a5 = (1 + crecimiento_anual) * ventas_a4;

    // Paso 2: Cálculo de costos y gastos
    let margen_operacion, costos_gastos_a1, costos_gastos_a2, costos_gastos_a3, costos_gastos_a4, costos_gastos_a5;
    if (inputs.slider === 0) {
        margen_operacion = inputs.margen_operacion;
        costos_gastos_a1 = ((margen_operacion - 1) * ventas_a1) * -1;
    } else {
        costos_gastos_a1 = inputs.costos_gastos_a1;
        margen_operacion = ((costos_gastos_a1 / ventas_a1) * -1) + 1;
    }
    costos_gastos_a2 = ((margen_operacion - 1) * ventas_a2) * -1;
    costos_gastos_a3 = ((margen_operacion - 1) * ventas_a3) * -1;
    costos_gastos_a4 = ((margen_operacion - 1) * ventas_a4) * -1;
    costos_gastos_a5 = ((margen_operacion - 1) * ventas_a5) * -1;

    // Paso 3: Cálculo de impuestos
    let impuesto_a1 = (ventas_a1 - costos_gastos_a1) * impuesto_tasa;
    let impuesto_a2 = (ventas_a2 - costos_gastos_a2) * impuesto_tasa;
    let impuesto_a3 = (ventas_a3 - costos_gastos_a3) * impuesto_tasa;
    let impuesto_a4 = (ventas_a4 - costos_gastos_a4) * impuesto_tasa;
    let impuesto_a5 = (ventas_a5 - costos_gastos_a5) * impuesto_tasa;

    // Paso 4: Cálculo de CAPEX, depreciación y otros valores
    let capex_a1 = inputs.capex_a1;
    let capex_incremento = inputs.capex_incremento;
    let capex_a2 = (1 + capex_incremento) * capex_a1;
    let capex_a3 = (1 + capex_incremento) * capex_a2;
    let capex_a4 = (1 + capex_incremento) * capex_a3;
    let capex_a5 = (1 + capex_incremento) * capex_a4;

    let depreciacion_a1 = inputs.depreciacion_a1;
    let depreciacion_a2 = (1 + capex_incremento) * depreciacion_a1;
    let depreciacion_a3 = (1 + capex_incremento) * depreciacion_a2;
    let depreciacion_a4 = (1 + capex_incremento) * depreciacion_a3;
    let depreciacion_a5 = (1 + capex_incremento) * depreciacion_a4;

    let flea_1, flea_2, flea_3, flea_4, flea_5, eBIT, eBITDA;
    if (inputs.depreciacion_bool === 0) {
        flea_1 = ventas_a1 - (costos_gastos_a1 + (impuesto_a1 + capex_a1)) + depreciacion_a1;
        flea_2 = ventas_a2 - (costos_gastos_a2 + (impuesto_a2 + capex_a2)) + depreciacion_a2;
        flea_3 = ventas_a3 - (costos_gastos_a3 + (impuesto_a3 + capex_a3)) + depreciacion_a3;
        flea_4 = ventas_a4 - (costos_gastos_a4 + (impuesto_a4 + capex_a4)) + depreciacion_a4;
        flea_5 = ventas_a5 - (costos_gastos_a5 + (impuesto_a5 + capex_a5)) + depreciacion_a5;
        eBIT = ventas_a1 - costos_gastos_a1;
        eBITDA = eBIT + depreciacion_a1;
    } else {
        flea_1 = ventas_a1 - (costos_gastos_a1 + (impuesto_a1 + capex_a1)) - depreciacion_a1;
        flea_2 = ventas_a2 - (costos_gastos_a2 + (impuesto_a2 + capex_a2)) - depreciacion_a2;
        flea_3 = ventas_a3 - (costos_gastos_a3 + (impuesto_a3 + capex_a3)) - depreciacion_a3;
        flea_4 = ventas_a4 - (costos_gastos_a4 + (impuesto_a4 + capex_a4)) - depreciacion_a4;
        flea_5 = ventas_a5 - (costos_gastos_a5 + (impuesto_a5 + capex_a5)) - depreciacion_a5;
        eBIT = ventas_a1 - costos_gastos_a1;
        eBITDA = eBIT - depreciacion_a1;
    }

    let valor_promedio_ventas = (ventas_a1 * EV_SALES) * descuento_liquidez;
    let valor_promedio_ebitda = (eBITDA * EV_EBITDA) * descuento_liquidez;
    let valor_promedio_ebit = (eBIT * EV_EBIT) * descuento_liquidez;
    let valor_promedio_multiplos = (valor_promedio_ventas + valor_promedio_ebitda + valor_promedio_ebit) / 3;
    let valor_promedio_multiplos_up = (valor_promedio_multiplos * rango_respuesta) + valor_promedio_multiplos;
    let valor_promedio_multiplos_down = ((valor_promedio_multiplos * rango_respuesta) * -1) + valor_promedio_multiplos;

    // Paso 5: Cálculo de valor DCF y valor terminal
    let tasa_descuento = inputs.tasa_descuento;
    let crecimiento_perpetuo = inputs.crecimiento_perpetuo;
    let fleda1 = flea_1;
    let fleda2 = flea_2 / Math.pow((1 + tasa_descuento), 1);
    let fleda3 = flea_3 / Math.pow((1 + tasa_descuento), 2);
    let fleda4 = flea_4 / Math.pow((1 + tasa_descuento), 3);
    let fleda5 = flea_5 / Math.pow((1 + tasa_descuento), 4);
    let valor_terminal = (fleda5 * ((1 + crecimiento_perpetuo) / (tasa_descuento - crecimiento_perpetuo))) / Math.pow((1 + tasa_descuento), 4);
    let valor_DCF = fleda1 + fleda2 + fleda3 + fleda4 + fleda5 + valor_terminal;

    return valor_DCF;
}

// Ejemplo de test
let entradas = {
    ventas_a1: 100000, // ejemplo de valor
    crecimiento_anual: 0.05, // 5% de crecimiento anual
    // ... otros valores de entrada
};
let resultado = calcularValores(entradas);
console.log(resultado);
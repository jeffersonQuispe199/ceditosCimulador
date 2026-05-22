let clientes = [
  {correo:"jeffersin@gmail.com", numero: "0945454", cedula: "1748596603", nombre: "Eduardo", apellido: "Guerrero", ingresos: 1000, egresos: 800 }
];
let creditos = [];
let tasaInteres = 15;
let montoMaximo = 50000; // NUEVO: Variable global con el límite máximo por defecto
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;

// Oculta todas las secciones antes de mostrar la activa
function ocultarSecciones() {
  document.getElementById("parametros").classList.remove("activa");
  document.getElementById("clientes").classList.remove("activa");
  document.getElementById("credito").classList.remove("activa");
  document.getElementById("listaCreditos").classList.remove("activa");
  document.getElementById("contacto").classList.remove("activa");
}
 
// Muestra solo la sección cuyo id recibe como parámetro
function mostrarSeccion(id) {
  ocultarSecciones();
  document.getElementById(id).classList.add("activa");
  
  // Carga inicial automatizada de tablas al cambiar de sección
  if (id === "clientes") {
    pintarClientes();
  }
}

// NUEVO: Reemplaza a guardarTasa para actualizar y validar ambos parámetros a la vez
function guardarParametros() {
  let tasa = recuperarFloat("tasaInteres");
  let maximo = recuperarFloat("montoMaximoParametros");
  let mensaje = "";

  // Validar Tasa de Interés
  if (tasa >= 10 && tasa <= 20) {
    tasaInteres = tasa;
    mensaje += "Tasa configurada correctamente: " + tasa + "%. ";
  } else {
    mensaje += "La tasa debe estar entre 10% y 20%. ";
  }

  // Validar Monto Máximo
  if (!isNaN(maximo) && maximo > 0) {
    montoMaximo = maximo;
    mensaje += "Monto máximo configurado en: $" + maximo + ".";
  } else {
    mensaje += "Ingrese un monto máximo válido.";
  }

  mostrarTexto("mensajeTasa", mensaje);
}

function guardarCliente() {
  let correo = recuperaraTexto("correo"); 
  let numero = recuperaraTexto("numero"); 
  let cedula = recuperaraTexto("cedula");
  let nombre  = recuperaraTexto("nombre");
  let apellido = recuperaraTexto("apellido");
  let ingresos = recuperarFloat("ingresos");
  let egresos = recuperarFloat("egresos");
 
  if (!cedula || !nombre || !apellido) {
    alert("Por favor, llene los campos principales (Cédula, Nombre, Apellido)");
    return;
  }

  let clienteExiste = buscarCliente(cedula);
 
  if (clienteExiste == null) {
    let cliente = {
      correo:correo,
      numero: numero,
      cedula: cedula,
      nombre: nombre,
      apellido: apellido,
      ingresos: ingresos,
      egresos: egresos
    };
    clientes.push(cliente);
  } else {
    clienteExiste.correo = correo;
    clienteExiste.numero = numero;
    clienteExiste.nombre = nombre;
    clienteExiste.apellido = apellido;
    clienteExiste.ingresos = ingresos;
    clienteExiste.egresos = egresos;
  }
 
  pintarClientes();
  limpiar();
}

function pintarClientes() {
  let tabla = document.getElementById("tablaClientes");
  tabla.innerHTML = "";
 
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i];
    tabla.innerHTML += "<tr>" +
    "<td>" + cliente.correo + "</td>" +
      "<td>" + cliente.numero + "</td>" +
      "<td>" + cliente.cedula + "</td>" +
      "<td>" + cliente.nombre + "</td>" +
      "<td>" + cliente.apellido + "</td>" +
      "<td>$" + cliente.ingresos + "</td>" +
      "<td>$" + cliente.egresos + "</td>" +
      "<td><button onclick=\"seleccionarCliente('" + cliente.cedula + "')\">Actualizar</button>" +
      "<button onclick=\"eliminarCliente('" + cliente.cedula + "')\">Eliminar</button></td>" +
    "</tr>";
  }
}

function buscarCliente(cedula) {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cedula == cedula) {
      return clientes[i];
    }
  }
  return null;
}
 
function seleccionarCliente(cedula) {
  clienteSeleccionado = buscarCliente(cedula);
  if (clienteSeleccionado) {
    mostrarTextoEnCaja("correo", clienteSeleccionado.correo);
    mostrarTextoEnCaja("numero", clienteSeleccionado.numero);
    mostrarTextoEnCaja("cedula", clienteSeleccionado.cedula);
    mostrarTextoEnCaja("nombre", clienteSeleccionado.nombre);
    mostrarTextoEnCaja("apellido", clienteSeleccionado.apellido);
    mostrarTextoEnCaja("ingresos", clienteSeleccionado.ingresos);
    mostrarTextoEnCaja("egresos", clienteSeleccionado.egresos);
  }
}
 
function limpiar() {
  mostrarTextoEnCaja("correo", "");
  mostrarTextoEnCaja("numero", "");
  mostrarTextoEnCaja("cedula", "");
  mostrarTextoEnCaja("nombre", "");
  mostrarTextoEnCaja("apellido", "");
  mostrarTextoEnCaja("ingresos", "");
  mostrarTextoEnCaja("egresos", "");
}
 
function eliminarCliente(cedula) {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cedula == cedula) {
      clientes.splice(i, 1);
      break;
    }
  }
  pintarClientes();
}
 
function buscarClienteCredito() {
  let cedula = recuperaraTexto("buscarCedulaCredito");
  let clienteEncontrado = buscarCliente(cedula);
  
  if (clienteEncontrado != null) {
    clienteSeleccionado = clienteEncontrado;
    let cmpClienteCredito = document.getElementById("datosClienteCredito");
    cmpClienteCredito.innerHTML =
      "<strong>Número:</strong> " + clienteEncontrado.numero + "<br>" +
      "<strong>Cédula:</strong> " + clienteEncontrado.cedula + "<br>" +
      "<strong>Cliente:</strong> " + clienteEncontrado.nombre + " " + clienteEncontrado.apellido + "<br>" +
      "<strong>Ingresos:</strong> $" + clienteEncontrado.ingresos + "<br>" +
      "<strong>Egresos:</strong> $" + clienteEncontrado.egresos;
  } else {
    clienteSeleccionado = null;
    alert("Cliente no encontrado. Regístrelo primero en la pestaña Clientes.");
    document.getElementById("datosClienteCredito").innerHTML = "";
  }
}
 
function calcularDisponible(ingresos, egresos) {
  let valorDisponible = ingresos - egresos;
  return valorDisponible < 0 ? 0 : valorDisponible;
}
 
function calcularCapacidadPago(montoDisponible) {
  return montoDisponible * 0.5;
}
 
function calcularInteresSimple(monto, tasa, plazo) {
  return plazo * (tasa / 100) * monto;
}
 
function calcularTotalPagar(monto, interes) {
  return monto + interes + 100; 
}
 
function calcularCuotaMensual(total, plazoAnios) {
  return total / (plazoAnios * 12);
}
 
function aprobarCredito(capacidadPago, cuotaMensual) {  
  return capacidadPago > cuotaMensual;
}
 
function simularCredito() {
  if (!clienteSeleccionado) {
    alert("Debe buscar y seleccionar un cliente primero.");
    return;
  }

  let monto = document.getElementById("montoCredito").value;
  let floatMonto = parseFloat(monto);
  let plazo = document.getElementById("plazoCredito").value;
  let intPlazo = parseInt(plazo);

  if (isNaN(floatMonto) || isNaN(intPlazo) || floatMonto <= 0 || intPlazo <= 0) {
    alert("Por favor ingrese un monto y plazo válidos.");
    return;
  }

  // NUEVO: Validación estricta del tope de monto máximo otorgable
  if (floatMonto > montoMaximo) {
    alert("Error: El monto solicitado ($" + floatMonto + ") es superior al valor permitido por el sistema ($" + montoMaximo + ").");
    mostrarTextoEnCaja("montoCredito", ""); // Limpia la caja usando utilitarios.js
    return; // Detiene la ejecución completa de la simulación
  }
 
  let disponible = calcularDisponible(clienteSeleccionado.ingresos, clienteSeleccionado.egresos);
  let capacidadPago = calcularCapacidadPago(disponible);
  let interes = calcularInteresSimple(floatMonto, tasaInteres, intPlazo);
  let totalPagar = calcularTotalPagar(floatMonto, interes);
  let cuota = calcularCuotaMensual(totalPagar, intPlazo);
  let aprobado = aprobarCredito(capacidadPago, cuota);
 
  let veredicto = aprobado ? "Crédito aprobado para solicitud" : "El monto excede la capacidad de pago mensual del cliente";
  let divResultado = document.getElementById("resultadoCredito");
 
  divResultado.innerHTML =
    "<strong>Capacidad de pago mensual:</strong> $" + capacidadPago.toFixed(2) + "<br>" +
    "<strong>Total a Pagar (inc. seguro):</strong> $" + totalPagar.toFixed(2) + "<br>" +
    "<strong>Cuota mensual calculada:</strong> $" + cuota.toFixed(2) + "<br>" +
    "<strong>RESULTADO:</strong> " + veredicto;
 
  divResultado.className = aprobado ? "aprobado" : "rechazado";
  document.getElementById("btnSolicitarCredito").disabled = !aprobado;
 
  montoCalculado = floatMonto; 
  plazoCalculado = intPlazo;
  cuotaCalculada = cuota;
}
 
function solicitarCredito() {
  if (!clienteSeleccionado) return;

  let credito = {
    numero: clienteSeleccionado.numero, 
    cedula: clienteSeleccionado.cedula,
    nombre: clienteSeleccionado.nombre,
    apellido: clienteSeleccionado.apellido,
    monto: montoCalculado,
    tasa: tasaInteres,
    plazo: plazoCalculado,
    cuota: cuotaCalculada
  };
  
  creditos.push(credito);
  alert("Crédito registrado exitosamente.");
  
  document.getElementById("btnSolicitarCredito").disabled = true;
  document.getElementById("resultadoCredito").innerHTML = "";
  document.getElementById("resultadoCredito").className = "";
}
 
function buscarCreditos(cedula) {
  let creditosCliente = [];
  for (let i = 0; i < creditos.length; i++) {
    if (creditos[i].cedula == cedula) {
      creditosCliente.push(creditos[i]);
    }
  }
  return creditosCliente;
}
 
function pintarCreditos(arregloCreditos) {
  let tabla = recuperarElemento("tablaCreditos");
  let contenido = "";
  
  
  for (let i = 0; i < arregloCreditos.length; i++) {
    let credito = arregloCreditos[i];
    contenido += `<tr>
          <td>${credito.cedula}</td>
          <td>${credito.nombre} ${credito.apellido}</td>
          <td>$${credito.monto.toFixed(2)}</td>
          <td>${credito.tasa}%</td>
          <td>${credito.plazo} años</td>
          <td>$${credito.cuota.toFixed(2)}</td>
          <td><button onclick="eliminarCredito('${credito.cedula}')">Eliminar</button></td>
        </tr>`;
  }
  tabla.innerHTML = contenido;
}
 
function buscarCreditosCliente() {
  let campoCliente = recuperaraTexto("buscarCedulaListado");
  if (!campoCliente) {
    alert("Ingrese una cédula para buscar.");
    return;
  }
  let creditosCliente = buscarCreditos(campoCliente);
  pintarCreditos(creditosCliente);
}
 
function eliminarCredito(cedula) {
  for (let i = 0; i < creditos.length; i++) {
    if (creditos[i].cedula == cedula) {
      creditos.splice(i, 1);
      break;
    }
  }
  pintarCreditos(creditos);
}

/* ==========================================================================
   NUEVO: Función para filtrar y mostrar solo Créditos VIP (> 5000)
   ========================================================================== */
function mostrarCreditosVip() {
  let creditosVip = [];
  
  // Filtramos los créditos cuyo monto sea estrictamente mayor a 5000
  for (let i = 0; i < creditos.length; i++) {
    if (creditos[i].monto > 5000) {
      creditosVip.push(creditos[i]);
    }
  }
  
  // Renderizamos el arreglo filtrado en la misma tabla de créditos
  pintarCreditos(creditosVip);
}
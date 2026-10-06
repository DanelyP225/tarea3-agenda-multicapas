var URL_API = "https://www.raydelto.org/agenda.php";

var contenedorContactos = document.getElementById("contenedor-contactos");
var formulario = document.getElementById("formulario-contacto");
var mensajeEstado = document.getElementById("mensaje-estado");

document.addEventListener("DOMContentLoaded", function () {
    cargarContactos();
});

// función Get que muestra los contactos en la página web
function cargarContactos() {
    contenedorContactos.innerHTML = '<p class="estado-carga">Cargando contactos desde el servidor...</p>';

    fetch(URL_API)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("Respuesta del servidor no válida");
            }
            return respuesta.json();
        })
        .then(function (contactos) {
            contenedorContactos.innerHTML = "";

            if (!contactos || contactos.length === 0) {
                contenedorContactos.innerHTML = '<p class="estado-vacio">No hay contactos registrados aún.</p>';
                return;
            }

            contactos.forEach(function (contacto) {
                var tarjeta = document.createElement("div");
                tarjeta.className = "tarjeta-contacto";

                var nombreCompleto = document.createElement("h3");
                nombreCompleto.textContent = contacto.nombre + " " + contacto.apellido;

                var tel = document.createElement("p");
                tel.innerHTML = "<strong>Tel:</strong> " + contacto.telefono;

                tarjeta.appendChild(nombreCompleto);
                tarjeta.appendChild(tel);
                contenedorContactos.appendChild(tarjeta);
            });
        })
        .catch(function (error) {
            console.error("Error al cargar contactos:", error);
            contenedorContactos.innerHTML = '<p class="estado-error">No se pudieron cargar los contactos. Intenta nuevamente.</p>';
        });
}

// función Post que envía los datos del formulario al servidor
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault(); 

    var inputNombre = document.getElementById("nombre");
    var inputApellido = document.getElementById("apellido");
    var inputTelefono = document.getElementById("telefono");

    // objeto JSON 
    var nuevoContacto = {
        nombre: inputNombre.value.trim(),
        apellido: inputApellido.value.trim(),
        telefono: inputTelefono.value.trim()
    };

    mostrarEstado("Enviando contacto al servidor...", "info");

    fetch(URL_API, {
        method: "POST",
        body: JSON.stringify(nuevoContacto)
    })
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return respuesta.text(); 
        })
        .then(function () {
            mostrarEstado("¡Contacto guardado exitosamente!", "exito");
            formulario.reset(); 
            cargarContactos();  
        })
        .catch(function (error) {
            console.error("Error al guardar:", error);
            mostrarEstado("Error al guardar el contacto. Intenta de nuevo.", "error");
        });
});

// Función auxiliar para mostrar mensajes de estado al usuario
function mostrarEstado(mensaje, tipo) {
    mensajeEstado.textContent = mensaje;
    mensajeEstado.className = "mensaje-estado " + tipo;

    setTimeout(function () {
        mensajeEstado.textContent = "";
        mensajeEstado.className = "mensaje-estado";
    }, 4000);
}
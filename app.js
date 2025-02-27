const amigos = document.querySelector(".jugadores");
const listaAmigos = document.querySelector(".lista-de-jugadores");
const divSorteo = document.querySelector(".sorteo");
const resultadosSorteo = document.querySelector(".resultado-sorteo");
const contenedorParticipantes = document.querySelector("#lista-jugadores");
const botonAgregar = document.querySelector("#boton-agregar");
const inputNombre = document.querySelector("#nombre");
const botonSorteo = document.querySelector(".boton-sorteo");
const resultadoSorteo = document.querySelector("#resultado-sorteo");
const botonReiniciar = document.querySelector(".reiniciar-sorteo");
const botonVolver = document.querySelector(".boton-volver");
const botonVaciarLista = document.querySelector("#vaciar-lista");
let listaVacia = document.querySelector(".lista-vacia");
let listaLlena = document.querySelector(".lista-llena");

let participantesMezclados = "";

let participantes;
let participantesLS = localStorage.getItem("personasParticipantes");
if (participantesLS) {
    participantes = JSON.parse(participantesLS);
} else {
    participantes = [];
}

// Función para agregar nombres

// Event listener para el botón agregar
botonAgregar.addEventListener("click", (e) => {
    agregarNombres();
});

// Event listener para el input nombre para detectar la tecla Enter
inputNombre.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        agregarNombres();
    }
});

function agregarNombres() {
    const nombre = inputNombre.value.trim();

    if (nombre && !participantes.includes(nombre)) {
        participantes.push(nombre);
        localStorage.setItem("personasParticipantes", JSON.stringify(participantes));
        cargarElementosLista(participantes);
        inputNombre.value = "";
    } else if (nombre === "") {
        alert("El apartado nombre está vacío");
    } else {
        alert("Ya hay un participante con ese nombre");
        inputNombre.value = "";
    }
}


// Función para cargar la lista de participantes
function cargarElementosLista(amigoSecretoParticipantes) {

    amigos.classList.remove("disabled");
    listaAmigos.classList.remove("disabled");
    divSorteo.classList.remove("disabled");
    resultadosSorteo.classList.add("disabled");

    contenedorParticipantes.innerHTML = "";

    amigoSecretoParticipantes.forEach((nombre, index) => {
        const div = document.createElement("div");
        div.classList.add("jugadores");
        div.innerHTML = `
            <ul>
                <li>${nombre} <button class="boton-eliminar" data-index="${index}">Eliminar</button></li>
            </ul>
        `;
        contenedorParticipantes.append(div);
    });

    if (amigoSecretoParticipantes.length > 0) {
        listaVacia.classList.add("disabled");
        listaLlena.classList.remove("disabled");
    } else {
        listaVacia.classList.remove("disabled");
        listaLlena.classList.add("disabled");
    }

    actualizarBotonesEliminar();
}

// Función para actualizar los botones de eliminar
function actualizarBotonesEliminar() {

    document.querySelectorAll(".boton-eliminar").forEach(boton => {
        boton.addEventListener("click", (e) => {

            const index = e.currentTarget.getAttribute("data-index");

            if (confirm("¿Estás seguro de que quieres eliminar a este participante?")) 
            {
                participantes.splice(index, 1);
                localStorage.setItem("personasParticipantes", JSON.stringify(participantes));
                cargarElementosLista(participantes);
            }
        });
    });
}

// Función para realizar el sorteo
document.querySelectorAll(".boton-sorteo").forEach(boton => {
    boton.addEventListener("click", realizarSorteo);
});
function realizarSorteo() {
    
    if (participantes.length < 2) {
        alert("Debe haber al menos 2 participantes para realizar el sorteo.");
        return;
    } else if (participantes.length > 100) {
        alert("esta excediendo el limite de partivipantes");
        return;
    } else if (participantes.length % 2 !== 0) {
        alert("la cantidad de participantes debe ser par");
        return;
    } else {
        amigos.classList.add("disabled")
        listaAmigos.classList.add("disabled")
        divSorteo.classList.add("disabled")
        resultadosSorteo.classList.remove("disabled")
    }

    participantesMezclados = [...participantes].sort(() => Math.random() - 0.5);
    let resultados = [];

    for (let i = 0; i < participantesMezclados.length; i++) {
        let amigoSecreto = participantesMezclados[(i + 1) % participantesMezclados.length];
        resultados.push(`<span>${participantesMezclados[i]}</span> es el amigo/a secreto de <span>${amigoSecreto}</span>`);
    }

    resultadoSorteo.innerHTML = resultados.map(res => `<li>${res}</li>`).join("");
}

//Funcion para volver a mostrar la pagina principal
botonVolver.addEventListener("click",volverPaginaPrincipal);
function volverPaginaPrincipal() {
    amigos.classList.remove("disabled");
    listaAmigos.classList.remove("disabled");
    divSorteo.classList.remove("disabled");
    resultadosSorteo.classList.add("disabled");
}

// Función para reiniciar el sorteo
botonReiniciar.addEventListener("click", reiniciarSorteo);
function reiniciarSorteo() {
    resultadoSorteo.innerHTML = "";
    participantes = [];
    localStorage.removeItem("personasParticipantes");
    cargarElementosLista(participantes);
}

// Función para vaciar la lista de participantes
botonVaciarLista.addEventListener("click", vaciarLista);
function vaciarLista() {
    if (confirm("¿Estás seguro de que quieres vaciar la lista de participantes?")) {
        participantes = [];
        localStorage.removeItem("personasParticipantes");
        cargarElementosLista(participantes);
    }
}

// Inicializar la lista al cargar la página
cargarElementosLista(participantes);
agregarNombres();
var urlGetPokemons = "http://localhost:8082/pokemons";
var urlGetInformacionPokemon = "http://localhost:8082/pokemon/";
//var urlGetPokemons = "https://api-pokeapi.herokuapp.com/pokemons"
//var urlGetInformacionPokemon = "https://api-pokeapi.herokuapp.com/pokemon/"
var message = "Buscando Pokemones...";


$(document).ready(function () {

    onSpinner(message);
    getPokemons();

    $("#btnCerrar").on("click", function () {
        offDetalle();
        onTabla();
    })
});


function getPokemons() {
    var ruta = urlGetPokemons;
    $.ajax({
        type: "GET",
        url: ruta,
        data: "",
        dataType: "text",
        contentType: "application/json",
        error: function () {
            alert("Error en la busqueda de Pokemones")
            offSpinner()
        },
        success: function (data) {
            if (data == []) {
                alert("No se encontraron pokemones");
            }
            offSpinner();
            let datos = JSON.parse(data);
            console.log(datos[1]);
            var pos = 1;
            for (let j in datos) {
                for (let i in datos[j].sprites) {
                    if (pos == 4) {
                        pos = 1;
                    }
                    //console.log(datos[j].sprites[i]); muestra url imagen
                    let img = document.createElement("img");
                    img.src = datos[j].sprites[i];
                    img.style = 'width:100px'
                    img.id = datos[j].name;
                    img.addEventListener("click", obtenerInformacion, false);
                    $("#" + pos).append(img);
                    pos++;
                }

            }

        }
    });
}

function obtenerInformacion() {
    offTabla();
    message = "Obteniendo detalles..."
    onSpinner(message);
    //console.log("Pokemon: " + this.id);
    var imagen = $(this).attr('src');
    //console.log("Imagen: " + imagen);
    var nombre = this.id
    var ruta = urlGetInformacionPokemon + nombre;
    $.ajax({
        type: "GET",
        url: ruta,
        data: "",
        dataType: "text",
        contentType: "application/json",
        error: function () {
            alert("Error al obtener información")
        },
        success: function (data) {
            let datos = JSON.parse(data);
            offSpinner();
            //console.log(datos);  
            var movimientos = document.getElementById("movimientos");
            var habilidades = document.getElementById("habilidades");
            //carga movimientos en el select
            //var tipo = "";
            for (let i in datos.moves) {
                pushList(datos.moves[i].move.name, i, movimientos);
            }
            //carga habilidades en el select
            for (let i in datos.abilities) {
                for (let x in datos.abilities[i].ability) {
                    pushList(datos.abilities[i].ability[x].name, i, habilidades);
                }
            }
            //carga en input el tipo o tipos que pertenece el pokemon
            var tipo = concatTipo(datos);
            //
            showInfo(imagen, nombre, tipo, datos.weight, datos.description.description);

        }
    });
}

function onSpinner(message) {
    let contenedor = document.createElement("div");
    let spinner = document.createElement("div");
    let label = document.createElement("label");
    contenedor.className = "d-flex align-items-center";
    contenedor.id = "contenedor";
    spinner.className = "spinner-border ms-auto";
    spinner.ariaHidden = "true"
    label.setAttribute("id", "message");
    label.innerHTML = message;
    let body = document.getElementsByTagName("body");
    $(contenedor).append(spinner);
    $(contenedor).append(label);
    $(body).append(contenedor);
}

function offSpinner() {
    let contenedor = document.getElementById("contenedor");
    contenedor.remove();
}

function offTabla() {
    let className = $("#tabla").attr("class")
    $("#tabla").removeClass(className).addClass("invisible");

}

function showInfo(img, nombre, tipo, peso, descripcion) {
    $("#info").attr("src", img);
    $("h5").html(nombre);
    $("#tipo").val(tipo);
    $("#peso").val(peso);
    $("#descripcion").val(descripcion);
    onDetalle();
}

function onDetalle(){
    let contenedor = document.getElementById("detalle");
    contenedor.style.display = "block";
}

function offDetalle() {
    let detalle = document.getElementById("detalle");
    detalle.style.display = "none";
}

function onTabla() {
    let className = $("#tabla").attr("class");
    $("#tabla").removeClass(className).addClass("position-absolute top-50 start-50 translate-middle");
}

function pushList(valor, pos, lista) {
    let option = document.createElement("option");
    let texto = document.createTextNode(valor);
    option.setAttribute("value", "value" + pos);
    option.appendChild(texto);
    lista.appendChild(option);

}

function concatTipo(datos) {
    let tipo = "";
    for (let i in datos.types) {
        for (let x in datos.types[i].type) {
            if (tipo != "") {
                tipo = tipo + ", " + datos.types[i].type[x].name;
            }
            else {
                tipo = datos.types[i].type[x].name;
            }
        }
    }
    return tipo;
}
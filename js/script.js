// Definimos las constantes gloables
const btn = document.getElementById("btnBuscar")
const txtInput = document.getElementById("inputBuscar")
const ListaFiltrada = document.getElementById("lista")

// Función para ocultar el indicador de carga (spinner)
let hideSpinner = function () {
    document.getElementById("spinner-wrapper").style.display = "none";
}
// Función para mostrar el indicador de carga (spinner)
let showSpinner = function () {
    document.getElementById("spinner-wrapper").style.display = "block";
}
// Función para obtener los datos JSON
let getJSONData = function (url) {
    let result = {};
    showSpinner();
    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(function (response) {
            result.status = 'ok';
            result.data = response;
            hideSpinner();
            return result;
        })
        .catch(function (error) {
            result.status = 'error';
            result.data = error;
            hideSpinner();
            return result;
        });
}

document.addEventListener("DOMContentLoaded", () => {
    // Agregar un evento de click al botón de búsqueda
    btn.addEventListener("click", async () => {
        let Peliculas = await getJSONData("https://japceibal.github.io/japflix_api/movies-data.json");
        Peliculas = Peliculas.data;
        // Filtrar y mostrar la lista de películas
        printLista(Peliculas.filter(filtroPeliculas))

    })
})
// Función para filtrar películas
function filtroPeliculas(pelis) {
    let texto = txtInput.value.trim().toLowerCase()
    if (pelis.tagline.toLowerCase().includes(texto) || 
    pelis.overview.toLowerCase().includes(texto) || 
    pelis.title.toLowerCase().includes(texto) ||
    pelis.genres.some((genreObj) => genreObj.name.toLowerCase().includes(texto))) {
        return true       
    }
}
// Función para mostrar la lista de películas 
function printLista(Peliculas){
    ListaFiltrada.innerHTML="" // Limpiar el contenido del Html antes de agregar contenido nuevo
    Peliculas.forEach(Pelicula => {
        const elemento = document.createElement("li")
        let htmlContentToAppend = `   
        <p>
          ${Pelicula.title}
          <span class="fa fa-star" value="1"></span>
            <span class="fa fa-star" value="2"></span>
            <span class="fa fa-star" value="3"></span>
            <span class="fa fa-star" value="4"></span>
            <span class="fa fa-star" value="5"></span>
        </p>
        <p>
          ${Pelicula.tagline}
        </p>
        <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        More
        </button>
      `
        elemento.setAttribute("id", Pelicula.id)
        elemento.setAttribute("class", "list-group-item list-group-item-dark")
        elemento.innerHTML = htmlContentToAppend
        // Agregar un evento de click para mostrar detalles adicionales al hacer clic en un elemento
        elemento.addEventListener("click", ()=>{
            document.getElementById("year").innerHTML = Pelicula.release_date.split("-")[0] 
            document.getElementById("runtime").innerHTML = Pelicula.runtime
            document.getElementById("budget").innerHTML = Pelicula.budget
            document.getElementById("revenue").innerHTML = Pelicula.revenue
        })
        ListaFiltrada.appendChild(elemento)
        updateStars(Pelicula, Pelicula.id)
    });
}
// Función para "setear" la calificación de estrellas para una película
function updateStars(Pelicula, id) {
    const idli = document.getElementById(id)
    const rating = Math.round(Pelicula.vote_average/2)
    const stars = idli.querySelectorAll(".fa-star");
    for (let i = 0; i < rating; i++) {
        const estrella = stars[i];
        estrella.classList.add("checked")
    }
  }


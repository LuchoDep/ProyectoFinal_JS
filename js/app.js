let carrito = [];

const bodyCarrito = document.querySelector(`.modal .modal-body`)
const contCards = document.getElementById(`contCards`)
const limpiarCarrito = document.getElementById(`vaciarCarrito`)
const pagarCompra = document.getElementById(`pagarCompra`)
const precioCarrito = document.getElementById(`precioCarrito`)
const listaProductos = document.getElementById(`listaProductos`)
const myModal = new bootstrap.Modal(document.getElementById('modalSlide'), { focus: false }) // sin esto no se puede escribir en las alertas del carrito


// traigo los productos desde la API y los guardo en el local storage
// fetch("../js/stock.json")
fetch("https://my-json-server.typicode.com/LuchoDep/APIStock/stock")
    .then((respuesta) => respuesta.json())
    .then((data) => {
        // console.log(data)
        const productosJSON = JSON.stringify(data)
        localStorage.setItem(`productosStock`, productosJSON)
    })
    .catch((err) => console.log(`algo no está bien`, err))


const productosStock = JSON.parse(localStorage.getItem(`productosStock`))
// console.log(productosStock)


// creo las cards
productosStock.forEach((producto) => {
    contCards.innerHTML += `
    <div class="card mb-3 prodCards"">
    <div class="row g-0">
        <div class="col-md-4">
            <img src="${producto.img}" class="img-fluid cardProdImg" alt="${producto.marca}">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">${producto.marca}</h5>
                <p class="card-text">${producto.medida}</p>
                <p class="card-text">$${producto.precio}</p>
                <p class="card-text">Cantidad:${producto.cantidad}</p>
                <a class="btn btn-warning" onclick="mandarAlCarrito(${producto.id})">Añadir al carrito</a>
            </div>
        </div>
    </div>
    </div>
    `
})

// añadir productos al carrito y crear las cards adentro
function mandarAlCarrito(id) {

    // añadir duplicados
    const enCarrito = carrito.some(producto => producto.id === id)
    if (enCarrito) {
        const producto = carrito.map(producto => {
            if (producto.id === id) {
                producto.cantidad++
            }
        })
    } else {
        const prodCarrito = productosStock.find((producto) => producto.id === id)
        carrito.push(prodCarrito)
    }

    // console.log(carrito)
    prodEnCarrito()

    Toastify({

        text: "Producto añadido al carrito",
        gravity: "bottom",
        position: "right",
        duration: 2000,
        style: {
            color: "#332D2D",
            background: "#E4A11B",
        },
    }).showToast();

}

const prodEnCarrito = () => {
    bodyCarrito.innerHTML = ``
    carrito.forEach((producto) => {
        bodyCarrito.innerHTML += `
        <div class="contCarrito">
        <img src="${producto.img}" alt="${producto.marca}" class="carritoProdImg">
        <h3 class="carritoCardP">${producto.marca}</h3>
        <h5 class="carritoCardP">$${producto.precio}</h5>
        <h5 class="carritoCardP">Cantidad:${producto.cantidad}</h5>
        <button onclick="quitarDelCarrito(${producto.id})" id="${producto.id}">❌</button>
        </div>
        `
    })

    // precio en el carrito
    precioCarrito.innerText = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad * producto.precio, 0)

    guardarEnLS()
}


// eliminar los productos del carrito individual
function quitarDelCarrito(id) {
    const productoId = id
    carrito = carrito.filter((producto) => producto.id !== productoId)
    prodEnCarrito()
}


// eliminar todos los productos del carrito
limpiarCarrito.addEventListener(`click`, () => {
    carrito.length = []
    prodEnCarrito()

    Swal.fire({
        icon: 'error',
        title: 'Vaciaste el carrito',
        text: 'No tienes productos',
    })
})


// 
//guardar en local storage
function guardarEnLS() {
    localStorage.setItem("carritoJSON", JSON.stringify(carrito))
}

// procedo a "pagar" la compra
pagarCompra.addEventListener(`click`, async () => {
    if (carrito.length === 0) {
        Swal.fire({
            title: "¡El carrito está vacio!",
            text: "Agrega productos para continuar",
            icon: "error",
            confirmButtonText: "Volver a la tienda",
        });
    } else {
        const { value: formValues } = await Swal.fire({
            title: '¡Tu compra está casi lista!',
            html:
                '<input id="nombreApellido" class="swal2-input" placeholder="Nombre y Apellido">' +
                '<input id="direccionEnvio" class="swal2-input" placeholder="Dirección">',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancerButtonText: "Cancelar",
            confirmButtonColor: "#008000",
            confirmButtonText: "Siguiente",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    `¡Gracias por tu compra!`,
                    `Tu envío llegará en breve`,
                    `success`
                )
            }
        })

    }
})
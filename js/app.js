const BASE_URL = 'https://69cf246da4647a9fc6751ff3.mockapi.io/contacts'


const formContacto = document.getElementById('form-contacto')
const inputId = document.getElementById('contacto-id')
const inputNombre = document.getElementById('nombre')
const inputEmail = document.getElementById('email')
const inputTelefono = document.getElementById('telefono')
const inputFecha = document.getElementById('fecha')
const inputImagen = document.getElementById('imagen')
const tablaContactos = document.getElementById('tabla-contactos')
const formTitulo = document.getElementById('form-titulo')
const btnCancelar = document.getElementById('btn-cancelar')
const btnGuardar = document.getElementById('btn-guardar')


async function getContactos() {
  try {
    const response = await axios.get(BASE_URL)
    renderTabla(response.data)
  } catch (error) {
    Swal.fire('Error', 'No se pudieron cargar los contactos', 'error')
  }
}


function renderTabla(contactos) {
  tablaContactos.innerHTML = ''

  if (contactos.length === 0) {
    tablaContactos.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted">No hay contactos aún</td>
      </tr>`
    return
  }

  contactos.forEach(function(contacto) {
    const fila = document.createElement('tr')
    fila.innerHTML = `
      <td>
        <img src="${contacto.imagen || 'https://via.placeholder.com/40'}" 
          alt="${contacto.name}" 
          style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
      </td>
      <td>${contacto.name}</td>
      <td>${contacto.email}</td>
      <td>${contacto.telefono}</td>
      <td>${contacto.fecha}</td>
      <td>
        <button class="btn btn-warning btn-sm me-1" onclick="editarContacto('${contacto.id}')">✏️ Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarContacto('${contacto.id}')">🗑️ Eliminar</button>
      </td>
    `
    tablaContactos.appendChild(fila)
  })
}


function validarCampos() {
  if (!inputNombre.value.trim()) {
    Swal.fire('Error', 'El nombre es obligatorio', 'error')
    return false
  }
  if (!inputEmail.value.trim()) {
    Swal.fire('Error', 'El email es obligatorio', 'error')
    return false
  }
  if (!/\S+@\S+\.\S+/.test(inputEmail.value)) {
    Swal.fire('Error', 'El email no tiene un formato válido', 'error')
    return false
  }
  if (!inputTelefono.value.trim()) {
    Swal.fire('Error', 'El teléfono es obligatorio', 'error')
    return false
  }
  if (!/^[0-9+\s\-()]{7,15}$/.test(inputTelefono.value)) {
    Swal.fire('Error', 'El teléfono solo debe contener números', 'error')
    return false
  }
  if (!inputFecha.value) {
    Swal.fire('Error', 'La fecha de nacimiento es obligatoria', 'error')
    return false
  }
  return true
}


formContacto.addEventListener('submit', async function(e) {
  e.preventDefault()

  if (!validarCampos()) return

  const contacto = {
    name: inputNombre.value.trim(),
    email: inputEmail.value.trim(),
    telefono: inputTelefono.value.trim(),
    fecha: inputFecha.value,
    imagen: inputImagen.value.trim()
  }

  const id = inputId.value

  try {
    if (id) {
      await axios.put(`${BASE_URL}/${id}`, contacto)
      Swal.fire('¡Actualizado!', 'El contacto fue actualizado correctamente', 'success')
    } else {
      await axios.post(BASE_URL, contacto)
      Swal.fire('¡Guardado!', 'El contacto fue agregado correctamente', 'success')
    }
    limpiarFormulario()
    getContactos()
  } catch (error) {
    Swal.fire('Error', 'No se pudo guardar el contacto', 'error')
  }
})


async function editarContacto(id) {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`)
    const contacto = response.data

    inputId.value = contacto.id
    inputNombre.value = contacto.name
    inputEmail.value = contacto.email
    inputTelefono.value = contacto.telefono
    inputFecha.value = contacto.fecha
    inputImagen.value = contacto.imagen || ''

    formTitulo.textContent = 'Editar Contacto'
    btnGuardar.textContent = 'Actualizar contacto'
    btnCancelar.style.display = 'inline-block'

    window.scrollTo(0, 0)
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar el contacto', 'error')
  }
}


async function eliminarContacto(id) {
  const result = await Swal.fire({
    title: '¿Estás segura?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await axios.delete(`${BASE_URL}/${id}`)
      Swal.fire('¡Eliminado!', 'El contacto fue eliminado', 'success')
      getContactos()
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el contacto', 'error')
    }
  }
}


function limpiarFormulario() {
  formContacto.reset()
  inputId.value = ''
  formTitulo.textContent = 'Agregar Contacto'
  btnGuardar.textContent = 'Guardar contacto'
  btnCancelar.style.display = 'none'
}


btnCancelar.addEventListener('click', limpiarFormulario)


document.addEventListener('DOMContentLoaded', getContactos)
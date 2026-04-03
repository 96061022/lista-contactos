// Array de contactos
let contactos = JSON.parse(localStorage.getItem('contactos')) || []

// Referencias al DOM
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

// Guardar en localStorage
function guardarEnStorage() {
  localStorage.setItem('contactos', JSON.stringify(contactos))
}

// Renderizar tabla
function renderTabla() {
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
          alt="${contacto.nombre}" 
          style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
      </td>
      <td>${contacto.nombre}</td>
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

// Validar campos
function validarCampos() {
  if (!inputNombre.value.trim()) {
    Swal.fire('Error', 'El nombre es obligatorio', 'error')
    return false
  }
  if (!inputEmail.value.trim()) {
    Swal.fire('Error', 'El email es obligatorio', 'error')
    return false
  }
  if (!inputTelefono.value.trim()) {
    Swal.fire('Error', 'El teléfono es obligatorio', 'error')
    return false
  }
  if (!inputFecha.value) {
    Swal.fire('Error', 'La fecha de nacimiento es obligatoria', 'error')
    return false
  }
  return true
}

// Submit del formulario
formContacto.addEventListener('submit', function(e) {
  e.preventDefault()

  if (!validarCampos()) return

  const id = inputId.value

  if (id) {
    const index = contactos.findIndex(function(c) { return c.id === id })
    contactos[index] = {
      id,
      nombre: inputNombre.value.trim(),
      email: inputEmail.value.trim(),
      telefono: inputTelefono.value.trim(),
      fecha: inputFecha.value,
      imagen: inputImagen.value.trim()
    }
    Swal.fire('¡Actualizado!', 'El contacto fue actualizado correctamente', 'success')
  } else {
    const nuevoContacto = {
      id: String(Date.now()),
      nombre: inputNombre.value.trim(),
      email: inputEmail.value.trim(),
      telefono: inputTelefono.value.trim(),
      fecha: inputFecha.value,
      imagen: inputImagen.value.trim()
    }
    contactos.push(nuevoContacto)
    Swal.fire('¡Guardado!', 'El contacto fue agregado correctamente', 'success')
  }

  guardarEnStorage()
  renderTabla()
  limpiarFormulario()
})

// Editar contacto
function editarContacto(id) {
  const contacto = contactos.find(function(c) { return c.id === id })
  if (!contacto) return

  inputId.value = contacto.id
  inputNombre.value = contacto.nombre
  inputEmail.value = contacto.email
  inputTelefono.value = contacto.telefono
  inputFecha.value = contacto.fecha
  inputImagen.value = contacto.imagen

  formTitulo.textContent = 'Editar Contacto'
  btnGuardar.textContent = 'Actualizar contacto'
  btnCancelar.style.display = 'inline-block'

  window.scrollTo(0, 0)
}

// Eliminar contacto
function eliminarContacto(id) {
  Swal.fire({
    title: '¿Estás segura?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(function(result) {
    if (result.isConfirmed) {
      contactos = contactos.filter(function(c) { return c.id !== id })
      guardarEnStorage()
      renderTabla()
      Swal.fire('¡Eliminado!', 'El contacto fue eliminado', 'success')
    }
  })
}

// Limpiar formulario
function limpiarFormulario() {
  formContacto.reset()
  inputId.value = ''
  formTitulo.textContent = 'Agregar Contacto'
  btnGuardar.textContent = 'Guardar contacto'
  btnCancelar.style.display = 'none'
}

// Botón cancelar
btnCancelar.addEventListener('click', limpiarFormulario)

// Cargar contactos al inicio
document.addEventListener('DOMContentLoaded', renderTabla)
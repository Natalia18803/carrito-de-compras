<template>
    <div class="q-pa-md q-gutter-y-sm">
        <div class="bg-orange text-white">
            <q-toolbar>
                <q-btn flat round dense icon="menu" class="q-mr-sm" />
                <q-space />
                <q-btn flat round dense icon="search" class="q-mr-xs" />
                <q-btn flat round dense icon="group_add" />
            </q-toolbar>
            <q-toolbar inset>
            </q-toolbar>
        </div>

        <div class="bg-cyan text-white">
            <q-toolbar>
                <q-btn flat round dense icon="assignment_ind" />

                <q-space />

                <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
                <q-btn flat round dense icon="gamepad" />
            </q-toolbar>

            <q-toolbar inset>
                <q-breadcrumbs active-color="white" style="font-size: 16px">

                    <q-breadcrumbs-el label="Toolbar" />
                </q-breadcrumbs>
            </q-toolbar>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()

//array de productos//
const productosDisponibles = ref([
    { id: 1, nombre: 'Producto 1', precio: 100, imagen: '' },
    { id: 2, nombre: 'Producto 2', precio: 200, imagen: '' },
    { id: 3, nombre: 'Producto 3', precio: 300, imagen: '' },
    { id: 4, nombre: 'Producto 4', precio: 400, imagen: '' },
])


//propiedades computadas requeridas//
const carrito = ref ([])
const totalItems = computed(() => carrito.value.reduce((sum, item) => sum + item.cantidad, 0))
const subtotal = computed(() => carrito.value.reduce ((sum, item) => sum +(item.precio * item.cantidad), 0))
const impuesto = computed(() => subtotal.value *
0.16)
const totalFinal = computed(() => subtotal.value + impuesto.value)
//para cargar el carrito de localstorage//
const savedCarrito = localStorage.getItem('carrito')
if (savedCarrito){
    carrito.value = JSON.parse(savedCarrito)
}


function  agregarAlCarrito(producto) {
    const itemExistente = carrito.value.find(item => item.id === producto.id)
    if (itemExistente) {
        itemExistente.cantidad++
    } else {}

}



//watchers//
watch(carrito, () => {
    localStorage.setItem('carrito', JSON.stringify(carrito.value))
    //notificacion de quasar//
}, {deep: true})

watch(totalFinal, (newVal) => {
  if (newVal > 1000) {
    $q.notify({
      message: 'Compra grande detectada: Tu carrito supera los $1000',
      type: 'warning'
    })
  }
})

</script>

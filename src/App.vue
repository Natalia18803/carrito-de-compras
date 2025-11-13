<template>
  <div>
    <div class="q-pa-md">
      <h4>Productos Disponibles</h4>
      <q-list bordered>
        <q-item v-for="producto in productosDisponibles" :key="producto.id">
          <q-item-section avatar>
            <q-img :src="producto.imagen" style="height: 100px; width: 100px; object-fit: cover;" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">{{ producto.nombre }}</q-item-label>
            <q-item-label caption>${{ producto.precio }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat color="primary" icon="shopping_cart" @click="agregarAlCarrito(producto)"> + </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="q-pa-md">
      <h4>Carrito de Compras</h4>
      <q-list bordered>
        <q-item v-for="item in carrito" :key="item.id">
          <q-item-section>
            <q-item-label>{{ item.nombre }}</q-item-label>
            <q-item-label caption>${{ item.precio }} x {{ item.cantidad }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round icon="remove" @click="disminuirCantidad(item.id)" />
            <span class="q-px-sm">{{ item.cantidad }}</span>
            <q-btn flat round icon="add" @click="aumentarCantidad(item.id)" />
          </q-item-section>
        </q-item>
      </q-list>
      <div class="q-mt-md">
        <p>Total Items: {{ totalItems }}</p>
        <p>Subtotal: ${{ subtotal }}</p>
        <p>Impuesto (19%): ${{ impuesto }}</p>
        <p>Total Final: ${{ totalFinal }}</p>
          <q-btn color="grey-4" text-color="purple" glossy unelevated icon="shopping_cart" label="COMPRAR" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()

//array de productos//
const productosDisponibles = ref([
    { id: 1, nombre: 'Licuadora', precio: 85, imagen: 'https://admin.pallomaro.com/backend/admin/backend/web/archivosDelCliente/items/images/20230929230938-BEBIDAS-LICUADORAS-LICUADORA-VELOCIDAD-VARIABLE-2L-21620230929230938128.png'},
    { id: 2, nombre: 'Microondas', precio: 210, imagen: 'https://images.samsung.com/is/image/samsung/p6pim/co/ms23k3513ak-co/gallery/co-mw3500k-solo-mwo-with-quick-defrost-23l-ms23k3513ak-co-thumb-542064567?$UX_EXT1_PNG$' },
    { id: 3, nombre: 'Batidora', precio: 308, imagen: 'https://pepeganga.vtexassets.com/arquivos/ids/1050301-800-auto?v=638351633673170000&width=800&height=auto&aspect=true' },
    { id: 4, nombre: 'Horno Giratorio', precio: 415, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS9CQ-mhdDPgs9Tw21a6Ma5vdXzWIIKwIwAg&s' },
    
])


//propiedades computadas requeridas//
const carrito = ref ([])
const totalItems = computed(() => carrito.value.reduce((sum, item) => sum + item.cantidad, 0));
const subtotal = computed(() => carrito.value.reduce ((sum, item) => sum +(item.precio * item.cantidad), 0));
const impuesto = computed(() => subtotal.value *0.19);
const totalFinal = computed(() => subtotal.value + impuesto.value);
//para cargar el carrito de localstorage//
const savedCarrito = localStorage.getItem('carrito');
if (savedCarrito){
    carrito.value = JSON.parse(savedCarrito)
}

//funciones
function agregarAlCarrito(producto) {
    const itemExistente = carrito.value.find(item => item.id === producto.id)
    if (itemExistente) {
        itemExistente.cantidad++
    } else {
        carrito.value.push({ ...producto, cantidad: 1 })
    }}

function aumentarCantidad(id) {
    const item = carrito.value.find(item => item.id === id)
    if (item) {
        item.cantidad++
    }}

function disminuirCantidad(id) {
    const itemIndex = carrito.value.findIndex(item => item.id === id)
    if (itemIndex !== -1) {
        if (carrito.value[itemIndex].cantidad > 1) {
            carrito.value[itemIndex].cantidad--
        } else {
            carrito.value.splice(itemIndex, 1)
        }}}

//watchers//
watch(carrito, () => {
    localStorage.setItem('carrito', JSON.stringify(carrito.value))
    $q.notify({
      message: 'Carrito guardado automáticamente',
      color: 'positive',
      icon: 'shopping_cart'
    })
}, {deep: true})

watch(totalFinal, (newVal) => {
  if (newVal > 1000) {
    console.warn(`Total del carrito: ($${newVal.toFixed(2)}) superaste los $1000`);
    $q.notify({
      message: 'Compra grande detectada: Tu carrito supera los $1000',
      type: 'warning'
    })
  }
})
</script>

<style scoped>
/* Fondo degradado para toda la página */
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  margin: 0;
}

/* Contenedor principal centrado */
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-height: 100vh;
}

/* Títulos con mejor estilo */
h4 {
  color: #333;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Nombres y precios de productos en color oscuro para visibilidad */
.text-h6 {
  color: #333 !important;
  font-weight: 600;
}

.text-subtitle2 {
  color: #666 !important;
}

/* Tarjetas de productos con espaciado y sombras */
.q-card {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.q-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Imágenes de productos con borde redondeado */
.q-img {
  border-radius: 8px;
}

/* Botones de agregar al carrito con colores personalizados */
.q-btn[color="primary"] {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  border: none;
  color: white;
  font-weight: 500;
 
}

.q-btn[color="primary"]:hover {
  background: linear-gradient(45deg, #feca57, #ff6b6b);
}

/* Lista del carrito con fondo sutil */
.q-list {
  background: #f8f4ea;
  border-radius: 10px;
  padding: 1rem;
}

/* Items del carrito con animación de entrada */
.q-item {
  border-bottom: 1px solid #2c2828;
  padding: 1rem 0;
 
}


.q-item__label {
    line-height: 1.2em !important;
    max-width: 100%;
    color: black;
}

.q-item:hover {
  background: rgba(95, 15, 133, 0.1);
}

/* Botones de cantidad con colores */
.q-btn[icon="remove"], .q-btn[icon="add"] {
  background: #26a69a;
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
}

.q-btn[icon="remove"]:hover, .q-btn[icon="add"]:hover {
  background: #4db6ac;
}

/* Sección de totales con fondo destacado */
.q-mt-md {
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.q-mt-md p {
  margin: 0.5rem 0;
  font-weight: 500;
  color: #333;
}

.q-pa-md{
 font-size: 20px;
 background-color: #eee;
 width: 900px;
}

/* Responsive para móviles */
@media (max-width: 768px) {
  #app {
    padding: 1rem;
  }

  .q-card {
    margin-bottom: 1rem;
  }
}
</style>


<style scoped>

</style>

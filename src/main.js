import { createApp } from 'vue'
import { Quasar, Notify} from 'quasar'


import './style.css'
import App from './App.vue'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'



 const app = createApp(App)
 
app.use(Quasar, {
  plugins: { Notify }, // import Quasar plugins and add here / notify //
})


 app.mount('#app')

import { createApp } from 'vue'

// Kong design tokens define the `--kui-*` custom properties at :root...
import '@kong/design-tokens/tokens/css/custom-properties.css'
// ...Kongponents ships its component styles (which consume those tokens)...
import '@kong/kongponents/dist/style.css'
// ...and our retheme overrides the primary tokens to the mock's teal.
import '@/assets/styles/kongponents-theme.scss'

import Kongponents from '@kong/kongponents'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(Kongponents)
app.use(router)

app.mount('#app')

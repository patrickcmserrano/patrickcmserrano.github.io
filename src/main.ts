import { mount } from 'svelte'
import App from './App.svelte'
import './styles/global.css'
import { initSimpleI18n } from './lib/simple-i18n'

// Inicializar sistema de i18n
initSimpleI18n()

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app

import './styles/global.css';
import { mount } from 'svelte';
import ConferencePage from './components/ConferencePage.svelte';
import { initSimpleI18n } from './lib/simple-i18n';

// Initialize i18n system
initSimpleI18n();

const app = mount(ConferencePage, {
  target: document.getElementById('conference-app')!,
});

export default app;

import { writable, derived } from 'svelte/store';

// Traduções simplificadas
const translations = {
  pt: {
    "app.title": "Patrick CM Serrano",
    "app.subtitle": "Engenharia de Software", 
    "features.title": "Meus Links",
    "features.theme": "Alternância de tema claro/escuro",
    "features.accessibility": "Acessibilidade aprimorada",
    "features.typescript": "Construído com TypeScript",
    "features.testing": "Carregamento otimizado",
    "features.i18n": "Suporte a múltiplos idiomas",
    "footer.copyright": "© 2025 LinkFlow por Patrick CM Serrano. Todos os direitos reservados.",
    "music.playlist": "Playlist Musical",
    "music.open": "Abrir Player de Música", 
    "music.close": "Fechar Player",
    "music.minimize": "Minimizar",
    "music.maximize": "Expandir",
    "music.playing": "Tocando",
    "music.paused": "Pausado",
    "music.loading": "Carregando",
    "music.play": "Reproduzir",
    "music.pause": "Pausar",
    "music.next": "Próxima",
    "music.previous": "Anterior",
    "music.clickToExpand": "Clique para expandir",
    "music.disclaimer": "Conteúdo fornecido pelo YouTube. Todos os direitos autorais pertencem aos respectivos proprietários.",
    "conference.welcome": "Bem-vindos ao BlockchainRio!",
    "conference.greeting": "Olá! Eu sou Patrick CM Serrano",
    "conference.role": "Engenheiro de Software",
    "conference.description": "Sou especialista em criar aplicações web escaláveis, arquiteturas de software modernas e soluções tecnológicas inovadoras. Vamos nos conectar!",
    "conference.portfolio": "Portfólio",
    "conference.linkedin": "LinkedIn",
    "conference.scanQR": "Escanear Código QR",
    "conference.visitPortfolio": "Visite meu portfólio",
    "conference.connectLinkedIn": "Conecte no LinkedIn",
    "conference.languages": "Esta página está disponível em vários idiomas:",
    "conference.contactMe": "Sinta-se à vontade para entrar em contato e vamos conversar sobre tecnologia, desenvolvimento de software e inovação!"
  },
  en: {
    "app.title": "Patrick CM Serrano",
    "app.subtitle": "Software Engineering",
    "features.title": "My Links", 
    "features.theme": "Light/dark theme toggle",
    "features.accessibility": "Enhanced accessibility",
    "features.typescript": "Built with TypeScript",
    "features.testing": "Optimized loading",
    "features.i18n": "Multi-language support",
    "footer.copyright": "© 2025 LinkFlow by Patrick CM Serrano. All rights reserved.",
    "music.playlist": "Music Playlist",
    "music.open": "Open Music Player",
    "music.close": "Close Player", 
    "music.minimize": "Minimize",
    "music.maximize": "Expand",
    "music.playing": "Playing",
    "music.paused": "Paused",
    "music.loading": "Loading",
    "music.play": "Play",
    "music.pause": "Pause", 
    "music.next": "Next",
    "music.previous": "Previous",
    "music.clickToExpand": "Click to expand",
    "music.disclaimer": "Content provided by YouTube. All copyrights belong to their respective owners.",
    "conference.welcome": "Welcome to BlockchainRio!",
    "conference.greeting": "Hi! I'm Patrick CM Serrano",
    "conference.role": "Software Engineer",
    "conference.description": "I specialize in building scalable web applications, modern software architectures, and innovative technology solutions. Let's connect!",
    "conference.portfolio": "Portfolio",
    "conference.linkedin": "LinkedIn",
    "conference.scanQR": "Scan QR Code",
    "conference.visitPortfolio": "Visit my portfolio",
    "conference.connectLinkedIn": "Connect on LinkedIn",
    "conference.languages": "This page is available in multiple languages:",
    "conference.contactMe": "Feel free to reach out and let's discuss technology, software development, and innovation!"
  },
  es: {
    "app.title": "Patrick CM Serrano",
    "app.subtitle": "Ingeniería de Software",
    "features.title": "Mis Enlaces",
    "features.theme": "Alternancia de tema claro/oscuro",
    "features.accessibility": "Accesibilidad mejorada", 
    "features.typescript": "Construido con TypeScript",
    "features.testing": "Carga optimizada",
    "features.i18n": "Soporte multiidioma",
    "footer.copyright": "© 2025 LinkFlow por Patrick CM Serrano. Todos los derechos reservados.",
    "music.playlist": "Lista de Reproducción",
    "music.open": "Abrir Reproductor de Música",
    "music.close": "Cerrar Reproductor",
    "music.minimize": "Minimizar", 
    "music.maximize": "Expandir",
    "music.playing": "Reproduciendo",
    "music.paused": "Pausado",
    "music.loading": "Cargando",
    "music.play": "Reproducir",
    "music.pause": "Pausar",
    "music.next": "Siguiente",
    "music.previous": "Anterior",
    "music.clickToExpand": "Haz clic para expandir",
    "music.disclaimer": "Contenido proporcionado por YouTube. Todos los derechos de autor pertenecen a sus respectivos propietarios.",
    "conference.welcome": "¡Bienvenidos a BlockchainRio!",
    "conference.greeting": "¡Hola! Soy Patrick CM Serrano",
    "conference.role": "Ingeniero de Software",
    "conference.description": "Me especializo en crear aplicaciones web escalables, arquitecturas de software modernas y soluciones tecnológicas innovadoras. ¡Conectemos!",
    "conference.portfolio": "Portafolio",
    "conference.linkedin": "LinkedIn",
    "conference.scanQR": "Escanear Código QR",
    "conference.visitPortfolio": "Visita mi portafolio",
    "conference.connectLinkedIn": "Conecta en LinkedIn",
    "conference.languages": "Esta página está disponible en varios idiomas:",
    "conference.contactMe": "¡No dudes en contactarme y hablemos sobre tecnología, desarrollo de software e innovación!"
  }
};

// Store para o idioma atual
export const currentLanguage = writable<'pt' | 'en' | 'es'>('en');

// Store derivado para traduções reativas
export const _ = derived(currentLanguage, ($lang) => {
  return (key: string) => {
    return translations[$lang]?.[key as keyof typeof translations[typeof $lang]] || key;
  };
});

// Função para obter tradução (não reativa)
export function t(key: string): string {
  let lang: 'pt' | 'en' | 'es' = 'en';
  const unsubscribe = currentLanguage.subscribe(value => lang = value);
  unsubscribe();
  
  return translations[lang]?.[key as keyof typeof translations[typeof lang]] || key;
}

// Função para trocar idioma
export function setLanguage(lang: 'pt' | 'en' | 'es') {
  currentLanguage.set(lang);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('preferredLanguage', lang);
  }
}

// Inicialização
export function initSimpleI18n() {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('preferredLanguage') as 'pt' | 'en' | 'es';
    if (saved && translations[saved]) {
      currentLanguage.set(saved);
    }
  }
}

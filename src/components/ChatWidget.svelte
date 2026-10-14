<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { marked } from 'marked';

  interface Message {
    role: 'user' | 'bot';
    text: string;
    grounded?: boolean;
    timestamp?: string;
  }

  let isOpen = $state(false);
  let inputText = $state('');
  let isLoading = $state(false);
  let messages = $state<Message[]>([]);
  let chatContainer: HTMLElement | null = $state(null);
  let backendUrl = $state('https://dancing-sympathy-fitting-character.trycloudflare.com');
  let sessionId = $state('');

  const TENANT = 'patrick';

  const defaultGreeting: Message = {
    role: 'bot',
    text: 'Olá! Sou a **Rohana**, concierge e cartógrafa de sistemas do Patrick.\n\nPosso te contar sobre as experiências dele em **Clojure**, sistemas distribuídos de alta frequência (**Ark Streams**, **TechSentry**), plataformas privadas de IA (**AI Factory**) ou ajudar a agendar uma conversa. Como posso te orientar hoje?',
    grounded: true
  };

  onMount(async () => {
    // 1. Session ID estável por navegador
    sessionId = localStorage.getItem('rohana_sid') || '';
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('rohana_sid', sessionId);
    }

    // 2. Carrega backend URL se existir (local ou fallback raw do repo)
    try {
      let resolved = false;
      const res = await fetch('/backend-url.txt', { cache: 'no-store' });
      if (res.ok) {
        const url = (await res.text()).trim();
        if (url.startsWith('http')) {
          backendUrl = url;
          resolved = true;
        }
      }
      if (!resolved) {
        const remoteRes = await fetch('https://raw.githubusercontent.com/patrickcmserrano/Rohana/main/docs/backend-url.txt', { cache: 'no-store' });
        if (remoteRes.ok) {
          const remoteUrl = (await remoteRes.text()).trim();
          if (remoteUrl.startsWith('http')) {
            backendUrl = remoteUrl;
          }
        }
      }
    } catch {
      // mantém o fallback padrão
    }

    // 3. Carrega histórico salvo
    try {
      const saved = localStorage.getItem('rohana_chat_history');
      if (saved) {
        messages = JSON.parse(saved);
      }
    } catch {
      messages = [];
    }

    if (messages.length === 0) {
      messages = [defaultGreeting];
    }
  });

  async function scrollToBottom() {
    await tick();
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      scrollToBottom();
    }
  }

  function renderMarkdown(content: string): string {
    try {
      return marked.parse(content, { breaks: true }) as string;
    } catch {
      return content;
    }
  }

  async function sendMessage() {
    const text = inputText.trim();
    if (!text || isLoading) return;

    inputText = '';
    messages.push({ role: 'user', text });
    isLoading = true;
    await scrollToBottom();

    try {
      // Prepara o histórico para o backend (últimas 10 mensagens)
      const history = messages
        .filter((m) => m !== defaultGreeting)
        .slice(-10)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch(new URL('/chat', backendUrl).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          tenant: TENANT,
          sessionId,
          history
        })
      });

      const data = await res.json().catch(() => ({}));

      if (data.response) {
        messages.push({
          role: 'bot',
          text: data.response,
          grounded: data.grounded
        });
      } else {
        messages.push({
          role: 'bot',
          text: res.status === 503
            ? 'Minha base de conhecimento está momentaneamente offline. Tente novamente em instantes.'
            : `Desculpe, não consegui processar sua mensagem (código ${res.status}).`,
          grounded: false
        });
      }
    } catch (err) {
      messages.push({
        role: 'bot',
        text: 'Não foi possível conectar ao servidor de IA do Patrick no momento. Se preferir, envie um e-mail direto para **patrickcmserrano@protonmail.com**.',
        grounded: false
      });
    } finally {
      isLoading = false;
      try {
        localStorage.setItem('rohana_chat_history', JSON.stringify(messages.slice(-20)));
      } catch {
        // quota excedida ou private mode
      }
      await scrollToBottom();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
</script>

<!-- Botão Flutuante (Trigger) -->
<div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
  {#if !isOpen}
    <div class="mb-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white dark:bg-white/90 dark:text-slate-900 text-xs font-semibold shadow-lg backdrop-blur border border-slate-700/50 dark:border-slate-200/50 animate-bounce">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      Converse com a Rohana (IA)
    </div>
  {/if}

  <button
    type="button"
    class="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
    aria-label={isOpen ? 'Fechar chat' : 'Abrir chat com a Rohana'}
    onclick={toggleChat}
  >
    {#if isOpen}
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
      </svg>
    {:else}
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    {/if}
    <span class="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
  </button>
</div>

<!-- Modal / Painel do Chat -->
{#if isOpen}
  <div
    class="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-full h-[540px] max-h-[calc(100vh-7rem)] flex flex-col rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-all duration-300"
  >
    <!-- Header -->
    <header class="px-4 py-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-indigo-900/40">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-sm leading-tight flex items-center gap-1.5">
            Rohana
            <span class="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Online</span>
          </h3>
          <p class="text-[11px] text-slate-300">Concierge do Patrick Campelo Serrano</p>
        </div>
      </div>
      <button
        type="button"
        class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Fechar"
        onclick={toggleChat}
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- Lista de Mensagens -->
    <div
      bind:this={chatContainer}
      class="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm scroll-smooth"
    >
      {#each messages as msg}
        <div class="flex flex-col {msg.role === 'user' ? 'items-end' : 'items-start'}">
          <span class="text-[10px] text-slate-400 mb-1 px-1 font-medium">
            {msg.role === 'user' ? 'Você' : 'Rohana'}
          </span>
          <div
            class="max-w-[85%] rounded-2xl px-4 py-2.5 {msg.role === 'user'
              ? 'bg-indigo-600 text-white rounded-tr-sm shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-sm'}"
          >
            {#if msg.role === 'bot'}
              <div class="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 [&>a]:text-indigo-600 dark:[&>a]:text-indigo-400 [&>a]:underline">
                {@html renderMarkdown(msg.text)}
              </div>
              {#if msg.grounded}
                <div class="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Grounded — ancorado no portfólio
                </div>
              {/if}
            {:else}
              <p class="whitespace-pre-wrap text-xs sm:text-sm">{msg.text}</p>
            {/if}
          </div>
        </div>
      {/each}

      {#if isLoading}
        <div class="flex flex-col items-start">
          <span class="text-[10px] text-slate-400 mb-1 px-1 font-medium">Rohana</span>
          <div class="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse [animation-delay:0.2s]"></span>
            <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse [animation-delay:0.4s]"></span>
          </div>
        </div>
      {/if}
    </div>

    <!-- Footer / Input -->
    <footer class="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-2">
        <input
          type="text"
          placeholder="Pergunte algo ou solicite contato..."
          bind:value={inputText}
          onkeydown={handleKeydown}
          disabled={isLoading}
          class="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          type="button"
          onclick={sendMessage}
          disabled={!inputText.trim() || isLoading}
          class="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-indigo-600"
          aria-label="Enviar mensagem"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
      <p class="text-[10px] text-center text-slate-400 mt-2">
        Alimentado pela engine <span class="font-semibold text-slate-600 dark:text-slate-300">Rohana</span> · LGPD por design
      </p>
    </footer>
  </div>
{/if}

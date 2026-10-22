<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import ThemeToggle from '../../../components/ThemeToggle.svelte';
  import LanguageSelector from '../../../components/LanguageSelector.svelte';
  import BlackHoleToggle from '../../../components/BlackHoleToggle.svelte';

  // Props no Svelte 5 para data injetada do load
  let { data } = $props();
  let slug = $derived(data.slug);
  let metadata = $derived(data.metadata);
  let sections = $derived(data.sections || []);

  // Mapa reativo de áudios por sectionId (inicializado do servidor e atualizado ao gravar/excluir)
  let audioMap = $state<Record<string, any>>({});

  $effect(() => {
    audioMap = { ...(data.audioManifest?.sections || {}) };
  });

  // Seções que possuem áudio gravado (na ordem do artigo)
  let recordedSections = $derived(
    sections.filter((sec: any) => Boolean(audioMap[sec.id]?.url))
  );

  let totalRecordedDuration = $derived(
    recordedSections.reduce((acc: number, sec: any) => acc + (Number(audioMap[sec.id]?.duration) || 0), 0)
  );

  // ==========================================
  // PLAYER DO LEITOR (ÁUDIO POR SEÇÃO + SEQUENCIAL)
  // ==========================================
  let audioEl: HTMLAudioElement | null = null;
  let activeSectionId = $state<string | null>(null);
  let isPlaying = $state(false);
  let currentTime = $state(0);
  let currentDuration = $state(0);
  let playbackRate = $state(1);
  let autoScrollFollow = $state(true);
  let sequentialMode = $state(true);

  let activeSectionObj = $derived(
    sections.find((s: any) => s.id === activeSectionId) || null
  );

  function formatTime(seconds: number): string {
    if (!seconds || !isFinite(seconds) || seconds < 0) return '0:00';
    const totalSec = Math.round(seconds);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function scrollToSection(sectionId: string) {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function ensureAudioElement(): HTMLAudioElement {
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.preload = 'metadata';

      audioEl.addEventListener('timeupdate', () => {
        currentTime = audioEl?.currentTime || 0;
      });

      audioEl.addEventListener('loadedmetadata', () => {
        if (audioEl && isFinite(audioEl.duration) && audioEl.duration > 0) {
          currentDuration = audioEl.duration;
        }
      });

      audioEl.addEventListener('play', () => {
        isPlaying = true;
      });

      audioEl.addEventListener('pause', () => {
        isPlaying = false;
      });

      audioEl.addEventListener('ended', () => {
        isPlaying = false;
        currentTime = 0;
        if (sequentialMode && activeSectionId) {
          const currentIdx = recordedSections.findIndex((s: any) => s.id === activeSectionId);
          if (currentIdx !== -1 && currentIdx + 1 < recordedSections.length) {
            const nextSec = recordedSections[currentIdx + 1];
            playSection(nextSec.id, true);
            return;
          }
        }
        activeSectionId = null;
      });
    }
    return audioEl;
  }

  async function playSection(sectionId: string, continueSequence = true) {
    const entry = audioMap[sectionId];
    if (!entry?.url) return;

    sequentialMode = continueSequence;
    const player = ensureAudioElement();

    if (activeSectionId === sectionId) {
      if (player.paused) {
        player.playbackRate = playbackRate;
        await player.play();
      } else {
        player.pause();
      }
      return;
    }

    activeSectionId = sectionId;
    currentTime = 0;
    currentDuration = Number(entry.duration) || 0;

    // Cache-busting leve caso tenha acabado de regravar no modo dev
    const cacheBust = entry.recordedAt ? `?v=${ encodeURIComponent(entry.recordedAt) }` : '';
    player.src = `${entry.url}${cacheBust}`;
    player.playbackRate = playbackRate;

    if (autoScrollFollow) {
      scrollToSection(sectionId);
    }

    try {
      await player.play();
    } catch (err) {
      console.error('Erro ao reproduzir áudio da seção:', err);
      isPlaying = false;
    }
  }

  function toggleGlobalPlay() {
    if (recordedSections.length === 0) return;
    if (activeSectionId && audioMap[activeSectionId]) {
      playSection(activeSectionId, true);
    } else {
      playSection(recordedSections[0].id, true);
    }
  }

  function stepSection(direction: -1 | 1) {
    if (recordedSections.length === 0) return;
    const currentIdx = recordedSections.findIndex((s: any) => s.id === activeSectionId);
    if (currentIdx === -1) {
      playSection(recordedSections[0].id, true);
      return;
    }
    const targetIdx = currentIdx + direction;
    if (targetIdx >= 0 && targetIdx < recordedSections.length) {
      playSection(recordedSections[targetIdx].id, true);
    }
  }

  function seekAudio(e: Event) {
    const target = e.target as HTMLInputElement;
    const val = Number(target.value);
    if (audioEl && isFinite(val)) {
      audioEl.currentTime = val;
      currentTime = val;
    }
  }

  function cyclePlaybackRate() {
    const rates = [1, 1.25, 1.5];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    playbackRate = rates[nextIdx];
    if (audioEl) {
      audioEl.playbackRate = playbackRate;
    }
  }

  // ==========================================
  // MODO ESTÚDIO DE GRAVAÇÃO (ADMIN / LOCALHOST)
  // ==========================================
  let isLocalAdmin = $state(false);
  let showStudioControls = $state(true);
  let audioDevices = $state<MediaDeviceInfo[]>([]);
  let selectedDeviceId = $state<string>('');

  let recordingSectionId = $state<string | null>(null);
  let isRecordingPaused = $state(false);
  let recordingSeconds = $state(0);
  let micLevel = $state(0); // 0 a 100 para VU meter
  let isSavingSection = $state<string | null>(null);
  let studioStatusMsg = $state<string>('');
  let studioErrorMsg = $state<string>('');

  let mediaRecorder: MediaRecorder | null = null;
  let mediaStream: MediaStream | null = null;
  let recordedChunks: Blob[] = [];
  let recordingTimer: ReturnType<typeof setInterval> | null = null;
  let audioCtx: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let vuRafId: number | null = null;
  let recordStartTimestamp = 0;
  let accumulatedRecordedMs = 0;

  onMount(async () => {
    const host = window.location.hostname;
    const urlParams = new URLSearchParams(window.location.search);
    if (import.meta.env.DEV || host === 'localhost' || host === '127.0.0.1' || urlParams.get('studio') === '1') {
      isLocalAdmin = true;
      await refreshMicrophones();
    }
  });

  onDestroy(() => {
    stopAllRecordingResources();
    if (audioEl) {
      audioEl.pause();
      audioEl.src = '';
    }
  });

  async function refreshMicrophones() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      audioDevices = devices.filter((d) => d.kind === 'audioinput');
      if (!selectedDeviceId && audioDevices.length > 0) {
        selectedDeviceId = audioDevices[0].deviceId;
      }
    } catch (err) {
      console.warn('Não foi possível listar microfones:', err);
    }
  }

  function stopAllRecordingResources() {
    if (recordingTimer) {
      clearInterval(recordingTimer);
      recordingTimer = null;
    }
    if (vuRafId) {
      cancelAnimationFrame(vuRafId);
      vuRafId = null;
    }
    if (audioCtx) {
      audioCtx.close().catch(() => {});
      audioCtx = null;
      analyser = null;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((t) => t.stop());
      mediaStream = null;
    }
    mediaRecorder = null;
    micLevel = 0;
  }

  function startVuMeter(stream: MediaStream) {
    try {
      audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        micLevel = Math.min(100, Math.round((avg / 128) * 100));
        vuRafId = requestAnimationFrame(updateLevel);
      };
      vuRafId = requestAnimationFrame(updateLevel);
    } catch {
      // ignora caso WebAudio falhe
    }
  }

  function getSupportedMimeType(): string {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4'
    ];
    for (const mime of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
        return mime;
      }
    }
    return '';
  }

  async function startRecordingSection(sectionId: string) {
    studioErrorMsg = '';
    studioStatusMsg = '';

    // Pausa o player se estiver tocando
    if (audioEl && !audioEl.paused) {
      audioEl.pause();
    }

    // Se já estava gravando outra seção, cancela
    if (recordingSectionId) {
      cancelRecording();
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedDeviceId
          ? {
              deviceId: { exact: selectedDeviceId },
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          : {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
      };

      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      await refreshMicrophones();

      const mimeType = getSupportedMimeType();
      mediaRecorder = mimeType
        ? new MediaRecorder(mediaStream, { mimeType })
        : new MediaRecorder(mediaStream);

      recordedChunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      mediaRecorder.start(200);
      recordingSectionId = sectionId;
      isRecordingPaused = false;
      recordingSeconds = 0;
      accumulatedRecordedMs = 0;
      recordStartTimestamp = Date.now();

      startVuMeter(mediaStream);

      recordingTimer = setInterval(() => {
        if (!isRecordingPaused) {
          const elapsedMs = accumulatedRecordedMs + (Date.now() - recordStartTimestamp);
          recordingSeconds = Math.floor(elapsedMs / 1000);
        }
      }, 250);

      scrollToSection(sectionId);
    } catch (err: any) {
      studioErrorMsg = `Erro ao acessar o microfone: ${err?.message || 'Permissão negada'}`;
      stopAllRecordingResources();
    }
  }

  function togglePauseRecording() {
    if (!mediaRecorder || !recordingSectionId) return;
    if (mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      accumulatedRecordedMs += Date.now() - recordStartTimestamp;
      isRecordingPaused = true;
    } else if (mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      recordStartTimestamp = Date.now();
      isRecordingPaused = false;
    }
  }

  function cancelRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try {
        mediaRecorder.stop();
      } catch {}
    }
    stopAllRecordingResources();
    recordedChunks = [];
    recordingSectionId = null;
    isRecordingPaused = false;
    recordingSeconds = 0;
  }

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = String(reader.result || '');
        const base64 = res.includes(',') ? res.split(',')[1] : res;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function finishAndSaveRecording(advanceToNext = false) {
    if (!mediaRecorder || !recordingSectionId) return;

    const targetSectionId = recordingSectionId;
    const sectionObj = sections.find((s: any) => s.id === targetSectionId);
    const finalElapsedMs = isRecordingPaused
      ? accumulatedRecordedMs
      : accumulatedRecordedMs + (Date.now() - recordStartTimestamp);
    const finalDurationSec = Math.max(1, Math.round(finalElapsedMs / 1000));
    const mimeType = mediaRecorder.mimeType || 'audio/webm';

    isSavingSection = targetSectionId;

    await new Promise<void>((resolve) => {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        resolve();
        return;
      }
      mediaRecorder.onstop = () => resolve();
      mediaRecorder.stop();
    });

    const blob = new Blob(recordedChunks, { type: mimeType });
    stopAllRecordingResources();
    recordingSectionId = null;
    isRecordingPaused = false;
    recordingSeconds = 0;

    try {
      const audioBase64 = await blobToBase64(blob);
      const response = await fetch('/__admin/blog-audio/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          sectionId: targetSectionId,
          title: sectionObj?.title || targetSectionId,
          duration: finalDurationSec,
          mimeType,
          audioBase64
        })
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Falha ao salvar áudio no servidor Vite.');
      }

      audioMap = {
        ...audioMap,
        [targetSectionId]: result.entry
      };

      studioStatusMsg = `✓ Áudio salvo em static/audio/posts/${slug}/${result.entry.file} (${formatTime(finalDurationSec)})`;

      if (advanceToNext) {
        const idx = sections.findIndex((s: any) => s.id === targetSectionId);
        if (idx !== -1 && idx + 1 < sections.length) {
          const nextSection = sections[idx + 1];
          scrollToSection(nextSection.id);
        }
      }
    } catch (err: any) {
      studioErrorMsg = `Não foi possível salvar no disco (certifique-se de estar rodando npm run dev): ${err?.message || err}`;
    } finally {
      isSavingSection = null;
    }
  }

  async function deleteSectionAudio(sectionId: string) {
    studioErrorMsg = '';
    studioStatusMsg = '';

    if (activeSectionId === sectionId && audioEl) {
      audioEl.pause();
      activeSectionId = null;
    }

    try {
      const response = await fetch('/__admin/blog-audio/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, sectionId })
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Erro ao remover áudio');
      }

      const updated = { ...audioMap };
      delete updated[sectionId];
      audioMap = updated;
      studioStatusMsg = `Áudio da seção "${sectionId}" removido.`;
    } catch (err: any) {
      studioErrorMsg = `Erro ao excluir áudio: ${err?.message || err}`;
    }
  }
</script>

<svelte:head>
  <title>{metadata.title} — Patrick Campelo Serrano</title>
  <meta name="description" content={metadata.excerpt} />
</svelte:head>

<div class="min-h-screen bg-slate-50/90 dark:bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300">
  <!-- Header -->
  <header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
    <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
        Patrick Campelo Serrano
      </a>
      <div class="flex items-center gap-3 md:gap-4">
        <BlackHoleToggle />
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-12">
    <!-- Back Button -->
    <div class="mb-8 flex items-center justify-between flex-wrap gap-4">
      <a href="/blog/" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
        <span class="group-hover:-translate-x-1 transition-transform">&larr;</span> 
        Voltar para todos os artigos
      </a>

      {#if isLocalAdmin}
        <button
          type="button"
          onclick={() => (showStudioControls = !showStudioControls)}
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border transition cursor-pointer
            {showStudioControls
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/40'
              : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'}"
        >
          <span class="w-2 h-2 rounded-full {showStudioControls ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}"></span>
          {showStudioControls ? '🎙️ Estúdio Admin Ativo (Ocultar)' : '🎙️ Abrir Estúdio de Gravação'}
        </button>
      {/if}
    </div>

    <!-- PAINEL DO ESTÚDIO DE GRAVAÇÃO (APENAS LOCALHOST / DEV) -->
    {#if isLocalAdmin && showStudioControls}
      <div class="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] dark:bg-amber-950/20 p-5 backdrop-blur-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
          <div>
            <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
              <span>🎙️ Estúdio de Narração por Seção (Modo Admin Local)</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Grave sua voz lendo cada seção abaixo. Os arquivos são salvos direto em <code class="px-1.5 py-0.5 rounded bg-slate-900/80 text-amber-300">static/audio/posts/{slug}/</code> prontos para commit.
            </p>
          </div>

          <div class="flex items-center gap-3 text-xs font-mono shrink-0">
            <span class="px-3 py-1.5 rounded-lg bg-slate-900/80 text-white border border-slate-700">
              {recordedSections.length} / {sections.length} seções gravadas ({formatTime(totalRecordedDuration)})
            </span>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-2 flex-wrap">
            <label for="mic-select" class="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Microfone:
            </label>
            <select
              id="mic-select"
              bind:value={selectedDeviceId}
              class="text-xs rounded-lg px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {#if audioDevices.length === 0}
                <option value="">Microfone padrão do sistema</option>
              {:else}
                {#each audioDevices as device, idx}
                  <option value={device.deviceId}>
                    {device.label || `Microfone ${idx + 1}`}
                  </option>
                {/each}
              {/if}
            </select>
            <button
              type="button"
              onclick={refreshMicrophones}
              class="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-amber-500 transition cursor-pointer"
              title="Atualizar lista de microfones"
            >
              ↻ Atualizar
            </button>
          </div>

          {#if studioStatusMsg}
            <p class="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              {studioStatusMsg}
            </p>
          {/if}
          {#if studioErrorMsg}
            <p class="text-xs font-mono text-rose-600 dark:text-rose-400">
              {studioErrorMsg}
            </p>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Article Header -->
    <header class="mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono">
        <span>{new Date(metadata.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
        <span>•</span>
        <span>{metadata.readTime || '10 min'}</span>
        {#if recordedSections.length > 0}
          <span>•</span>
          <span class="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
            🎧 Narrado pelo autor ({formatTime(totalRecordedDuration)})
          </span>
        {/if}
      </div>

      <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
        {metadata.title}
      </h1>

      <div class="flex flex-wrap gap-2">
        {#each metadata.tags as tag}
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
            {tag}
          </span>
        {/each}
      </div>
    </header>

    <!-- PLAYER GLOBAL DO ARTIGO (Exibido para leitores quando há áudio gravado) -->
    {#if recordedSections.length > 0}
      <div class="mb-10 rounded-2xl border border-indigo-500/30 bg-white/90 dark:bg-slate-900/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur-md sticky top-20 z-40">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <button
              type="button"
              onclick={toggleGlobalPlay}
              class="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 transition cursor-pointer shrink-0"
              aria-label={isPlaying ? 'Pausar narração' : 'Ouvir artigo narrado pelo autor'}
            >
              {#if isPlaying}
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              {:else}
                <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              {/if}
            </button>

            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
                  🎧 Ouvir na voz do Patrick
                </span>
                <span class="text-[11px] font-mono text-slate-400">
                  ({recordedSections.length} {recordedSections.length === 1 ? 'seção' : 'seções'} • {formatTime(totalRecordedDuration)})
                </span>
              </div>
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                {#if activeSectionObj}
                  Tocando: {activeSectionObj.title}
                {:else}
                  Clique no play para ouvir o artigo enquanto lê
                {/if}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onclick={() => stepSection(-1)}
              disabled={!activeSectionId || recordedSections.findIndex((s: any) => s.id === activeSectionId) <= 0}
              class="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-500 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
              title="Seção anterior"
            >
              ⏮
            </button>
            <button
              type="button"
              onclick={() => stepSection(1)}
              disabled={!activeSectionId || recordedSections.findIndex((s: any) => s.id === activeSectionId) >= recordedSections.length - 1}
              class="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-500 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
              title="Próxima seção"
            >
              ⏭
            </button>
            <button
              type="button"
              onclick={cyclePlaybackRate}
              class="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition cursor-pointer"
              title="Velocidade de reprodução"
            >
              {playbackRate}x
            </button>
            <label class="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer ml-1 select-none">
              <input
                type="checkbox"
                bind:checked={autoScrollFollow}
                class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="hidden md:inline">Auto-scroll</span>
            </label>
          </div>
        </div>

        {#if activeSectionId}
          <div class="mt-3 flex items-center gap-3">
            <span class="text-[11px] font-mono text-slate-500 w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={currentDuration || 1}
              step="0.1"
              value={currentTime}
              oninput={seekAudio}
              class="flex-1 accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <span class="text-[11px] font-mono text-slate-500 w-10">{formatTime(currentDuration)}</span>
          </div>
        {/if}

        <!-- Pílulas rápidas das seções narradas -->
        <div class="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1">
          {#each recordedSections as sec, idx}
            <button
              type="button"
              onclick={() => playSection(sec.id, true)}
              class="px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition cursor-pointer shrink-0
                {activeSectionId === sec.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400'}"
            >
              {idx + 1}. {sec.title}
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Article Content dividido por Seções -->
    <article class="prose prose-slate dark:prose-invert max-w-none md:prose-lg prose-pre:bg-slate-900 dark:prose-pre:bg-slate-900/60 prose-pre:border prose-pre:border-slate-800 prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-2xl">
      {#each sections as section, idx (section.id)}
        {@const sectionAudio = audioMap[section.id]}
        {@const isThisPlaying = activeSectionId === section.id && isPlaying}
        {@const isThisActive = activeSectionId === section.id}
        {@const isThisRecording = recordingSectionId === section.id}
        {@const isThisSaving = isSavingSection === section.id}

        <section
          id="section-{section.id}"
          data-section-id={section.id}
          class="relative rounded-2xl transition-all duration-300 my-4
            {isThisActive
              ? 'border-l-4 border-indigo-500 bg-indigo-500/[0.04] dark:bg-indigo-500/[0.07] pl-4 md:pl-6 pr-3 py-3'
              : isThisRecording
                ? 'border-l-4 border-rose-500 bg-rose-500/[0.05] dark:bg-rose-500/[0.08] pl-4 md:pl-6 pr-3 py-3'
                : ''}"
        >
          <!-- Barra de Controles de Gravação do Admin (Localhost) -->
          {#if isLocalAdmin && showStudioControls}
            <div class="not-prose mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-slate-100/90 dark:bg-slate-900/90 px-3.5 py-2 text-xs">
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-slate-500 dark:text-slate-400">
                  #{idx + 1}
                </span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">
                  {section.title}
                </span>
                {#if sectionAudio}
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    ✓ Gravado ({formatTime(sectionAudio.duration)})
                  </span>
                {:else}
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-500">
                    Sem áudio
                  </span>
                {/if}
              </div>

              <div class="flex items-center gap-2 flex-wrap">
                {#if isThisRecording}
                  <!-- Controles ativos durante a gravação -->
                  <div class="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 font-mono">
                    <span class="w-2 h-2 rounded-full bg-rose-500 {isRecordingPaused ? '' : 'animate-ping'}"></span>
                    <span>{isRecordingPaused ? 'PAUSADO' : 'GRAVANDO'} {formatTime(recordingSeconds)}</span>
                    <!-- Mini VU Meter -->
                    <div class="w-16 h-2 bg-slate-800 rounded-full overflow-hidden" title="Nível do microfone">
                      <div
                        class="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-75"
                        style="width: {micLevel}%"
                      ></div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onclick={togglePauseRecording}
                    class="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold transition cursor-pointer"
                  >
                    {isRecordingPaused ? '▶ Retomar' : '⏸ Pausar'}
                  </button>

                  <button
                    type="button"
                    onclick={() => finishAndSaveRecording(false)}
                    class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition cursor-pointer"
                  >
                    ✓ Salvar
                  </button>

                  {#if idx + 1 < sections.length}
                    <button
                      type="button"
                      onclick={() => finishAndSaveRecording(true)}
                      class="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition cursor-pointer"
                      title="Salvar esta seção e rolar para a próxima"
                    >
                      ✓ Salvar + Próxima &rarr;
                    </button>
                  {/if}

                  <button
                    type="button"
                    onclick={cancelRecording}
                    class="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  >
                    ✕ Cancelar
                  </button>
                {:else if isThisSaving}
                  <span class="font-mono text-amber-500 animate-pulse">Salvando áudio em disco...</span>
                {:else}
                  <button
                    type="button"
                    onclick={() => startRecordingSection(section.id)}
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition cursor-pointer
                      {sectionAudio
                        ? 'bg-slate-200 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'}"
                  >
                    <span class="w-2 h-2 rounded-full bg-current"></span>
                    {sectionAudio ? 'Regravar' : 'Gravar seção'}
                  </button>

                  {#if sectionAudio}
                    <button
                      type="button"
                      onclick={() => playSection(section.id, false)}
                      class="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-600 dark:text-indigo-300 font-semibold transition cursor-pointer"
                    >
                      {isThisPlaying ? '⏸ Pausar' : '▶ Ouvir'}
                    </button>
                    <button
                      type="button"
                      onclick={() => deleteSectionAudio(section.id)}
                      class="px-2 py-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Excluir áudio desta seção"
                    >
                      🗑
                    </button>
                  {/if}
                {/if}
              </div>
            </div>
          {/if}

          <!-- Cabeçalho da Seção (H2) + Botão de Ouvir Seção para o Leitor -->
          {#if section.isIntro}
            {#if sectionAudio}
              <div class="not-prose mb-4 flex items-center">
                <button
                  type="button"
                  onclick={() => playSection(section.id, true)}
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold border transition cursor-pointer
                    {isThisPlaying
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25 hover:bg-indigo-500/20'}"
                >
                  <span>{isThisPlaying ? '⏸ Ouvindo introdução...' : `▶ Ouvir introdução (${formatTime(sectionAudio.duration)})`}</span>
                </button>
              </div>
            {/if}
          {:else}
            <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div class="flex-1">
                {@html section.headingHtml}
              </div>

              {#if sectionAudio}
                <div class="not-prose shrink-0 mb-2 sm:mb-0">
                  <button
                    type="button"
                    onclick={() => playSection(section.id, true)}
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold border transition cursor-pointer
                      {isThisPlaying
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25 hover:bg-indigo-500/20'}"
                  >
                    <span>{isThisPlaying ? '⏸ Ouvindo seção...' : `▶ Ouvir seção (${formatTime(sectionAudio.duration)})`}</span>
                  </button>
                </div>
              {/if}
            </div>
          {/if}

          <!-- Corpo HTML da Seção -->
          {@html section.bodyHtml}
        </section>
      {/each}
    </article>
  </main>
</div>

<style>
  /* Custom overrides for smooth typography */
  :global(.prose) {
    --tw-prose-body: var(--app-text);
  }
  
  /* Garantir que blocos de código ocupem toda a largura e tenham scroll horizontal */
  :global(pre) {
    overflow-x: auto;
    padding: 1.25rem;
    border-radius: 0.75rem;
    font-size: 0.9em;
  }
  
  :global(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
</style>

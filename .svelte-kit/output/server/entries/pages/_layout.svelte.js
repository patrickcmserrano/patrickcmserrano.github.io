import "clsx";
import { a as attr, p as pop, b as push, c as attr_class, e as escape_html, s as stringify, d as store_get, f as attr_style, g as ensure_array_like, u as unsubscribe_stores } from "../../chunks/index.js";
import { i as initSimpleI18n } from "../../chunks/simple-i18n.js";
import "marked";
import { S as SAGITTARIUS_A_PRESET, i as iscoRadius, e as earthScreenPosition, v as viewFromEarth, l as lookAtEarth, r as requestCameraPolar, a as isBlackHoleOpen, b as activeCelestialTarget, c as isInterstellarTraveling, d as interstellarTravelTarget, f as blackHoleFps, g as blackHoleConfig } from "../../chunks/blackhole.js";
function ChatWidget($$payload, $$props) {
  push();
  $$payload.out += `<div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="mb-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white dark:bg-white/90 dark:text-slate-900 text-xs font-semibold shadow-lg backdrop-blur border border-slate-700/50 dark:border-slate-200/50 animate-bounce"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Converse com a Rohana (IA)</div>`;
  }
  $$payload.out += `<!--]--> <button type="button" class="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-500/30"${attr("aria-label", "Abrir chat com a Rohana")}>`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>`;
  }
  $$payload.out += `<!--]--> <span class="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full"></span></button></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function BlackHole($$payload, $$props) {
  push();
  $$payload.out += `<canvas class="block w-full h-full"></canvas>`;
  pop();
}
function EarthView($$payload, $$props) {
  push();
  let {
    fastDayNightCycle = false,
    showMarkers = true
  } = $$props;
  let utcTimeStr = "";
  let brtTimeStr = "";
  let subsolarCoordsStr = "";
  $$payload.out += `<div class="relative w-full h-full pointer-events-auto"><canvas class="block w-full h-full pointer-events-auto"></canvas> <div class="absolute top-20 left-4 md:left-6 z-20 pointer-events-none"><div class="bg-black/65 backdrop-blur-md border border-cyan-500/25 rounded-xl px-3.5 py-2 text-white shadow-lg flex flex-col gap-0.5"><div class="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-cyan-300"><span${attr_class(`w-1.5 h-1.5 rounded-full ${stringify(fastDayNightCycle ? "bg-amber-400 animate-ping" : "bg-emerald-400")}`)}></span> <span>${escape_html(fastDayNightCycle ? "Terminador Solar • Simulação 24h" : "Terminador Solar • Tempo Real")}</span></div> <div class="text-xs font-mono font-bold text-slate-100 flex items-center gap-2"><span>${escape_html(brtTimeStr)}</span> <span class="text-slate-500">•</span> <span class="text-slate-300">${escape_html(utcTimeStr)}</span></div> <div class="text-[10px] font-mono text-slate-400">Zênite Solar: <span class="text-cyan-200">${escape_html(subsolarCoordsStr)}</span></div></div></div> `;
  if (showMarkers) {
    $$payload.out += "<!--[-->";
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function BlackHoleOverlay($$payload, $$props) {
  push();
  var $$store_subs;
  let panelOpen = true;
  let showEarth = true;
  let earthFastCycle = false;
  let earthShowMarkers = true;
  const qualities = [
    { id: "auto", label: "Auto" },
    { id: "performance", label: "Perf." },
    { id: "balanced", label: "Equil." },
    { id: "ultra", label: "Ultra" }
  ];
  const cameras = [
    {
      label: "Visão da Terra (EHT)",
      action: () => viewFromEarth()
    },
    {
      label: "Rumo à Terra",
      action: () => lookAtEarth()
    },
    {
      label: "Gargantua (82°)",
      action: () => requestCameraPolar(82)
    },
    {
      label: "Polar (5°)",
      action: () => requestCameraPolar(5)
    }
  ];
  let edgePos = (() => {
    if (!store_get($$store_subs ??= {}, "$earthScreenPosition", earthScreenPosition) || typeof window === "undefined") return null;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const margin = 70;
    const cx = w * 0.5;
    const cy = h * 0.5;
    const maxRx = Math.max(80, cx - margin);
    const maxRy = Math.max(80, cy - margin);
    const ang = store_get($$store_subs ??= {}, "$earthScreenPosition", earthScreenPosition).angleRad;
    const ex = cx + Math.cos(ang) * maxRx;
    const ey = cy + Math.sin(ang) * maxRy;
    const deg = ang * 180 / Math.PI + 90;
    return { x: ex, y: ey, deg };
  })();
  const chip = "px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-colors cursor-pointer";
  const on = "bg-amber-500/20 border-amber-400/60 text-amber-200";
  const onCyan = "bg-cyan-500/20 border-cyan-400/60 text-cyan-200";
  const off = "bg-white/5 border-white/15 text-slate-300 hover:bg-white/10";
  $$payload.out += `<div${attr_class(`fixed inset-0 overflow-hidden transition-all duration-700 ${stringify(store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) ? "z-[100] pointer-events-auto" : "z-0 pointer-events-none")}`, "svelte-1eiyjfx")}${attr("role", store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) ? "dialog" : "presentation")}${attr("aria-label", store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) ? "Visualização Astronômica 3D" : void 0)}${attr("aria-modal", store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) ? "true" : void 0)}><div${attr_class(`absolute inset-0 z-0 w-full h-full ${stringify(store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) && store_get($$store_subs ??= {}, "$activeCelestialTarget", activeCelestialTarget) === "earth" ? "opacity-0 pointer-events-none" : "opacity-100")} transition-opacity duration-500`, "svelte-1eiyjfx")}>`;
  BlackHole($$payload, {
    isAmbient: !store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) || store_get($$store_subs ??= {}, "$activeCelestialTarget", activeCelestialTarget) === "earth"
  });
  $$payload.out += `<!----></div> `;
  if (store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) && store_get($$store_subs ??= {}, "$activeCelestialTarget", activeCelestialTarget) === "earth") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="absolute inset-0 z-0 w-full h-full pointer-events-auto animate-fade-in svelte-1eiyjfx">`;
    EarthView($$payload, {
      fastDayNightCycle: earthFastCycle,
      showMarkers: earthShowMarkers
    });
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (store_get($$store_subs ??= {}, "$isInterstellarTraveling", isInterstellarTraveling)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center warp-overlay svelte-1eiyjfx"><div class="warp-tunnel svelte-1eiyjfx"></div> <div class="relative z-10 px-6 py-4 rounded-2xl bg-black/80 border border-cyan-400/50 backdrop-blur-xl text-center shadow-2xl svelte-1eiyjfx"><div class="text-xs font-mono uppercase tracking-[0.25em] text-cyan-300 animate-pulse svelte-1eiyjfx">${escape_html(store_get($$store_subs ??= {}, "$interstellarTravelTarget", interstellarTravelTarget) === "earth" ? "🚀 Salto Interestelar • Rumo ao Sistema Solar" : "🕳️ Salto Interestelar • Rumo ao Centro Galáctico")}</div> <div class="text-lg md:text-2xl font-extrabold font-mono text-white mt-1 svelte-1eiyjfx">${escape_html(store_get($$store_subs ??= {}, "$interstellarTravelTarget", interstellarTravelTarget) === "earth" ? "Sagittarius A* → Planeta Terra (26.670 al)" : "Planeta Terra → Sagittarius A* (26.670 al)")}</div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div${attr_class(`absolute inset-0 pointer-events-none transition-opacity duration-700 ${stringify(store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) ? "opacity-0" : "opacity-100 bg-[#030712]/60 dark:bg-[#000000]/55 backdrop-blur-[0.5px]")}`, "svelte-1eiyjfx")}></div> `;
  if (store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="relative z-30 w-full p-4 md:p-6 flex items-start justify-between pointer-events-none gap-3 animate-fade-in flex-wrap svelte-1eiyjfx">`;
    if (store_get($$store_subs ??= {}, "$activeCelestialTarget", activeCelestialTarget) === "sgr-a") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white shadow-xl flex items-center gap-3 svelte-1eiyjfx"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping svelte-1eiyjfx"></span> <div class="flex flex-col svelte-1eiyjfx"><span class="text-xs md:text-sm font-bold tracking-wide font-mono text-amber-300 svelte-1eiyjfx">${escape_html(SAGITTARIUS_A_PRESET.name.toUpperCase())} • ${escape_html(SAGITTARIUS_A_PRESET.subtitle)}</span> <span class="text-[10px] md:text-xs text-slate-400 hidden sm:inline svelte-1eiyjfx">Arraste para orbitar • Scroll para zoom • ${escape_html(store_get($$store_subs ??= {}, "$blackHoleFps", blackHoleFps))} FPS</span></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="pointer-events-auto bg-black/60 backdrop-blur-md border border-cyan-500/30 px-4 py-2 rounded-2xl text-white shadow-xl flex items-center gap-3 svelte-1eiyjfx"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping svelte-1eiyjfx"></span> <div class="flex flex-col svelte-1eiyjfx"><span class="text-xs md:text-sm font-bold tracking-wide font-mono text-cyan-300 svelte-1eiyjfx">PLANETA TERRA • BRAÇO DE ÓRION (VIA LÁCTEA)</span> <span class="text-[10px] md:text-xs text-slate-400 hidden sm:inline svelte-1eiyjfx">Arraste para girar o globo • Scroll para zoom orbital • ${escape_html(store_get($$store_subs ??= {}, "$blackHoleFps", blackHoleFps))} FPS</span></div></div>`;
    }
    $$payload.out += `<!--]--> <div class="flex items-center gap-2 pointer-events-auto flex-wrap svelte-1eiyjfx">`;
    if (store_get($$store_subs ??= {}, "$activeCelestialTarget", activeCelestialTarget) === "sgr-a") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button type="button"${attr_class(`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${stringify("bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20")}`, "svelte-1eiyjfx")}${attr("aria-pressed", showEarth)} aria-label="Alternar indicador de onde fica a Terra"><span class="text-sm svelte-1eiyjfx">🌍</span> <span class="hidden sm:inline svelte-1eiyjfx">${escape_html("Terra visível")}</span></button> <button type="button" class="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold backdrop-blur-md border border-cyan-400/80 bg-cyan-500/30 hover:bg-cyan-400 hover:text-slate-950 text-cyan-100 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer svelte-1eiyjfx" aria-label="Viajar até a visualização realista da Terra"><span class="svelte-1eiyjfx">🚀</span> <span class="svelte-1eiyjfx">Viajar à Terra</span></button>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<button type="button"${attr_class(`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${stringify("bg-emerald-500/25 border-emerald-400 text-emerald-200")}`, "svelte-1eiyjfx")}><span class="svelte-1eiyjfx">📍</span> <span class="hidden sm:inline svelte-1eiyjfx">${escape_html("Marcadores ativos")}</span></button> <button type="button" class="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold backdrop-blur-md border border-amber-400/80 bg-amber-500/30 hover:bg-amber-400 hover:text-slate-950 text-amber-100 shadow-lg shadow-amber-500/25 transition-all cursor-pointer svelte-1eiyjfx" aria-label="Viajar de volta para Sagittarius A*"><span class="svelte-1eiyjfx">🕳️</span> <span class="svelte-1eiyjfx">Voltar a Sagittarius A*</span></button>`;
    }
    $$payload.out += `<!--]--> <button type="button" class="px-3 py-2 bg-black/60 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl text-xs font-semibold cursor-pointer svelte-1eiyjfx"${attr("aria-expanded", panelOpen)} aria-label="Alternar painel de controles">${escape_html("Ocultar painel")}</button> <button type="button" class="group flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-white/10 active:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/50 text-white rounded-2xl text-xs md:text-sm font-semibold tracking-wide transition-all duration-200 shadow-xl cursor-pointer svelte-1eiyjfx" aria-label="Fechar visualização"><span class="hidden sm:inline text-slate-300 group-hover:text-white transition-colors svelte-1eiyjfx">Fechar</span> <span class="font-mono text-[10px] text-slate-400 border border-white/20 rounded px-1.5 py-0.5 hidden md:inline svelte-1eiyjfx">ESC</span> <svg class="w-4 h-4 text-slate-300 group-hover:text-white transition-colors svelte-1eiyjfx" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" class="svelte-1eiyjfx"></path></svg></button></div></div> `;
    if (store_get($$store_subs ??= {}, "$activeCelestialTarget", activeCelestialTarget) === "sgr-a") {
      $$payload.out += "<!--[-->";
      if (store_get($$store_subs ??= {}, "$earthScreenPosition", earthScreenPosition)) {
        $$payload.out += "<!--[-->";
        if (store_get($$store_subs ??= {}, "$earthScreenPosition", earthScreenPosition).visible) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div class="absolute z-20 pointer-events-none transition-all duration-100 ease-out animate-fade-in svelte-1eiyjfx"${attr_style(`left: ${stringify(store_get($$store_subs ??= {}, "$earthScreenPosition", earthScreenPosition).x)}px; top: ${stringify(store_get($$store_subs ??= {}, "$earthScreenPosition", earthScreenPosition).y)}px; transform: translate(-50%, -50%);`)}><div class="relative flex items-center justify-center svelte-1eiyjfx"><div class="absolute w-14 h-14 rounded-full border border-cyan-400/40 animate-ping pointer-events-none svelte-1eiyjfx"></div> <button type="button" class="w-10 h-10 rounded-full border-2 border-cyan-400 bg-cyan-950/70 hover:bg-cyan-500/40 backdrop-blur-md flex items-center justify-center shadow-lg shadow-cyan-500/50 pointer-events-auto cursor-pointer transition-transform hover:scale-110 svelte-1eiyjfx" title="Viajar para a Terra"><span class="text-base select-none svelte-1eiyjfx">🌍</span></button> <div class="absolute left-13 top-0 -translate-y-1/2 w-68 sm:w-76 bg-black/85 backdrop-blur-md border border-cyan-400/50 rounded-2xl p-3.5 shadow-2xl text-white pointer-events-auto svelte-1eiyjfx"><div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-cyan-500/20 svelte-1eiyjfx"><span class="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5 svelte-1eiyjfx"><span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse svelte-1eiyjfx"></span> TERRA / SISTEMA SOLAR</span> <span class="text-[10px] text-cyan-200/80 font-mono svelte-1eiyjfx">l=180° b=+0.14°</span></div> <p class="text-[11px] text-slate-300 leading-snug svelte-1eiyjfx">Localizada a <strong class="text-cyan-200 svelte-1eiyjfx">26.670 anos-luz</strong> de Sagittarius A*, na direção do Anti-centro Galáctico (constelação de Touro/Auriga).</p> <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2 svelte-1eiyjfx"><button type="button" class="px-2.5 py-1.5 rounded-lg text-[10px] bg-white/5 hover:bg-white/15 text-slate-200 border border-white/15 font-mono font-medium transition cursor-pointer svelte-1eiyjfx">Centrar mira</button> <button type="button" class="flex-1 px-3 py-1.5 rounded-lg text-[11px] bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold shadow-lg shadow-cyan-500/30 transition cursor-pointer flex items-center justify-center gap-1.5 svelte-1eiyjfx"><span class="svelte-1eiyjfx">🚀 Viajar</span> <span class="svelte-1eiyjfx">→</span></button></div></div></div></div>`;
        } else if (edgePos) {
          $$payload.out += "<!--[1-->";
          $$payload.out += `<div class="absolute z-20 pointer-events-auto animate-fade-in svelte-1eiyjfx"${attr_style(`left: ${stringify(edgePos.x)}px; top: ${stringify(edgePos.y)}px; transform: translate(-50%, -50%);`)}><div class="flex items-center gap-1.5 p-1 pl-3 rounded-full bg-black/85 border border-cyan-400/60 text-cyan-300 text-xs font-mono shadow-xl backdrop-blur-md svelte-1eiyjfx"><button type="button" class="flex items-center gap-1.5 pr-1 hover:text-white transition cursor-pointer svelte-1eiyjfx" title="Girar câmera em direção à Terra"><span${attr_style(`transform: rotate(${stringify(edgePos.deg)}deg); display: inline-block;`)} class="svelte-1eiyjfx">↑</span> <span class="svelte-1eiyjfx">🌍 Terra (26.670 al)</span></button> <button type="button" class="px-2.5 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold transition cursor-pointer svelte-1eiyjfx">🚀 Viajar</button></div></div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]-->`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      {
        $$payload.out += "<!--[-->";
        const each_array = ensure_array_like(cameras);
        const each_array_1 = ensure_array_like(qualities);
        $$payload.out += `<div class="absolute z-30 pointer-events-auto bottom-4 left-4 right-4 md:right-auto md:w-80 bg-black/65 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white shadow-xl flex flex-col gap-3 max-h-[60vh] overflow-y-auto animate-fade-in svelte-1eiyjfx"><div class="svelte-1eiyjfx"><div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1 svelte-1eiyjfx">Ficha astrofísica</div> <dl class="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] font-mono text-slate-300 svelte-1eiyjfx"><dt class="text-slate-500 svelte-1eiyjfx">Massa</dt><dd class="svelte-1eiyjfx">${escape_html((SAGITTARIUS_A_PRESET.massSolar / 1e6).toFixed(2))}×10⁶ M☉</dd> <dt class="text-slate-500 svelte-1eiyjfx">Distância</dt><dd class="svelte-1eiyjfx">${escape_html(SAGITTARIUS_A_PRESET.distanceLy.toLocaleString("pt-BR"))} al</dd> <dt class="text-slate-500 svelte-1eiyjfx">Spin a*</dt><dd class="svelte-1eiyjfx">≈ ${escape_html(SAGITTARIUS_A_PRESET.spin.toFixed(2))}</dd> <dt class="text-slate-500 svelte-1eiyjfx">ISCO</dt><dd class="svelte-1eiyjfx">${escape_html(iscoRadius(SAGITTARIUS_A_PRESET.spin).toFixed(2))} GM/c²</dd> <dt class="text-slate-500 svelte-1eiyjfx">Sombra</dt><dd class="svelte-1eiyjfx">${escape_html(SAGITTARIUS_A_PRESET.shadowMicroArcsec)} µas</dd></dl></div> <div class="svelte-1eiyjfx"><div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1 svelte-1eiyjfx">Espectro</div> <div class="flex gap-1.5 flex-wrap svelte-1eiyjfx"><button type="button"${attr_class(`${stringify(chip)} ${stringify(store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).spectralMode === "visible" ? on : off)}`, "svelte-1eiyjfx")}>Visível</button> <button type="button"${attr_class(`${stringify(chip)} ${stringify(store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).spectralMode === "eht" ? on : off)}`, "svelte-1eiyjfx")}>EHT 230 GHz</button></div></div> <div class="svelte-1eiyjfx"><div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1 svelte-1eiyjfx">Física</div> <div class="flex gap-1.5 flex-wrap svelte-1eiyjfx"><button type="button"${attr_class(`${stringify(chip)} ${stringify(store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).enableLensing ? on : off)}`, "svelte-1eiyjfx")}${attr("aria-pressed", store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).enableLensing)}>Lente gravitacional</button> <button type="button"${attr_class(`${stringify(chip)} ${stringify(store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).enableDoppler ? on : off)}`, "svelte-1eiyjfx")}${attr("aria-pressed", store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).enableDoppler)}>Doppler</button></div></div> <div class="svelte-1eiyjfx"><div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1 svelte-1eiyjfx">Câmera</div> <div class="flex gap-1.5 flex-wrap svelte-1eiyjfx"><!--[-->`;
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cam = each_array[$$index];
          $$payload.out += `<button type="button"${attr_class(`${stringify(chip)} ${stringify(off)}`, "svelte-1eiyjfx")}>${escape_html(cam.label)}</button>`;
        }
        $$payload.out += `<!--]--> <button type="button"${attr_class(`${stringify(chip)} ${stringify(store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).autoRotate ? on : off)}`, "svelte-1eiyjfx")}${attr("aria-pressed", store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).autoRotate)}>Auto-órbita</button></div></div> <div class="svelte-1eiyjfx"><div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1 svelte-1eiyjfx">Qualidade</div> <div class="flex gap-1.5 flex-wrap svelte-1eiyjfx"><!--[-->`;
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let q = each_array_1[$$index_1];
          $$payload.out += `<button type="button"${attr_class(`${stringify(chip)} ${stringify(store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).quality === q.id ? on : off)}`, "svelte-1eiyjfx")}>${escape_html(q.label)}</button>`;
        }
        $$payload.out += `<!--]--></div></div></div>`;
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
      {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="absolute z-30 pointer-events-auto bottom-4 left-4 right-4 md:right-auto md:w-84 bg-black/70 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 text-white shadow-xl flex flex-col gap-3 max-h-[65vh] overflow-y-auto animate-fade-in svelte-1eiyjfx"><div class="svelte-1eiyjfx"><div class="text-[10px] uppercase tracking-widest text-cyan-300/90 font-mono mb-1 svelte-1eiyjfx">Ficha Planetária • Terra</div> <dl class="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] font-mono text-slate-300 svelte-1eiyjfx"><dt class="text-slate-500 svelte-1eiyjfx">Massa</dt><dd class="svelte-1eiyjfx">5,972 × 10²⁴ kg</dd> <dt class="text-slate-500 svelte-1eiyjfx">Raio Equatorial</dt><dd class="svelte-1eiyjfx">6.378,1 km</dd> <dt class="text-slate-500 svelte-1eiyjfx">Inclinação Axial</dt><dd class="svelte-1eiyjfx">23,44°</dd> <dt class="text-slate-500 svelte-1eiyjfx">Vel. Orbital</dt><dd class="svelte-1eiyjfx">29,78 km/s</dd> <dt class="text-slate-500 svelte-1eiyjfx">Dist. a Sgr A*</dt><dd class="svelte-1eiyjfx">26.670 al</dd></dl></div> <div class="svelte-1eiyjfx"><div class="text-[10px] uppercase tracking-widest text-cyan-300/90 font-mono mb-1 svelte-1eiyjfx">Camadas Físicas &amp; Shader</div> <div class="flex gap-1.5 flex-wrap svelte-1eiyjfx"><button type="button"${attr_class(`${stringify(chip)} ${stringify(onCyan)}`, "svelte-1eiyjfx")}>Nuvens dinâmicas</button> <button type="button"${attr_class(`${stringify(chip)} ${stringify(onCyan)}`, "svelte-1eiyjfx")}>Atmosfera Rayleigh</button> <button type="button"${attr_class(`${stringify(chip)} ${stringify(onCyan)}`, "svelte-1eiyjfx")}>Luzes noturnas</button> <button type="button"${attr_class(`${stringify(chip)} ${stringify(off)}`, "svelte-1eiyjfx")}>Ciclo Dia/Noite rápido</button></div></div> <div class="svelte-1eiyjfx"><div class="text-[10px] uppercase tracking-widest text-cyan-300/90 font-mono mb-1 svelte-1eiyjfx">Órbita &amp; Pontos de Interesse</div> <div class="flex gap-1.5 flex-wrap svelte-1eiyjfx"><button type="button"${attr_class(`${stringify(chip)} ${stringify(off)}`, "svelte-1eiyjfx")}>🇧🇷 Brasil (Niterói/RJ)</button> <button type="button"${attr_class(`${stringify(chip)} ${stringify(off)}`, "svelte-1eiyjfx")}>🌅 Linha do Terminador</button> <button type="button"${attr_class(`${stringify(chip)} ${stringify(off)}`, "svelte-1eiyjfx")}>🛰️ Órbita Baixa (ISS)</button> <button type="button"${attr_class(`${stringify(chip)} ${stringify(off)}`, "svelte-1eiyjfx")}>🌃 Lado Noturno</button> <button type="button"${attr_class(`${stringify(chip)} ${stringify(off)}`, "svelte-1eiyjfx")}>🌕 Vista da Lua</button></div></div> <div class="pt-1 border-t border-white/10 svelte-1eiyjfx"><button type="button" class="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center gap-2 svelte-1eiyjfx"><span class="svelte-1eiyjfx">🕳️ Viajar de volta a Sagittarius A*</span> <span class="svelte-1eiyjfx">→</span></button></div></div>`;
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _layout($$payload, $$props) {
  push();
  initSimpleI18n();
  let { children } = $$props;
  $$payload.out += `<div class="relative z-10">`;
  children($$payload);
  $$payload.out += `<!----></div> `;
  ChatWidget($$payload);
  $$payload.out += `<!----> `;
  BlackHoleOverlay($$payload);
  $$payload.out += `<!---->`;
  pop();
}
export {
  _layout as default
};

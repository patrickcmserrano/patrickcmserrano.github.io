import "clsx";
import { a as attr, p as pop, b as push, s as store_get, c as attr_class, d as stringify, e as escape_html, f as attr_style, g as ensure_array_like, u as unsubscribe_stores } from "../../chunks/index.js";
import { i as initSimpleI18n } from "../../chunks/simple-i18n.js";
import "marked";
import { S as SAGITTARIUS_A_PRESET, i as iscoRadius, e as earthScreenPosition, v as viewFromEarth, l as lookAtEarth, r as requestCameraPolar, a as isBlackHoleOpen, b as blackHoleFps, c as blackHoleConfig } from "../../chunks/blackhole.js";
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
function BlackHoleOverlay($$payload, $$props) {
  push();
  var $$store_subs;
  let panelOpen = true;
  let showEarth = true;
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
  const off = "bg-white/5 border-white/15 text-slate-300 hover:bg-white/10";
  $$payload.out += `<div${attr_class(`fixed inset-0 overflow-hidden transition-all duration-700 pointer-events-none ${stringify(store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) ? "z-[100] pointer-events-auto" : "z-0")}`)}${attr("role", store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) ? "dialog" : "presentation")}${attr("aria-label", store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) ? "Visualização do Black Hole" : void 0)}${attr("aria-modal", store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) ? "true" : void 0)}><div class="absolute inset-0 z-0 w-full h-full">`;
  BlackHole($$payload, {
    isAmbient: !store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen)
  });
  $$payload.out += `<!----></div> <div${attr_class(`absolute inset-0 pointer-events-none transition-opacity duration-700 ${stringify(store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen) ? "opacity-0" : "opacity-100 bg-[#030712]/60 dark:bg-[#000000]/55 backdrop-blur-[0.5px]")}`)}></div> `;
  if (store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="relative z-10 w-full p-4 md:p-6 flex items-start justify-between pointer-events-none gap-3 animate-fade-in svelte-etlq64"><div class="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white shadow-xl flex items-center gap-3"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span> <div class="flex flex-col"><span class="text-xs md:text-sm font-bold tracking-wide font-mono text-amber-300">${escape_html(SAGITTARIUS_A_PRESET.name.toUpperCase())} • ${escape_html(SAGITTARIUS_A_PRESET.subtitle)}</span> <span class="text-[10px] md:text-xs text-slate-400 hidden sm:inline">Arraste para orbitar • Scroll para zoom • ${escape_html(store_get($$store_subs ??= {}, "$blackHoleFps", blackHoleFps))} FPS</span></div></div> <div class="flex items-center gap-2 pointer-events-auto"><button type="button"${attr_class(`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${stringify("bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20")}`)}${attr("aria-pressed", showEarth)} aria-label="Alternar indicador de onde fica a Terra"><span class="text-sm">🌍</span> <span class="hidden sm:inline">${escape_html("Terra visível")}</span></button> <button type="button" class="px-3 py-2 bg-black/60 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl text-xs font-semibold cursor-pointer"${attr("aria-expanded", panelOpen)} aria-label="Alternar painel de controles">${escape_html("Ocultar painel")}</button> <button type="button" class="group flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-white/10 active:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/50 text-white rounded-2xl text-xs md:text-sm font-semibold tracking-wide transition-all duration-200 shadow-xl cursor-pointer" aria-label="Fechar visualização do Black Hole"><span class="hidden sm:inline text-slate-300 group-hover:text-white transition-colors">Fechar</span> <span class="font-mono text-[10px] text-slate-400 border border-white/20 rounded px-1.5 py-0.5 hidden md:inline">ESC</span> <svg class="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div></div> `;
    if (store_get($$store_subs ??= {}, "$earthScreenPosition", earthScreenPosition)) {
      $$payload.out += "<!--[-->";
      if (store_get($$store_subs ??= {}, "$earthScreenPosition", earthScreenPosition).visible) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="absolute z-20 pointer-events-none transition-all duration-100 ease-out animate-fade-in svelte-etlq64"${attr_style(`left: ${stringify(store_get($$store_subs ??= {}, "$earthScreenPosition", earthScreenPosition).x)}px; top: ${stringify(store_get($$store_subs ??= {}, "$earthScreenPosition", earthScreenPosition).y)}px; transform: translate(-50%, -50%);`)}><div class="relative flex items-center justify-center"><div class="absolute w-14 h-14 rounded-full border border-cyan-400/40 animate-ping pointer-events-none"></div> <div class="w-9 h-9 rounded-full border-2 border-cyan-400 bg-cyan-950/50 backdrop-blur-md flex items-center justify-center shadow-lg shadow-cyan-500/50"><span class="text-sm select-none">🌍</span></div> <div class="absolute left-12 top-0 -translate-y-1/2 w-64 sm:w-72 bg-black/85 backdrop-blur-md border border-cyan-400/50 rounded-2xl p-3.5 shadow-2xl text-white pointer-events-auto"><div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-cyan-500/20"><span class="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> TERRA / SISTEMA SOLAR</span> <span class="text-[10px] text-cyan-200/80 font-mono">l=180° b=+0.14°</span></div> <p class="text-[11px] text-slate-300 leading-snug">Localizada a <strong class="text-cyan-200">26.670 anos-luz</strong> de Sagittarius A*, na direção do Anti-centro Galáctico (constelação de Touro/Auriga).</p> <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between"><span class="text-[10px] text-slate-400 font-mono">Tempo-luz: ~26.700 anos</span> <button type="button" class="px-2.5 py-1 rounded-lg text-[10px] bg-cyan-500/25 hover:bg-cyan-500/45 text-cyan-200 border border-cyan-400/40 font-mono font-medium transition cursor-pointer">Centrar mira →</button></div></div></div></div>`;
      } else if (edgePos) {
        $$payload.out += "<!--[1-->";
        $$payload.out += `<div class="absolute z-20 pointer-events-auto cursor-pointer animate-fade-in svelte-etlq64"${attr_style(`left: ${stringify(edgePos.x)}px; top: ${stringify(edgePos.y)}px; transform: translate(-50%, -50%);`)} role="button" tabindex="0" aria-label="Girar câmera em direção à Terra"><div class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 hover:bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 text-xs font-mono shadow-xl backdrop-blur-md transition-transform hover:scale-105 active:scale-95"><span${attr_style(`transform: rotate(${stringify(edgePos.deg)}deg); display: inline-block;`)}>↑</span> <span>🌍 Terra (26.670 al)</span></div></div>`;
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
      $$payload.out += `<div class="absolute z-10 bottom-4 left-4 right-4 md:right-auto md:w-80 bg-black/65 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white shadow-xl flex flex-col gap-3 max-h-[60vh] overflow-y-auto animate-fade-in svelte-etlq64"><div><div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1">Ficha astrofísica</div> <dl class="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] font-mono text-slate-300"><dt class="text-slate-500">Massa</dt><dd>${escape_html((SAGITTARIUS_A_PRESET.massSolar / 1e6).toFixed(2))}×10⁶ M☉</dd> <dt class="text-slate-500">Distância</dt><dd>${escape_html(SAGITTARIUS_A_PRESET.distanceLy.toLocaleString("pt-BR"))} al</dd> <dt class="text-slate-500">Spin a*</dt><dd>≈ ${escape_html(SAGITTARIUS_A_PRESET.spin.toFixed(2))}</dd> <dt class="text-slate-500">ISCO</dt><dd>${escape_html(iscoRadius(SAGITTARIUS_A_PRESET.spin).toFixed(2))} GM/c²</dd> <dt class="text-slate-500">Sombra</dt><dd>${escape_html(SAGITTARIUS_A_PRESET.shadowMicroArcsec)} µas</dd></dl></div> <div><div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1">Espectro</div> <div class="flex gap-1.5 flex-wrap"><button type="button"${attr_class(`${stringify(chip)} ${stringify(store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).spectralMode === "visible" ? on : off)}`, "svelte-etlq64")}>Visível</button> <button type="button"${attr_class(`${stringify(chip)} ${stringify(store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).spectralMode === "eht" ? on : off)}`, "svelte-etlq64")}>EHT 230 GHz</button></div></div> <div><div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1">Física</div> <div class="flex gap-1.5 flex-wrap"><button type="button"${attr_class(`${stringify(chip)} ${stringify(store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).enableLensing ? on : off)}`, "svelte-etlq64")}${attr("aria-pressed", store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).enableLensing)}>Lente gravitacional</button> <button type="button"${attr_class(`${stringify(chip)} ${stringify(store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).enableDoppler ? on : off)}`, "svelte-etlq64")}${attr("aria-pressed", store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).enableDoppler)}>Doppler</button></div></div> <div><div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1">Câmera</div> <div class="flex gap-1.5 flex-wrap"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cam = each_array[$$index];
        $$payload.out += `<button type="button"${attr_class(`${stringify(chip)} ${stringify(off)}`, "svelte-etlq64")}>${escape_html(cam.label)}</button>`;
      }
      $$payload.out += `<!--]--> <button type="button"${attr_class(`${stringify(chip)} ${stringify(store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).autoRotate ? on : off)}`, "svelte-etlq64")}${attr("aria-pressed", store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).autoRotate)}>Auto-órbita</button></div></div> <div><div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1">Qualidade</div> <div class="flex gap-1.5 flex-wrap"><!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let q = each_array_1[$$index_1];
        $$payload.out += `<button type="button"${attr_class(`${stringify(chip)} ${stringify(store_get($$store_subs ??= {}, "$blackHoleConfig", blackHoleConfig).quality === q.id ? on : off)}`, "svelte-etlq64")}>${escape_html(q.label)}</button>`;
      }
      $$payload.out += `<!--]--></div></div></div>`;
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

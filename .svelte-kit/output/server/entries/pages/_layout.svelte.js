import "clsx";
import { a as attr, p as pop, b as push, s as store_get, u as unsubscribe_stores } from "../../chunks/index.js";
import { i as initSimpleI18n } from "../../chunks/simple-i18n.js";
import "marked";
import { i as isBlackHoleOpen } from "../../chunks/blackhole.js";
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
  if (store_get($$store_subs ??= {}, "$isBlackHoleOpen", isBlackHoleOpen)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 z-[100] w-screen h-screen bg-black overflow-hidden flex flex-col animate-fade-in svelte-etlq64" role="dialog" aria-label="Visualização do Black Hole" aria-modal="true"><div class="absolute inset-0 z-0 w-full h-full">`;
    BlackHole($$payload);
    $$payload.out += `<!----></div> <div class="relative z-10 w-full p-4 md:p-6 flex items-center justify-between pointer-events-none"><div class="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white shadow-xl flex items-center gap-3"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span> <div class="flex flex-col"><span class="text-xs md:text-sm font-bold tracking-wide font-mono text-amber-300">BLACK HOLE</span> <span class="text-[10px] md:text-xs text-slate-400 hidden sm:inline">Arraste para orbitar • Scroll para zoom</span></div></div> <button type="button" class="pointer-events-auto group flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-white/10 active:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/50 text-white rounded-2xl text-xs md:text-sm font-semibold tracking-wide transition-all duration-200 shadow-xl cursor-pointer" aria-label="Fechar visualização do Black Hole"><span class="hidden sm:inline text-slate-300 group-hover:text-white transition-colors">Fechar</span> <span class="font-mono text-[10px] text-slate-400 border border-white/20 rounded px-1.5 py-0.5 hidden md:inline">ESC</span> <svg class="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _layout($$payload, $$props) {
  push();
  initSimpleI18n();
  let { children } = $$props;
  children($$payload);
  $$payload.out += `<!----> `;
  ChatWidget($$payload);
  $$payload.out += `<!----> `;
  BlackHoleOverlay($$payload);
  $$payload.out += `<!---->`;
  pop();
}
export {
  _layout as default
};

import { g as ensure_array_like, P as head, e as escape_html, a as attr, c as attr_class, s as stringify, p as pop, b as push } from "../../../../chunks/index.js";
import { o as onDestroy } from "../../../../chunks/index-server.js";
import { L as LanguageSelector, T as ThemeToggle } from "../../../../chunks/LanguageSelector.js";
import { B as BlackHoleToggle } from "../../../../chunks/BlackHoleToggle.js";
import { h as html } from "../../../../chunks/html.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  data.slug;
  let metadata = data.metadata;
  let sections = data.sections || [];
  let audioMap = {};
  let recordedSections = sections.filter((sec) => Boolean(audioMap[sec.id]?.url));
  let totalRecordedDuration = recordedSections.reduce((acc, sec) => acc + (Number(audioMap[sec.id]?.duration) || 0), 0);
  let activeSectionId = null;
  let isPlaying = false;
  let playbackRate = 1;
  let autoScrollFollow = true;
  let activeSectionObj = sections.find((s) => s.id === activeSectionId) || null;
  function formatTime(seconds) {
    if (!seconds || !isFinite(seconds) || seconds < 0) return "0:00";
    const totalSec = Math.round(seconds);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }
  let recordingSectionId = null;
  let isSavingSection = null;
  onDestroy(() => {
  });
  const each_array_1 = ensure_array_like(metadata.tags);
  const each_array_3 = ensure_array_like(sections);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(metadata.title)} — Patrick Campelo Serrano</title>`;
    $$payload2.out += `<meta name="description"${attr("content", metadata.excerpt)}>`;
  });
  $$payload.out += `<div class="min-h-screen bg-slate-50/90 dark:bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300"><header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50"><div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between"><a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">Patrick Campelo Serrano</a> <div class="flex items-center gap-3 md:gap-4">`;
  BlackHoleToggle($$payload);
  $$payload.out += `<!----> `;
  LanguageSelector($$payload);
  $$payload.out += `<!----> `;
  ThemeToggle($$payload);
  $$payload.out += `<!----></div></div></header> <main class="max-w-4xl mx-auto px-4 py-12"><div class="mb-8 flex items-center justify-between flex-wrap gap-4"><a href="/blog/" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"><span class="group-hover:-translate-x-1 transition-transform">←</span> Voltar para todos os artigos</a> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <header class="mb-8 pb-8 border-b border-slate-200 dark:border-slate-800"><div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono"><span>${escape_html(new Date(metadata.date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }))}</span> <span>•</span> <span>${escape_html(metadata.readTime || "10 min")}</span> `;
  if (recordedSections.length > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span>•</span> <span class="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">🎧 Narrado pelo autor (${escape_html(formatTime(totalRecordedDuration))})</span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">${escape_html(metadata.title)}</h1> <div class="flex flex-wrap gap-2"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let tag = each_array_1[$$index_1];
    $$payload.out += `<span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">${escape_html(tag)}</span>`;
  }
  $$payload.out += `<!--]--></div></header> `;
  if (recordedSections.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array_2 = ensure_array_like(recordedSections);
    $$payload.out += `<div class="mb-10 rounded-2xl border border-indigo-500/30 bg-white/90 dark:bg-slate-900/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur-md sticky top-20 z-40"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div class="flex items-center gap-3.5"><button type="button" class="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 transition cursor-pointer shrink-0"${attr("aria-label", "Ouvir artigo narrado pelo autor")}>`;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>`;
    }
    $$payload.out += `<!--]--></button> <div class="min-w-0"><div class="flex items-center gap-2"><span class="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">🎧 Ouvir na voz do Patrick</span> <span class="text-[11px] font-mono text-slate-400">(${escape_html(recordedSections.length)} ${escape_html(recordedSections.length === 1 ? "seção" : "seções")} • ${escape_html(formatTime(totalRecordedDuration))})</span></div> <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate mt-0.5">`;
    if (activeSectionObj) {
      $$payload.out += "<!--[-->";
      $$payload.out += `Tocando: ${escape_html(activeSectionObj.title)}`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `Clique no play para ouvir o artigo enquanto lê`;
    }
    $$payload.out += `<!--]--></p></div></div> <div class="flex items-center gap-2 self-end sm:self-center shrink-0"><button type="button"${attr("disabled", true, true)} class="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-500 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed" title="Seção anterior">⏮</button> <button type="button"${attr("disabled", true, true)} class="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-500 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed" title="Próxima seção">⏭</button> <button type="button" class="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition cursor-pointer" title="Velocidade de reprodução">${escape_html(playbackRate)}x</button> <label class="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer ml-1 select-none"><input type="checkbox"${attr("checked", autoScrollFollow, true)} class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"> <span class="hidden md:inline">Auto-scroll</span></label></div></div> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1"><!--[-->`;
    for (let idx = 0, $$length = each_array_2.length; idx < $$length; idx++) {
      let sec = each_array_2[idx];
      $$payload.out += `<button type="button"${attr_class(`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${stringify(activeSectionId === sec.id ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400")}`)}>${escape_html(idx + 1)}. ${escape_html(sec.title)}</button>`;
    }
    $$payload.out += `<!--]--></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <article class="prose prose-slate dark:prose-invert max-w-none md:prose-lg prose-pre:bg-slate-900 dark:prose-pre:bg-slate-900/60 prose-pre:border prose-pre:border-slate-800 prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-2xl"><!--[-->`;
  for (let idx = 0, $$length = each_array_3.length; idx < $$length; idx++) {
    let section = each_array_3[idx];
    const sectionAudio = audioMap[section.id];
    activeSectionId === section.id && isPlaying;
    const isThisActive = activeSectionId === section.id;
    const isThisRecording = recordingSectionId === section.id;
    isSavingSection === section.id;
    $$payload.out += `<section${attr("id", `section-${stringify(section.id)}`)}${attr("data-section-id", section.id)}${attr_class(`relative rounded-2xl transition-all duration-300 my-4 ${stringify(isThisActive ? "border-l-4 border-indigo-500 bg-indigo-500/[0.04] dark:bg-indigo-500/[0.07] pl-4 md:pl-6 pr-3 py-3" : isThisRecording ? "border-l-4 border-rose-500 bg-rose-500/[0.05] dark:bg-rose-500/[0.08] pl-4 md:pl-6 pr-3 py-3" : "")}`)}>`;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (section.isIntro) {
      $$payload.out += "<!--[-->";
      if (sectionAudio) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="not-prose mb-4 flex items-center"><button type="button"${attr_class(`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold border transition cursor-pointer ${stringify("bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25 hover:bg-indigo-500/20")}`)}><span>${escape_html(`▶ Ouvir introdução (${formatTime(sectionAudio.duration)})`)}</span></button></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2"><div class="flex-1">${html(section.headingHtml)}</div> `;
      if (sectionAudio) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="not-prose shrink-0 mb-2 sm:mb-0"><button type="button"${attr_class(`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold border transition cursor-pointer ${stringify("bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25 hover:bg-indigo-500/20")}`)}><span>${escape_html(`▶ Ouvir seção (${formatTime(sectionAudio.duration)})`)}</span></button></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    }
    $$payload.out += `<!--]--> ${html(section.bodyHtml)}</section>`;
  }
  $$payload.out += `<!--]--></article></main></div>`;
  pop();
}
export {
  _page as default
};

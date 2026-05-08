/* =========================================================
   SYNAPSE — Multi-Agent Sandbox (vanilla JS, localStorage)
   GitHub Pages friendly. No backend.
   ========================================================= */

(() => {
"use strict";

/* ---------- I18N ---------- */
const I18N = {
  ru: {
    brand_tag: "мульти-агентная песочница",
    settings: "Настройки",
    reset_all: "Сброс",
    agents_title: "Агенты",
    add_agent: "Добавить агента",
    rounds_label: "Раундов обсуждения:",
    finalmode_label: "Режим финального ответа",
    mode_moderator: "Модератор",
    mode_collab: "Коллективно",
    moderator_label: "Агент-модератор",
    ask_title: "Что обсуждаем?",
    run: "Запустить совещание",
    stop: "Остановить",
    empty_hint: "Добавьте минимум 2 агентов и задайте вопрос. Они проведут несколько раундов обсуждения и выдадут единый ответ.",
    agent_editor: "Агент",
    alias_label: "Имя / псевдоним",
    provider_label: "Провайдер",
    model_label: "Модель",
    model_hint: "Подсказки появятся при наборе. Автовставки нет.",
    apikey_label: "API-ключ",
    endpoint_label: "Endpoint (для Custom — полный URL chat-completions)",
    role_label: "Роль / системная инструкция",
    color_label: "Цвет",
    enabled_label: "Активен",
    delay_label: "Задержка между запросами (мс):",
    delete: "Удалить",
    cancel: "Отмена",
    save: "Сохранить",
    settings_hint: "Все данные хранятся только в вашем браузере (localStorage). Ничего не отправляется на наши серверы — у нас их нет.",
    default_provider: "Провайдер по умолчанию",
    default_key: "Общий API-ключ (необязательно — будет подставлен в новых агентах)",
    cors_note_title: "⚠ О CORS",
    cors_note: "Большинство провайдеров (OpenRouter, Groq, OpenAI, Gemini, DeepSeek, Mistral, Together, xAI, Perplexity, Cohere) разрешают вызовы из браузера. Anthropic требует заголовок <code>anthropic-dangerous-direct-browser-access</code> — он добавляется автоматически.",
    export: "Экспорт JSON", import: "Импорт JSON", ok: "Готово",
    mode_hint_moderator: "Назначенный модератор синтезирует финальный ответ.",
    mode_hint_collab: "Все активные агенты сообща пишут совместный ответ (последний раунд — синтез).",
    no_agents: "Сначала добавьте хотя бы 2 агентов.",
    no_prompt: "Введите вопрос для обсуждения.",
    round_n: "Раунд",
    final_label: "Итоговый ответ",
    show_individual: "Показать рассуждения и индивидуальные ответы",
    copy: "Скопировать", copied: "Скопировано",
    saved: "Сохранено", deleted: "Удалено", imported: "Импортировано",
    confirm_reset: "Удалить всех агентов и настройки?",
    agent_default_role: "Ты — участник коллективного обсуждения. Высказывайся коротко, по делу, оспаривай неточности других, развивай идеи.",
    moderator_role: "Ты — модератор обсуждения. Прочитай весь диалог и выдай ОДИН цельный, точный, краткий итоговый ответ для пользователя. Не упоминай агентов поимённо в финальном ответе. Пиши на языке вопроса.",
    collab_role: "Это финальный синтез. Объедини сильные стороны позиций всех агентов в ОДИН цельный ответ для пользователя на языке вопроса. Без преамбул.",
    error_no_key: "У агента «{name}» не указан API-ключ.",
    request_failed: "Ошибка запроса: ",
    speaking: "печатает",
    final_synth: "Синтез финального ответа",
  },
  en: {
    brand_tag: "multi-agent sandbox",
    settings: "Settings", reset_all: "Reset",
    agents_title: "Agents", add_agent: "Add agent",
    rounds_label: "Discussion rounds:",
    finalmode_label: "Final answer mode",
    mode_moderator: "Moderator", mode_collab: "Collaborative",
    moderator_label: "Moderator agent",
    ask_title: "What's the topic?",
    run: "Run council", stop: "Stop",
    empty_hint: "Add at least 2 agents and ask a question. They will discuss for several rounds and produce a single answer.",
    agent_editor: "Agent",
    alias_label: "Name / alias",
    provider_label: "Provider", model_label: "Model",
    model_hint: "Suggestions appear as you type. No auto-fill.",
    apikey_label: "API key",
    endpoint_label: "Endpoint (for Custom — full chat-completions URL)",
    role_label: "Role / system prompt",
    color_label: "Color", enabled_label: "Enabled",
    delay_label: "Delay between requests (ms):",
    delete: "Delete", cancel: "Cancel", save: "Save",
    settings_hint: "All data lives only in your browser (localStorage). Nothing is sent to our servers — we don't have any.",
    default_provider: "Default provider",
    default_key: "Shared API key (optional — pre-filled into new agents)",
    cors_note_title: "⚠ About CORS",
    cors_note: "Most providers (OpenRouter, Groq, OpenAI, Gemini, DeepSeek, Mistral, Together, xAI, Perplexity, Cohere) allow browser calls. Anthropic requires <code>anthropic-dangerous-direct-browser-access</code> — added automatically.",
    export: "Export JSON", import: "Import JSON", ok: "Done",
    mode_hint_moderator: "The assigned moderator synthesizes the final answer.",
    mode_hint_collab: "All active agents collaboratively write the final answer (last round = synthesis).",
    no_agents: "Add at least 2 agents first.",
    no_prompt: "Enter a question for the discussion.",
    round_n: "Round", final_label: "Final answer",
    show_individual: "Show reasoning and individual answers",
    copy: "Copy", copied: "Copied",
    saved: "Saved", deleted: "Deleted", imported: "Imported",
    confirm_reset: "Delete all agents and settings?",
    agent_default_role: "You're a participant in a group discussion. Be concise, challenge others' inaccuracies, develop ideas.",
    moderator_role: "You are the discussion moderator. Read the entire dialog and produce ONE coherent, accurate, concise final answer for the user. Don't reference agents by name in the final answer. Reply in the language of the question.",
    collab_role: "This is the final synthesis. Merge the strongest points of all agents into ONE coherent answer for the user in the language of the question. No preamble.",
    error_no_key: "Agent \"{name}\" has no API key.",
    request_failed: "Request failed: ",
    speaking: "typing",
    final_synth: "Final synthesis",
  }
};
let LANG = localStorage.getItem("synapse.lang") || "ru";

const t = (k, vars) => {
  let s = (I18N[LANG] && I18N[LANG][k]) || I18N.ru[k] || k;
  if (vars) for (const v in vars) s = s.replace("{"+v+"}", vars[v]);
  return s;
};

/* ---------- THEMES ---------- */
const THEMES = [
  { id: "neon-night",  label: "Neon Night" },
  { id: "tokyo",       label: "Tokyo Lights" },
  { id: "solar-cream", label: "Solar Cream" },
  { id: "forest",      label: "Forest Deep" },
  { id: "retrowave",   label: "Retrowave" },
  { id: "terminal",    label: "Terminal Green" },
  { id: "paper",       label: "Paper White" },
  { id: "blood",       label: "Blood Moon" },
  { id: "ocean",       label: "Ocean Deep" },
  { id: "sandstorm",   label: "Sandstorm" },
  { id: "brutalist",   label: "Mono Brutalist" },
  { id: "lavender",    label: "Lavender Mist" },
];

/* ---------- PROVIDERS ---------- */
/* Each provider implements: send({apiKey, model, endpoint, messages, temperature}) -> string  */
const PROVIDERS = {
  openai: {
    label: "OpenAI",
    endpoint: "https://api.openai.com/v1/chat/completions",
    models: ["gpt-4o","gpt-4o-mini","gpt-4.1","gpt-4.1-mini","gpt-4.1-nano","o1-mini","o3-mini","gpt-4-turbo","gpt-3.5-turbo"],
    send: openAICompatible,
  },
  anthropic: {
    label: "Anthropic",
    endpoint: "https://api.anthropic.com/v1/messages",
    models: ["claude-opus-4-5","claude-sonnet-4-5","claude-haiku-4-5","claude-3-7-sonnet-latest","claude-3-5-sonnet-latest","claude-3-5-haiku-latest","claude-3-opus-latest"],
    send: anthropicSend,
  },
  google: {
    label: "Google Gemini",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models",
    models: ["gemini-2.5-pro","gemini-2.5-flash","gemini-2.0-flash","gemini-1.5-pro","gemini-1.5-flash"],
    send: geminiSend,
  },
  openrouter: {
    label: "OpenRouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    models: ["openai/gpt-4o-mini","anthropic/claude-3.5-sonnet","meta-llama/llama-3.3-70b-instruct","google/gemini-2.0-flash-001","deepseek/deepseek-chat","qwen/qwen-2.5-72b-instruct","mistralai/mistral-large-latest","x-ai/grok-2-1212","openrouter/auto"],
    send: openAICompatible,
  },
  deepseek: {
    label: "DeepSeek",
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    models: ["deepseek-chat","deepseek-reasoner","deepseek-coder"],
    send: openAICompatible,
  },
  groq: {
    label: "Groq",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    models: ["llama-3.3-70b-versatile","llama-3.1-8b-instant","llama-3.1-70b-versatile","mixtral-8x7b-32768","gemma2-9b-it","qwen-2.5-32b","deepseek-r1-distill-llama-70b"],
    send: openAICompatible,
  },
  mistral: {
    label: "Mistral",
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    models: ["mistral-large-latest","mistral-medium-latest","mistral-small-latest","ministral-8b-latest","ministral-3b-latest","open-mistral-nemo","codestral-latest"],
    send: openAICompatible,
  },
  together: {
    label: "Together AI",
    endpoint: "https://api.together.xyz/v1/chat/completions",
    models: ["meta-llama/Llama-3.3-70B-Instruct-Turbo","meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo","Qwen/Qwen2.5-72B-Instruct-Turbo","deepseek-ai/DeepSeek-V3","mistralai/Mixtral-8x7B-Instruct-v0.1"],
    send: openAICompatible,
  },
  xai: {
    label: "xAI (Grok)",
    endpoint: "https://api.x.ai/v1/chat/completions",
    models: ["grok-2-latest","grok-2-1212","grok-2-vision-1212","grok-beta"],
    send: openAICompatible,
  },
  perplexity: {
    label: "Perplexity",
    endpoint: "https://api.perplexity.ai/chat/completions",
    models: ["llama-3.1-sonar-large-128k-online","llama-3.1-sonar-small-128k-online","llama-3.1-sonar-huge-128k-online","sonar-pro","sonar"],
    send: openAICompatible,
  },
  cohere: {
    label: "Cohere",
    endpoint: "https://api.cohere.ai/v2/chat",
    models: ["command-r-plus-08-2024","command-r-08-2024","command-r-plus","command-r","command-light"],
    send: cohereSend,
  },
  fireworks: {
    label: "Fireworks AI",
    endpoint: "https://api.fireworks.ai/inference/v1/chat/completions",
    models: ["accounts/fireworks/models/llama-v3p3-70b-instruct","accounts/fireworks/models/qwen2p5-72b-instruct","accounts/fireworks/models/deepseek-v3","accounts/fireworks/models/mixtral-8x22b-instruct"],
    send: openAICompatible,
  },
  custom: {
    label: "Custom (OpenAI-compatible)",
    endpoint: "",
    models: [],
    send: openAICompatible,
  },
};

/* ---- Provider implementations ---- */

async function openAICompatible({apiKey, model, endpoint, messages, temperature, signal}) {
  const url = endpoint || PROVIDERS.openai.endpoint;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      // OpenRouter likes these:
      "HTTP-Referer": location.origin || "https://synapse.local",
      "X-Title": "Synapse Multi-Agent",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: typeof temperature === "number" ? temperature : 0.7,
    }),
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await safeText(res)}`);
  const data = await res.json();
  const choice = data.choices && data.choices[0];
  return (choice && (choice.message?.content || choice.text)) || "";
}

async function anthropicSend({apiKey, model, endpoint, messages, temperature, signal}) {
  // Convert OpenAI-style messages to Anthropic format
  const system = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n");
  const msgs = messages.filter(m => m.role !== "system").map(m => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content
  }));
  const url = endpoint || PROVIDERS.anthropic.endpoint;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      system: system || undefined,
      max_tokens: 2048,
      temperature: typeof temperature === "number" ? temperature : 0.7,
      messages: msgs,
    }),
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await safeText(res)}`);
  const data = await res.json();
  return (data.content && data.content.map(c => c.text).filter(Boolean).join("\n")) || "";
}

async function geminiSend({apiKey, model, endpoint, messages, temperature, signal}) {
  const base = endpoint || PROVIDERS.google.endpoint;
  const url = `${base}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const system = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n");
  const contents = messages.filter(m => m.role !== "system").map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const body = {
    contents,
    generationConfig: { temperature: typeof temperature === "number" ? temperature : 0.7 },
  };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await safeText(res)}`);
  const data = await res.json();
  const cand = data.candidates && data.candidates[0];
  return (cand && cand.content && cand.content.parts && cand.content.parts.map(p => p.text).filter(Boolean).join("\n")) || "";
}

async function cohereSend({apiKey, model, endpoint, messages, temperature, signal}) {
  const url = endpoint || PROVIDERS.cohere.endpoint;
  const cmsgs = messages.map(m => ({
    role: m.role === "system" ? "system" : (m.role === "assistant" ? "assistant" : "user"),
    content: m.content,
  }));
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages: cmsgs, temperature: typeof temperature === "number" ? temperature : 0.7 }),
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await safeText(res)}`);
  const data = await res.json();
  const msg = data.message;
  if (msg && Array.isArray(msg.content)) return msg.content.map(c => c.text || "").join("\n");
  return data.text || "";
}

async function safeText(res){ try { return await res.text(); } catch { return res.statusText; } }

/* ---------- STATE ---------- */
const STORE_KEY = "synapse.state.v1";
const defaultState = () => ({
  agents: [],          // {id, alias, provider, model, key, endpoint, role, temperature, color, enabled}
  rounds: 3,
  delayMs: 0,
  finalMode: "moderator", // moderator | collaborative
  moderatorId: null,
  defaults: { provider: "openai", key: "" },
  theme: "neon-night",
  lang: "ru",
});

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const s = JSON.parse(raw);
    return Object.assign(defaultState(), s);
  } catch { return defaultState(); }
}
function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {}
}

/* ---------- DOM HELPERS ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const uid = () => Math.random().toString(36).slice(2, 10);

function applyI18N() {
  $$("[data-i18n]").forEach(el => {
    const k = el.dataset.i18n;
    // Skip if element has element children — could break structure
    if (el.children.length > 0) return;
    el.textContent = t(k);
  });
  // dynamic strings:
  document.documentElement.lang = LANG;
  $("#user-prompt").placeholder = LANG === "ru"
    ? "Опиши задачу. Агенты обсудят её между собой и выдадут общий ответ."
    : "Describe the task. The agents will discuss and produce a single answer.";
  $("#mode-hint").innerHTML = state.finalMode === "moderator" ? t("mode_hint_moderator") : t("mode_hint_collab");
  // also reset CORS note (it has html)
  const note = $$("[data-i18n='cors_note']")[0];
  if (note) note.innerHTML = t("cors_note");
  const settingsHint = $$("[data-i18n='settings_hint']")[0];
  if (settingsHint) settingsHint.innerHTML = t("settings_hint");
}

function toast(msg, kind="success") {
  const el = $("#toast");
  el.textContent = msg;
  el.className = "toast " + kind;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.hidden = true; }, 2500);
}

/* ---------- THEME / LANG INIT ---------- */
function initThemeSelect() {
  const sel = $("#theme-select");
  sel.innerHTML = THEMES.map(th =>
    `<option value="${th.id}">${th.label}</option>`).join("");
  sel.value = state.theme;
  document.documentElement.dataset.theme = state.theme;
  sel.addEventListener("change", () => {
    state.theme = sel.value;
    document.documentElement.dataset.theme = state.theme;
    saveState();
  });
}
function initLangSelect() {
  const sel = $("#lang-select");
  sel.value = LANG;
  sel.addEventListener("change", () => {
    LANG = sel.value;
    state.lang = LANG;
    localStorage.setItem("synapse.lang", LANG);
    saveState();
    applyI18N();
    renderAgents();
  });
}

/* ---------- PROVIDER SELECTS ---------- */
function fillProviderSelect(sel) {
  sel.innerHTML = Object.entries(PROVIDERS)
    .map(([id, p]) => `<option value="${id}">${p.label}</option>`).join("");
}
function fillModelSuggestions(providerId) {
  const dl = $("#model-suggestions");
  const p = PROVIDERS[providerId];
  dl.innerHTML = (p && p.models || [])
    .map(m => `<option value="${m}"></option>`).join("");
}

/* ---------- AGENT RENDER ---------- */
function renderAgents() {
  const list = $("#agents-list");
  list.innerHTML = "";
  state.agents.forEach(a => {
    const card = document.createElement("div");
    card.className = "agent-card";
    card.dataset.testid = "agent-card-" + a.id;
    if (!a.enabled) card.dataset.disabled = "1";
    card.style.setProperty("--c", a.color || "var(--accent)");
    card.innerHTML = `
      <div class="dot"></div>
      <div class="meta">
        <div class="name">${escapeHtml(a.alias || "—")}</div>
        <div class="sub">${(PROVIDERS[a.provider]?.label) || a.provider} · ${escapeHtml(a.model || "model?")}</div>
      </div>
      <div class="badge">${a.enabled ? "ON" : "OFF"}</div>
    `;
    card.addEventListener("click", () => openAgentEditor(a.id));
    list.appendChild(card);
  });
  $("#agent-count").textContent = state.agents.length;

  // moderator select
  const mod = $("#moderator-select");
  const enabled = state.agents.filter(a => a.enabled);
  mod.innerHTML = enabled.length
    ? enabled.map(a => `<option value="${a.id}">${escapeHtml(a.alias || a.id)}</option>`).join("")
    : `<option value="">—</option>`;
  if (state.moderatorId && enabled.find(a => a.id === state.moderatorId)) {
    mod.value = state.moderatorId;
  } else if (enabled[0]) {
    state.moderatorId = enabled[0].id;
    mod.value = state.moderatorId;
  }
  mod.onchange = () => { state.moderatorId = mod.value; saveState(); };

  // add button enable
  $("#add-agent").disabled = state.agents.length >= 20;
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

/* ---------- AGENT EDITOR MODAL ---------- */
let editingAgentId = null;
function openAgentEditor(id) {
  editingAgentId = id;
  const a = state.agents.find(x => x.id === id) || newAgentTemplate();
  fillProviderSelect($("#a-provider"));
  $("#a-provider").value = a.provider;
  fillModelSuggestions(a.provider);
  $("#a-alias").value = a.alias || "";
  $("#a-model").value = a.model || "";
  $("#a-key").value   = a.key || "";
  $("#a-endpoint").value = a.endpoint || "";
  $("#a-role").value  = a.role || t("agent_default_role");
  $("#a-temp").value  = a.temperature ?? 0.7;
  $("#a-color").value = a.color || randomColor();
  $("#a-enabled").checked = a.enabled !== false;
  $("#delete-agent").style.display = state.agents.find(x => x.id === id) ? "inline-flex" : "none";
  showModal("agent-modal");
}

function newAgentTemplate() {
  return {
    id: uid(),
    alias: "",
    provider: state.defaults.provider || "openai",
    model: "",
    key: state.defaults.key || "",
    endpoint: "",
    role: t("agent_default_role"),
    temperature: 0.7,
    color: randomColor(),
    enabled: true,
  };
}
function randomColor() {
  const hues = [180, 200, 280, 320, 20, 50, 130, 0, 260, 340];
  const h = hues[Math.floor(Math.random()*hues.length)];
  return `hsl(${h} 80% 60%)`;
}

function bindAgentEditor() {
  $("#a-provider").addEventListener("change", e => fillModelSuggestions(e.target.value));
  $("#toggle-key").addEventListener("click", () => {
    const i = $("#a-key");
    i.type = i.type === "password" ? "text" : "password";
  });
  $("#save-agent").addEventListener("click", () => {
    const a = state.agents.find(x => x.id === editingAgentId);
    const payload = {
      id: editingAgentId,
      alias: $("#a-alias").value.trim() || ("Agent " + (state.agents.length + 1)),
      provider: $("#a-provider").value,
      model: $("#a-model").value.trim(),
      key: $("#a-key").value.trim(),
      endpoint: $("#a-endpoint").value.trim(),
      role: $("#a-role").value.trim() || t("agent_default_role"),
      temperature: parseFloat($("#a-temp").value) || 0.7,
      color: $("#a-color").value || randomColor(),
      enabled: $("#a-enabled").checked,
    };
    if (a) Object.assign(a, payload);
    else state.agents.push(payload);
    saveState();
    renderAgents();
    closeModal("agent-modal");
    toast(t("saved"), "success");
  });
  $("#delete-agent").addEventListener("click", () => {
    state.agents = state.agents.filter(x => x.id !== editingAgentId);
    saveState();
    renderAgents();
    closeModal("agent-modal");
    toast(t("deleted"));
  });
}

/* ---------- MODALS ---------- */
function showModal(id) { $("#"+id).hidden = false; }
function closeModal(id) { $("#"+id).hidden = true; }
function bindModalCloses() {
  $$("[data-close]").forEach(b => b.addEventListener("click", () => closeModal(b.dataset.close)));
  $$(".modal").forEach(m => m.addEventListener("click", e => { if (e.target === m) m.hidden = true; }));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") $$(".modal").forEach(m => m.hidden = true);
  });
}

/* ---------- SETTINGS MODAL ---------- */
function bindSettings() {
  fillProviderSelect($("#default-provider"));
  $("#default-provider").value = state.defaults.provider;
  $("#default-key").value = state.defaults.key;

  $("#open-settings").addEventListener("click", () => showModal("settings-modal"));
  $("#default-provider").addEventListener("change", e => { state.defaults.provider = e.target.value; saveState(); });
  $("#default-key").addEventListener("input", e => { state.defaults.key = e.target.value; saveState(); });

  $("#export-config").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "synapse-config.json";
    a.click();
  });
  $("#import-config").addEventListener("change", async e => {
    const f = e.target.files[0];
    if (!f) return;
    const text = await f.text();
    try {
      const incoming = JSON.parse(text);
      state = Object.assign(defaultState(), incoming);
      saveState();
      LANG = state.lang || LANG;
      $("#lang-select").value = LANG;
      $("#theme-select").value = state.theme;
      document.documentElement.dataset.theme = state.theme;
      renderAgents();
      applyI18N();
      bindRoundsAndMode();
      toast(t("imported"), "success");
    } catch { toast("Invalid JSON", "error"); }
    e.target.value = "";
  });
}

/* ---------- ROUNDS / MODE ---------- */
function bindRoundsAndMode() {
  const slider = $("#rounds-slider");
  const value  = $("#rounds-value");
  slider.value = state.rounds;
  value.textContent = state.rounds;
  slider.addEventListener("input", () => {
    state.rounds = parseInt(slider.value);
    value.textContent = state.rounds;
    saveState();
  });

  const dslider = $("#delay-slider");
  const dvalue  = $("#delay-value");
  dslider.value = state.delayMs || 0;
  dvalue.textContent = state.delayMs || 0;
  dslider.addEventListener("input", () => {
    state.delayMs = parseInt(dslider.value);
    dvalue.textContent = state.delayMs;
    saveState();
  });

  $$(".seg").forEach(b => {
    b.classList.toggle("active", b.dataset.mode === state.finalMode);
    b.addEventListener("click", () => {
      $$(".seg").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      state.finalMode = b.dataset.mode;
      saveState();
      $("#mode-hint").innerHTML = state.finalMode === "moderator" ? t("mode_hint_moderator") : t("mode_hint_collab");
    });
  });
  $("#mode-hint").innerHTML = state.finalMode === "moderator" ? t("mode_hint_moderator") : t("mode_hint_collab");
}

/* ---------- ORCHESTRATION ---------- */
let abortCtrl = null;

async function callAgent(agent, messages, signal) {
  const provider = PROVIDERS[agent.provider] || PROVIDERS.openai;
  const endpoint = (agent.endpoint && agent.endpoint.trim()) || provider.endpoint;
  if (!agent.key && agent.provider !== "custom") {
    throw new Error(t("error_no_key", {name: agent.alias}));
  }
  return await provider.send({
    apiKey: agent.key,
    model: agent.model,
    endpoint,
    messages,
    temperature: agent.temperature,
    signal,
  });
}

function buildAgentMessages(agent, userPrompt, transcript, roundIdx, totalRounds, others) {
  const peers = others.map(o => o.alias).join(", ");
  const systemBits = [
    agent.role,
    `Your alias: ${agent.alias}.`,
    `You are one of ${others.length + 1} participants. Other participants: ${peers}.`,
    `This is discussion round ${roundIdx + 1} of ${totalRounds}. Be concise (max ~120 words).`,
    `Reply in the language of the user's question.`,
    `Do NOT prefix your answer with your name.`,
  ].join("\n");
  const transcriptText = transcript.length
    ? "Previous discussion:\n" + transcript.map(m => `${m.alias}: ${m.text}`).join("\n\n")
    : "";
  return [
    { role: "system", content: systemBits },
    { role: "user",   content: `User question:\n${userPrompt}\n\n${transcriptText}\n\nNow it's your turn (${agent.alias}).` },
  ];
}

function pushBubble(container, agent, text, opts = {}) {
  const el = document.createElement("div");
  el.className = "bubble-msg" + (opts.thinking ? " thinking" : "") + (opts.error ? " error" : "");
  el.style.setProperty("--c", agent.color || "var(--accent)");
  el.dataset.testid = "bubble-" + agent.id;
  el.innerHTML = `
    <div class="avatar">${escapeHtml((agent.alias || "?").slice(0,2).toUpperCase())}</div>
    <div>
      <div class="who">
        <span class="name">${escapeHtml(agent.alias)}</span>
        <span class="sub">${(PROVIDERS[agent.provider]?.label) || agent.provider} · ${escapeHtml(agent.model || "")}</span>
      </div>
      <div class="body">${escapeHtml(text)}</div>
    </div>`;
  container.appendChild(el);
  el.scrollIntoView({behavior: "smooth", block: "nearest"});
  return el;
}

function makeRoundBlock(title) {
  const wrap = document.createElement("div");
  wrap.className = "round-block";
  wrap.innerHTML = `
    <div class="round-head"><h3>${escapeHtml(title)}</h3></div>
    <div class="round-body"></div>`;
  $("#results").appendChild(wrap);
  wrap.scrollIntoView({behavior:"smooth", block:"nearest"});
  return wrap.querySelector(".round-body");
}

async function run() {
  const prompt = $("#user-prompt").value.trim();
  const agents = state.agents.filter(a => a.enabled);
  if (agents.length < 2) return toast(t("no_agents"), "error");
  if (!prompt) return toast(t("no_prompt"), "error");

  $("#empty-state")?.remove();
  $("#results").innerHTML = "";
  $("#run-btn").disabled = true;
  $("#stop-btn").disabled = false;
  abortCtrl = new AbortController();

  const transcript = []; // {agentId, alias, text, round}
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let firstCall = true;
  try {
    for (let r = 0; r < state.rounds; r++) {
      const body = makeRoundBlock(`${t("round_n")} ${r + 1} / ${state.rounds}`);
      for (const agent of agents) {
        if (!firstCall && state.delayMs > 0) await sleep(state.delayMs);
        firstCall = false;
        const others = agents.filter(o => o.id !== agent.id);
        const msgs = buildAgentMessages(agent, prompt, transcript, r, state.rounds, others);
        const bubble = pushBubble(body, agent, t("speaking"), { thinking: true });
        try {
          const text = await callAgent(agent, msgs, abortCtrl.signal);
          bubble.classList.remove("thinking");
          bubble.querySelector(".body").textContent = text;
          transcript.push({ agentId: agent.id, alias: agent.alias, text, round: r });
        } catch (err) {
          bubble.classList.remove("thinking");
          bubble.classList.add("error");
          bubble.querySelector(".body").textContent = t("request_failed") + (err?.message || err);
        }
      }
    }

    // FINAL SYNTHESIS
    const finalBody = makeRoundBlock(t("final_synth"));
    let finalText = "";
    if (state.delayMs > 0) await sleep(state.delayMs);
    if (state.finalMode === "moderator") {
      const mod = agents.find(a => a.id === state.moderatorId) || agents[0];
      const messages = [
        { role: "system", content: t("moderator_role") + "\n\n" + (mod.role || "") },
        { role: "user", content:
            `User question:\n${prompt}\n\nFull discussion:\n` +
            transcript.map(m => `${m.alias} (round ${m.round+1}): ${m.text}`).join("\n\n") +
            `\n\nProduce ONE final unified answer for the user.`
        },
      ];
      const bubble = pushBubble(finalBody, mod, t("speaking"), { thinking: true });
      try {
        finalText = await callAgent(mod, messages, abortCtrl.signal);
        bubble.classList.remove("thinking");
        bubble.querySelector(".body").textContent = finalText;
      } catch (err) {
        bubble.classList.remove("thinking");
        bubble.classList.add("error");
        bubble.querySelector(".body").textContent = t("request_failed") + (err?.message || err);
      }
    } else {
      // collaborative: each agent writes a synthesis, then concat the longest one
      const drafts = [];
      let firstSynth = true;
      for (const agent of agents) {
        if (!firstSynth && state.delayMs > 0) await sleep(state.delayMs);
        firstSynth = false;
        const messages = [
          { role: "system", content: t("collab_role") + "\n\n" + (agent.role || "") },
          { role: "user", content:
              `User question:\n${prompt}\n\nFull discussion:\n` +
              transcript.map(m => `${m.alias}: ${m.text}`).join("\n\n") +
              `\n\nWrite the unified final answer as if speaking on behalf of the council.`
          },
        ];
        const bubble = pushBubble(finalBody, agent, t("speaking"), { thinking: true });
        try {
          const draft = await callAgent(agent, messages, abortCtrl.signal);
          bubble.classList.remove("thinking");
          bubble.querySelector(".body").textContent = draft;
          drafts.push({ agent, draft });
        } catch (err) {
          bubble.classList.remove("thinking");
          bubble.classList.add("error");
          bubble.querySelector(".body").textContent = t("request_failed") + (err?.message || err);
        }
      }
      // pick the longest draft as the unified one
      drafts.sort((a, b) => b.draft.length - a.draft.length);
      finalText = drafts[0]?.draft || "";
    }

    renderFinal(finalText, transcript);
  } finally {
    $("#run-btn").disabled = false;
    $("#stop-btn").disabled = true;
    abortCtrl = null;
  }
}

function renderFinal(finalText, transcript) {
  const card = document.createElement("div");
  card.className = "final-card";
  card.dataset.testid = "final-card";
  card.innerHTML = `
    <div class="label">${t("final_label")}</div>
    <h2>★</h2>
    <div class="answer">${escapeHtml(finalText || "—")}</div>
    <div class="actions">
      <button class="ghost-btn" data-testid="copy-final">${t("copy")}</button>
      <button class="ghost-btn" data-testid="toggle-individual">${t("show_individual")}</button>
    </div>
    <details class="collapsible" data-testid="individual-block">
      <summary>${t("show_individual")}</summary>
      <div class="body">
        ${transcript.map(m => `
          <div class="indiv-card" style="--c:${escapeHtml(getAgentColor(m.agentId))}">
            <div class="head">
              <span class="dot"></span>
              <span class="name">${escapeHtml(m.alias)}</span>
              <span style="color:var(--text-dim);font-size:12px;">· ${t("round_n")} ${m.round+1}</span>
            </div>
            <div class="body">${escapeHtml(m.text)}</div>
          </div>`).join("")}
      </div>
    </details>`;
  $("#results").appendChild(card);
  card.querySelector('[data-testid="copy-final"]').addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(finalText); toast(t("copied"), "success"); } catch {}
  });
  card.querySelector('[data-testid="toggle-individual"]').addEventListener("click", () => {
    const d = card.querySelector("details"); d.open = !d.open;
  });
  card.scrollIntoView({behavior:"smooth", block:"nearest"});
}
function getAgentColor(id){ return state.agents.find(a => a.id === id)?.color || "var(--accent)"; }

function bindRunStop() {
  $("#run-btn").addEventListener("click", run);
  $("#stop-btn").addEventListener("click", () => { abortCtrl?.abort(); });
  $("#user-prompt").addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") run();
  });
}

/* ---------- RESET ---------- */
function bindReset() {
  $("#reset-all").addEventListener("click", () => {
    if (!confirm(t("confirm_reset"))) return;
    state = defaultState();
    saveState();
    renderAgents();
    bindRoundsAndMode();
    document.documentElement.dataset.theme = state.theme;
    $("#theme-select").value = state.theme;
    toast(t("deleted"));
  });
}

/* ---------- ADD AGENT ---------- */
function bindAddAgent() {
  $("#add-agent").addEventListener("click", () => {
    if (state.agents.length >= 20) return;
    openAgentEditor(uid()); // new
  });
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  applyI18N();
  initThemeSelect();
  initLangSelect();

  bindAgentEditor();
  bindAddAgent();
  bindModalCloses();
  bindSettings();
  bindRoundsAndMode();
  bindRunStop();
  bindReset();

  renderAgents();

  // seed two example agents on first launch (no keys, user fills)
  if (state.agents.length === 0) {
    state.agents = [
      Object.assign(newAgentTemplate(), { alias: LANG === "ru" ? "Архитектор" : "Architect", color: "hsl(190 90% 60%)",
        role: LANG === "ru" ? "Ты — системный архитектор. Думай структурно, формулируй планы и схемы." : "You are a systems architect. Think structurally, propose plans and schemas." }),
      Object.assign(newAgentTemplate(), { alias: LANG === "ru" ? "Скептик" : "Skeptic",  color: "hsl(340 90% 65%)",
        role: LANG === "ru" ? "Ты — конструктивный скептик. Ищи слабые места в идеях других и предлагай улучшения." : "You are a constructive skeptic. Find weak spots in others' ideas and propose improvements." }),
    ];
    saveState();
    renderAgents();
  }
});

})();

// AI NEXUS | CORE PROTOCOL v7.0
const UI = {
    gh: localStorage.getItem('ax_gh'),
    gr: localStorage.getItem('ax_gr'),
    gm_agent: localStorage.getItem('ax_gm_a'), 
    gm_judge: localStorage.getItem('ax_gm_j')
};

const els = {
    send: document.getElementById('sendBtn'),
    in: document.getElementById('userInput'),
    ld: document.getElementById('loader'),
    st: document.getElementById('status'),
    res: document.getElementById('resultArea'),
    final: document.getElementById('finalAnswer'),
    mod: document.getElementById('keyModal'),
    configBtn: document.getElementById('configBtn'),
    closeModal: document.getElementById('closeModal'),
    
    inGh: document.getElementById('ghKey'),
    inGr: document.getElementById('grKey'),
    inGmA: document.getElementById('gmAgentKey'),
    inGmJ: document.getElementById('gmJudgeKey')
};

// Управление модальным окном
els.configBtn.onclick = () => {
    els.inGh.value = UI.gh || '';
    els.inGr.value = UI.gr || '';
    els.inGmA.value = UI.gm_agent || '';
    els.inGmJ.value = UI.gm_judge || '';
    els.mod.classList.remove('hidden');
};

els.closeModal.onclick = () => els.mod.classList.add('hidden');

// Проверка при запуске: если нет ключей, требуем ввести
if (!UI.gh || !UI.gr || !UI.gm_agent || !UI.gm_judge) {
    els.mod.classList.remove('hidden');
}

// Сохранение ключей
document.getElementById('saveKeys').onclick = () => {
    localStorage.setItem('ax_gh', els.inGh.value.trim());
    localStorage.setItem('ax_gr', els.inGr.value.trim());
    localStorage.setItem('ax_gm_a', els.inGmA.value.trim());
    localStorage.setItem('ax_gm_j', els.inGmJ.value.trim());
    els.mod.classList.add('hidden');
    location.reload(); // Перезагружаем для применения
};

// Функция для GitHub (GPT) и Groq (Llama)
async function callOpenAI(url, key, model, prompt, uiNodeId) {
    const node = document.getElementById(uiNodeId);
    if (!key) { node.innerHTML = "<span style='color:#ff4b4b'>❌ Нет ключа</span>"; return "ERR"; }
    
    node.innerText = "⏳ Генерация ответа...";
    try {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ 
                model: model, 
                messages: [{ role: "user", content: prompt }]
            })
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error?.message || `Status ${r.status}`);
        
        const content = d.choices[0].message.content;
        node.innerText = content;
        return content;
    } catch (e) { 
        node.innerHTML = `<span style="color:#ff4b4b">❌ ${e.message}</span>`;
        return "ERROR";
    }
}

// Функция для Google Gemini
async function callGemini(key, model, prompt, uiNodeId) {
    const node = uiNodeId ? document.getElementById(uiNodeId) : null;
    if (!key) { 
        if(node) node.innerHTML = "<span style='color:#ff4b4b'>❌ Нет ключа</span>"; 
        return "ERR"; 
    }

    if (node) node.innerText = "⏳ Генерация ответа...";
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    
    try {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error?.message || `Status ${r.status}`);
        
        const content = d.candidates[0].content.parts[0].text;
        if (node) node.innerText = content;
        return content;
    } catch (e) {
        if (node) node.innerHTML = `<span style="color:#ff4b4b">❌ ${e.message}</span>`;
        return "ERROR";
    }
}

// Запуск Орды
els.send.onclick = async () => {
    const query = els.in.value.trim();
    if (!query) return;

    els.ld.classList.remove('hidden');
    els.res.classList.add('hidden');
    els.st.innerText = "Орда анализирует данные...";

    // Параллельный запуск трех агентов
    const tasks = [
        callOpenAI("https://models.inference.ai.azure.com/chat/completions", UI.gh, "gpt-4o-mini", query, 'res-github'),
        callOpenAI("https://api.groq.com/openai/v1/chat/completions", UI.gr, "llama-3.3-70b-versatile", query, 'res-groq'),
        // Агент на Gemini 2.5 (Использует первый ключ)
        callGemini(UI.gm_agent, "gemini-2.5-flash", query, 'res-gemini-agent') 
    ];

    const results = await Promise.all(tasks);
    
    els.st.innerText = "Верховный Судья выносит вердикт...";
    
    const judgePrompt = `Ты — Верховный Судья на базе Gemini 3.1 Flash. Проанализируй ответы трех ИИ-экспертов и выдай один идеальный, финальный ответ на запрос пользователя.
    
    ЗАПРОС: ${query}
    
    ОТВЕТ GPT-4o: ${results[0]}
    ОТВЕТ LLAMA 3.3: ${results[1]}
    ОТВЕТ GEMINI 2.5: ${results[2]}`;
    
    // Вызов Судьи на Gemini 3.1 (Использует второй ключ)
    const verdict = await callGemini(UI.gm_judge, "gemini-3.1-flash", judgePrompt, null);
    
    els.final.innerHTML = verdict.replace(/\n/g, '<br>');
    els.ld.classList.add('hidden');
    els.res.classList.remove('hidden');
};

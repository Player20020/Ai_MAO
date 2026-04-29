// AI NEXUS | CORE PROTOCOL v6.5 - DUAL GEMINI EDITION
const UI = {
    gh: localStorage.getItem('ax_gh'),          // GitHub (GPT-4o mini)
    gr: localStorage.getItem('ax_gr'),          // Groq (Llama 3.3)
    gm_agent: localStorage.getItem('ax_gm_a'),  // Gemini Агент (Ключ 1 - 2.5 Flash)
    gm_judge: localStorage.getItem('ax_gm_j')   // Gemini Судья (Ключ 2 - 3.1 Flash)
};

const els = {
    send: document.getElementById('sendBtn'),
    in: document.getElementById('userInput'),
    ld: document.getElementById('loader'),
    st: document.getElementById('status'),
    res: document.getElementById('resultArea'),
    final: document.getElementById('finalAnswer'),
    mod: document.getElementById('keyModal'),
    // Поля ввода в модалке
    inGh: document.getElementById('ghKey'),
    inGr: document.getElementById('grKey'),
    inGmA: document.getElementById('gmAgentKey'),
    inGmJ: document.getElementById('gmJudgeKey')
};

// Проверка: если хоть одного ключа нет, показываем настройки
if (!UI.gh || !UI.gr || !UI.gm_agent || !UI.gm_judge) {
    els.mod.classList.remove('hidden');
}

// Сохранение ключей в память браузера
document.getElementById('saveKeys').onclick = () => {
    localStorage.setItem('ax_gh', els.inGh.value.trim());
    localStorage.setItem('ax_gr', els.inGr.value.trim());
    localStorage.setItem('ax_gm_a', els.inGmA.value.trim());
    localStorage.setItem('ax_gm_j', els.inGmJ.value.trim());
    alert("ПРОТОКОЛ ОБНОВЛЕН. Перезагрузка системы...");
    location.reload();
};

/**
 * Вызов OpenAI-совместимых API (GitHub, Groq)
 */
async function callOpenAI(url, key, model, prompt, uiNodeId) {
    const node = document.getElementById(uiNodeId);
    if (!key) return "ERR_NO_KEY";
    
    node.innerText = "⏳ Синхронизация...";
    try {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ 
                model: model, 
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7 
            })
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error?.message || `Status ${r.status}`);
        
        const content = d.choices[0].message.content;
        node.innerText = content.substring(0, 300) + (content.length > 300 ? "..." : "");
        return content;
    } catch (e) { 
        node.innerHTML = `<span style="color:#ff4b4b">❌ ${e.message}</span>`;
        return "AGENT_OFFLINE";
    }
}

/**
 * Вызов Google Gemini API
 */
async function callGemini(key, model, prompt, uiNodeId) {
    const node = uiNodeId ? document.getElementById(uiNodeId) : null;
    if (!key) return "ERR_NO_KEY";

    if (node) node.innerText = "⏳ Анализ потока...";
    // Используем v1beta для доступа к новейшим моделям
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    
    try {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error?.message || "Gemini API Error");
        
        const content = d.candidates[0].content.parts[0].text;
        if (node) node.innerText = content.substring(0, 300) + (content.length > 300 ? "..." : "");
        return content;
    } catch (e) {
        if (node) node.innerHTML = `<span style="color:#ff4b4b">❌ ${e.message}</span>`;
        return "GEMINI_OFFLINE";
    }
}

/**
 * ГЛАВНЫЙ ЗАПУСК
 */
els.send.onclick = async () => {
    const query = els.in.value.trim();
    if (!query) return;

    els.ld.classList.remove('hidden');
    els.res.classList.add('hidden');
    els.st.innerText = "Опрашиваю Совет Агентов...";

    // Запускаем 3-х агентов параллельно
    const tasks = [
        // Агент 1: GitHub (GPT-4o mini)
        callOpenAI("https://models.inference.ai.azure.com/chat/completions", UI.gh, "gpt-4o-mini", query, 'res-github'),
        
        // Агент 2: Groq (Llama 3.3 70B)
        callOpenAI("https://api.groq.com/openai/v1/chat/completions", UI.gr, "llama-3.3-70b-versatile", query, 'res-groq'),
        
        // Агент 3: Gemini 2.5 Flash (Ключ Агента)
        // Используем id 'res-ds-chat' из твоего старого HTML для совместимости
        callGemini(UI.gm_agent, "gemini-1.5-flash", query, 'res-ds-chat') 
    ];

    const results = await Promise.all(tasks);
    
    els.st.innerText = "Верховный Судья Gemini 3.1 Flash формирует вердикт...";
    
    const judgePrompt = `Ты — Верховный Судья на базе Gemini 3.1 Flash. 
    Твоя задача: изучить ответы трех экспертов и выдать ОДИН идеальный, структурированный ответ.
    
    ЗАПРОС ПОЛЬЗОВАТЕЛЯ: ${query}
    
    МНЕНИЕ GPT-4o: ${results[0]}
    МНЕНИЕ LLAMA 3.3: ${results[1]}
    МНЕНИЕ GEMINI 2.5: ${results[2]}`;
    
    // ВЫЗОВ СУДЬИ (Используем второй ключ и модель)
    const verdict = await callGemini(UI.gm_judge, "gemini-1.5-flash", judgePrompt, null);
    
    els.final.innerHTML = verdict.replace(/\n/g, '<br>');
    els.ld.classList.add('hidden');
    els.res.classList.remove('hidden');
};


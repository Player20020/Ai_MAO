// KALAJER AI | CORE PROTOCOL v7.5
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

// АНИМАЦИЯ ТОЧЕК
let dotsInterval;
function startThinkingAnim() {
    let count = 0;
    els.st.innerText = "KalajerAI thinking";
    dotsInterval = setInterval(() => {
        count = (count + 1) % 4;
        els.st.innerText = "KalajerAI thinking" + ".".repeat(count);
    }, 500); // Смена кадра каждые 0.5 сек
}

function stopThinkingAnim() {
    clearInterval(dotsInterval);
}

// Функции API (оставляем логику, меняем только текст ожидания)
async function callOpenAI(url, key, model, prompt, uiNodeId) {
    const node = document.getElementById(uiNodeId);
    if (!key) return "ERR";
    node.innerText = "Обработка потока...";
    try {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model: model, messages: [{ role: "user", content: prompt }] })
        });
        const d = await r.json();
        return d.choices[0].message.content;
    } catch (e) { 
        node.innerHTML = "OFFLINE";
        return "ERROR";
    }
}

async function callGemini(key, model, prompt, uiNodeId) {
    const node = uiNodeId ? document.getElementById(uiNodeId) : null;
    if (!key) return "ERR";
    if (node) node.innerText = "Синхронизация данных...";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    try {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const d = await r.json();
        const content = d.candidates[0].content.parts[0].text;
        if (node) node.innerText = content;
        return content;
    } catch (e) {
        if (node) node.innerHTML = "OFFLINE";
        return "ERROR";
    }
}

els.send.onclick = async () => {
    const query = els.in.value.trim();
    if (!query) return;

    els.ld.classList.remove('hidden');
    els.res.classList.add('hidden');
    
    startThinkingAnim(); // ЗАПУСК АНИМАЦИИ

    const tasks = [
        callOpenAI("https://models.inference.ai.azure.com/chat/completions", UI.gh, "gpt-4o-mini", query, 'res-github'),
        callOpenAI("https://api.groq.com/openai/v1/chat/completions", UI.gr, "llama-3.3-70b-versatile", query, 'res-groq'),
        callGemini(UI.gm_agent, "gemini-1.5-flash", query, 'res-gemini-agent') 
    ];

    const results = await Promise.all(tasks);
    
    const judgePrompt = `Ты — Центральный Процессор KalajerAI. Сформируй финальный вердикт на основе данных от агентов AETHER, VOID и PULSE.\nЗапрос: ${query}\nДанные: ${results.join("\n\n")}`;
    
    const verdict = await callGemini(UI.gm_judge, "gemini-1.5-flash", judgePrompt, null);
    
    stopThinkingAnim(); // ОСТАНОВКА АНИМАЦИИ
    
    els.final.innerHTML = verdict.replace(/\n/g, '<br>');
    els.ld.classList.add('hidden');
    els.res.classList.remove('hidden');
};

// Настройки (остальная часть кода без изменений)
els.configBtn.onclick = () => els.mod.classList.remove('hidden');
els.closeModal.onclick = () => els.mod.classList.add('hidden');
document.getElementById('saveKeys').onclick = () => {
    localStorage.setItem('ax_gh', els.inGh.value.trim());
    localStorage.setItem('ax_gr', els.inGr.value.trim());
    localStorage.setItem('ax_gm_a', els.inGmA.value.trim());
    localStorage.setItem('ax_gm_j', els.inGmJ.value.trim());
    location.reload();
};

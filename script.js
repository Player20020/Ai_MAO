// AI NEXUS | Multimodal Agent Intelligence - CORE LOGIC v1.2
const UI = {
    gh: localStorage.getItem('ax_gh'),
    gr: localStorage.getItem('ax_gr'),
    ds: localStorage.getItem('ax_ds'),
    gm: localStorage.getItem('ax_gm')
};

// UI Elements
const els = {
    send: document.getElementById('sendBtn'),
    in: document.getElementById('userInput'),
    ld: document.getElementById('loader'),
    st: document.getElementById('status'),
    res: document.getElementById('resultArea'),
    final: document.getElementById('finalAnswer'),
    mod: document.getElementById('keyModal')
};

// Проверка ключей
if (!UI.gh || !UI.gm) els.mod.classList.remove('hidden');

// Управление настройками
document.getElementById('openSettings').onclick = () => els.mod.classList.remove('hidden');
document.getElementById('closeSettings').onclick = () => els.mod.classList.add('hidden');

document.getElementById('saveKeys').onclick = () => {
    localStorage.setItem('ax_gh', document.getElementById('ghKey').value.trim());
    localStorage.setItem('ax_gr', document.getElementById('grKey').value.trim());
    localStorage.setItem('ax_ds', document.getElementById('dsKey').value.trim());
    localStorage.setItem('ax_gm', document.getElementById('gmKey').value.trim());
    alert("Ключи DEPLOYED! Перезагрузка...");
    location.reload();
};

/**
 * Улучшенный callAgent с диагностикой ошибок
 */
async function callAgent(url, key, model, prompt, uiNodeId) {
    const node = document.getElementById(uiNodeId);
    if (!key) { node.innerText = "❌ KEY MISSING"; return "ERR_NO_KEY"; }

    node.innerText = "⏳ Ожидаю...";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${key}`, 
                "Content-Type": "application/json",
                // "Origin": window.location.origin // DeepSeek can be picky
            },
            body: JSON.stringify({ model: model, messages: [{ role: "user", content: prompt }], temperature: 0.7 })
        });
        
        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`STATUS: ${response.status} | BODY: ${errBody.substring(0, 50)}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        node.innerText = content.substring(0, 100) + "..."; // Кратко в карточку
        return content;
    } catch (e) { 
        node.innerText = `❌ ${e.message}`;
        console.error(`Error in ${model}:`, e);
        return "ERR_AGENT"; 
    }
}

async function callJudge(query, answers) {
    if (!UI.gm) return "Судья не настроен.";
    const p = `Ты Верховный ИИ. Сделай один крутой структурированный ответ из 4 экспертных мнений. Markdown разрешен. Вопрос: ${query}\n\nМнения:\n${answers}`;
    
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${UI.gm}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] })
        });
        const d = await res.json();
        return d.candidates[0].content.parts[0].text;
    } catch (e) { return "Ошибка Судьи при агрегации."; }
}

els.send.onclick = async () => {
    const q = els.in.value.trim();
    if (!q) return;

    els.ld.classList.remove('hidden');
    els.res.classList.add('hidden');
    els.st.innerText = "Синхронизация Орды...";

    const tasks = [
        callAgent("https://models.inference.ai.azure.com/chat/completions", UI.gh, "gpt-4o-mini", q, 'res-github'),
        callAgent("https://api.groq.com/openai/v1/chat/completions", UI.gr, "llama3-8b-8192", q, 'res-groq'),
        callAgent("https://api.deepseek.com/chat/completions", UI.ds, "deepseek-chat", q, 'res-ds-chat'),
        callAgent("https://api.deepseek.com/chat/completions", UI.ds, "deepseek-reasoner", q, 'res-ds-think')
    ];

    const results = await Promise.all(tasks);

    els.st.innerText = "Судья Gemini выносит вердикт...";
    const verdict = await callJudge(q, `GPT: ${results[0]}\nLlama: ${results[1]}\nDS V3: ${results[2]}\nDS R1: ${results[3]}`);
    
    els.final.innerHTML = verdict.replace(/\n/g, '<br>');
    els.ld.classList.add('hidden');
    els.res.classList.remove('hidden');
};

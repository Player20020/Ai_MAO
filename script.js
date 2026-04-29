// KALAJER AI | SANDBOX DISCOURSE v9.5
const UI = {
    gh: localStorage.getItem('ax_gh'),
    gr: localStorage.getItem('ax_gr'),
    gm_a: localStorage.getItem('ax_gm_a'), 
    gm_j: localStorage.getItem('ax_gm_j')
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

// Управление конфигурацией (Настройки ключей)
els.configBtn.onclick = () => {
    els.inGh.value = UI.gh || '';
    els.inGr.value = UI.gr || '';
    els.inGmA.value = UI.gm_a || '';
    els.inGmJ.value = UI.gm_j || '';
    els.mod.classList.remove('hidden');
};

els.closeModal.onclick = () => els.mod.classList.add('hidden');

document.getElementById('saveKeys').onclick = () => {
    localStorage.setItem('ax_gh', els.inGh.value.trim());
    localStorage.setItem('ax_gr', els.inGr.value.trim());
    localStorage.setItem('ax_gm_a', els.inGmA.value.trim());
    localStorage.setItem('ax_gm_j', els.inGmJ.value.trim());
    location.reload(); 
};

// Проверка: если ключей нет, требуем ввести
if (!UI.gh || !UI.gr || !UI.gm_a || !UI.gm_j) {
    els.mod.classList.remove('hidden');
}

// Анимация: KalajerAI thinking...
let dotsInterval;
function startAnim() {
    let i = 0;
    dotsInterval = setInterval(() => {
        i = (i + 1) % 4;
        els.st.innerText = "KalajerAI thinking" + ".".repeat(i);
    }, 400);
}

// Универсальная функция вызова API
async function callAPI(url, key, model, prompt, type) {
    if (!key) return "КЛЮЧ_ОТСУТСТВУЕТ";
    
    try {
        const headers = type === 'openai' 
            ? { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" }
            : { "Content-Type": "application/json" };
            
        const body = type === 'openai'
            ? JSON.stringify({ model: model, messages: [{ role: "user", content: prompt }] })
            : JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });

        const requestUrl = url + (type === 'gemini' ? `?key=${key}` : '');

        const r = await fetch(requestUrl, {
            method: "POST", headers: headers, body: body
        });
        const d = await r.json();
        
        if (!r.ok) throw new Error("API Error");
        
        return type === 'openai' ? d.choices[0].message.content : d.candidates[0].content.parts[0].text;
    } catch (e) { 
        return "УЗЕЛ_ВНЕ_СЕТИ"; 
    }
}

// Главный процесс Песочницы
els.send.onclick = async () => {
    const q = els.in.value.trim();
    if (!q) return;

    // Сброс интерфейса перед новым запросом
    els.ld.classList.remove('hidden');
    els.res.classList.add('hidden');
    document.getElementById('res-github').innerText = "Ожидание...";
    document.getElementById('res-groq').innerText = "Ожидание...";
    document.getElementById('res-gemini-agent').innerText = "Ожидание...";
    els.final.innerHTML = "";
    
    startAnim();

    // ШАГ 1: AETHER-1 создает фундамент
    els.st.innerText = "AETHER-1: Развертывание первичной логики...";
    const baseResponse = await callAPI("https://models.inference.ai.azure.com/chat/completions", UI.gh, "gpt-4o-mini", q, 'openai');
    document.getElementById('res-github').innerText = baseResponse;

    // ШАГ 2: Вход в Песочницу (VOID и PULSE критикуют)
    els.st.innerText = "Вход в ПЕСОЧНИЦУ: VOID-2 и PULSE-3 начали дискуссию...";
    const sandboxPrompt = `Коллега AETHER-1 предложил ответ на запрос. Проанализируй его, найди логические или фактические ошибки и предложи свой улучшенный вариант. Если всё идеально — подтверди.\n\nЗАПРОС ПОЛЬЗОВАТЕЛЯ: ${q}\nВАРИАНТ AETHER: ${baseResponse}`;
    
    const [voidReview, pulseReview] = await Promise.all([
        callAPI("https://api.groq.com/openai/v1/chat/completions", UI.gr, "llama-3.3-70b-versatile", sandboxPrompt, 'openai'),
        callAPI("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", UI.gm_a, "", sandboxPrompt, 'gemini')
    ]);

    document.getElementById('res-groq').innerText = voidReview;
    document.getElementById('res-gemini-agent').innerText = pulseReview;

    // ШАГ 3: CORE выносит вердикт
    els.st.innerText = "CORE: Синхронизация данных и финализация...";
    const finalPrompt = `Ты — CORE, верховный узел системы KalajerAI.
    В песочнице прошел диалог. Изучи базис от AETHER-1 и правки от VOID-2 и PULSE-3.
    1. Кратко опиши ход дискуссии (какие ошибки нашли, с чем согласились).
    2. Выведи идеальный итоговый ответ для пользователя, учитывающий все правки.
    
    ПРОТОКОЛ ДИСКУССИИ:
    ЗАПРОС: ${q}
    AETHER-1: ${baseResponse}
    VOID-2: ${voidReview}
    PULSE-3: ${pulseReview}`;

    const finalResult = await callAPI("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", UI.gm_j, "", finalPrompt, 'gemini');

    // Остановка лоадера и вывод
    clearInterval(dotsInterval);
    els.ld.classList.add('hidden');
    els.res.classList.remove('hidden');
    
    // Подсветка имен узлов для стиля
    els.final.innerHTML = finalResult.replace(/\n/g, '<br>').replace(/AETHER-1:|AETHER:|VOID-2:|VOID:|PULSE-3:|PULSE:|CORE:|ПРОТОКОЛ:/gi, '<b style="color:#00d2ff">$&</b>');
};

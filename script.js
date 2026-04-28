// Конфигурация ключей (Берем из памяти браузера)
const KEYS = {
    gh: localStorage.getItem('ax_gh'),
    gr: localStorage.getItem('ax_gr'),
    ds: localStorage.getItem('ax_ds'),
    gm: localStorage.getItem('ax_gm')
};

// Если ключей нет, открываем модалку сразу
if (!KEYS.gh || !KEYS.gm) document.getElementById('keyModal').classList.remove('hidden');

// Управление настройками
document.getElementById('openSettings').onclick = () => document.getElementById('keyModal').classList.remove('hidden');
document.getElementById('closeSettings').onclick = () => document.getElementById('keyModal').classList.add('hidden');

document.getElementById('saveKeys').onclick = () => {
    localStorage.setItem('ax_gh', document.getElementById('ghKey').value);
    localStorage.setItem('ax_gr', document.getElementById('grKey').value);
    localStorage.setItem('ax_ds', document.getElementById('dsKey').value);
    localStorage.setItem('ax_gm', document.getElementById('gmKey').value);
    alert("Ключи сохранены! Перезагрузка...");
    location.reload();
};

// Функция для работы с агентами
async function callAgent(url, key, model, prompt) {
    if (!key) return "Ключ отсутствует";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model: model, messages: [{ role: "user", content: prompt }] })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (e) { return "Ошибка агента: " + model; }
}

// Вызов Судьи (Gemini)
async function callJudge(query, answers) {
    const judgePrompt = `Ты - Верховный ИИ. Проанализируй эти 4 ответа и составь один финальный: \n${answers}\n\nВопрос: ${query}`;
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEYS.gm}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: judgePrompt }] }] })
        });
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    } catch (e) { return "Судья не смог вынести вердикт."; }
}

// Главный запуск
document.getElementById('sendBtn').onclick = async () => {
    const query = document.getElementById('userInput').value;
    if (!query) return;

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultArea').classList.add('hidden');

    // Параллельный опрос всех агентов
    const tasks = [
        callAgent("https://models.inference.ai.azure.com/chat/completions", KEYS.gh, "gpt-4o-mini", query),
        callAgent("https://api.groq.com/openai/v1/chat/completions", KEYS.gr, "llama3-8b-8192", query),
        callAgent("https://api.deepseek.com/chat/completions", KEYS.ds, "deepseek-chat", query),
        callAgent("https://api.deepseek.com/chat/completions", KEYS.ds, "deepseek-reasoner", query)
    ];

    const [gh, gr, dsC, dsR] = await Promise.all(tasks);

    // Заполняем отчеты
    document.getElementById('res-github').innerText = gh;
    document.getElementById('res-groq').innerText = gr;
    document.getElementById('res-ds-chat').innerText = dsC;
    document.getElementById('res-ds-think').innerText = dsR;

    // Получаем ответ от Судьи
    const verdict = await callJudge(query, `GPT: ${gh}\nLlama: ${gr}\nDS V3: ${dsC}\nDS R1: ${dsR}`);
    
    document.getElementById('finalAnswer').innerText = verdict;
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('resultArea').classList.remove('hidden');
};

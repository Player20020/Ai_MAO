// Конфигурация ключей (Твои актуальные ключи уже здесь)
const KEYS = {
    github: "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",
    groq: "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", 
    deepseek: "sk-21ea49c8daba463090ea78c4bf54fbb4",
    gemini: "AIzaSyBaC5_HJc-wv4FP48TdN2n-dwDzWxHMImI" 
};

const sendBtn = document.getElementById('sendBtn');
const loader = document.getElementById('loader');
const statusText = document.getElementById('status');
const resultArea = document.getElementById('resultArea');

// Универсальная функция для запросов (OpenAI Format)
async function fetchAgent(url, key, model, prompt) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });
        
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        
        const data = await res.json();
        return data.choices[0].message.content;
    } catch (e) {
        console.error(`Ошибка модели ${model}:`, e);
        return `[Агент ${model} временно недоступен или превышен лимит]`;
    }
}

// Специальная функция для Судьи (Google Gemini)
async function fetchGeminiJudge(userQuery, agentsAnswers) {
    const judgePrompt = `Ты — Верховный Судья нейросетевого совета. 
    Твоя задача: Прочитать ответы четырех разных ИИ-агентов на вопрос пользователя и составить один ИДЕАЛЬНЫЙ, подробный и структурированный ответ. 
    Убери повторы, исправь фактические ошибки, если они есть у агентов, и выбери самый крутой стиль изложения.
    
    ВОПРОС ПОЛЬЗОВАТЕЛЯ: "${userQuery}"
    
    ОТВЕТЫ АГЕНТОВ:
    ${agentsAnswers}
    
    ТВОЙ ИТОГОВЫЙ ВЕРДИКТ:`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEYS.gemini}`;
    
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: judgePrompt }] }]
            })
        });
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    } catch (e) {
        return "Ошибка Судьи: Не удалось собрать ответы воедино. Проверьте лимиты Gemini.";
    }
}

// Главный процесс
sendBtn.onclick = async () => {
    const query = document.getElementById('userInput').value.trim();
    if (!query) {
        alert("Сначала введите запрос, хозяин!");
        return;
    }

    // Подготовка интерфейса
    sendBtn.disabled = true;
    loader.classList.remove('hidden');
    resultArea.classList.add('hidden');
    statusText.innerText = "Орда начала обсуждение...";

    // 1. Опрашиваем всех агентов одновременно
    const agentPromises = [
        fetchAgent("https://models.inference.ai.azure.com/chat/completions", KEYS.github, "gpt-4o-mini", query),
        fetchAgent("https://api.groq.com/openai/v1/chat/completions", KEYS.groq, "llama3-8b-8192", query),
        fetchAgent("https://api.deepseek.com/chat/completions", KEYS.deepseek, "deepseek-chat", query),
        fetchAgent("https://api.deepseek.com/chat/completions", KEYS.deepseek, "deepseek-reasoner", query)
    ];

    const responses = await Promise.all(agentPromises);
    const [resGithub, resGroq, resDSChat, resDSThink] = responses;

    // Выводим ответы в "скрытые свитки"
    document.querySelector('#card-github .res-text').innerText = resGithub;
    document.querySelector('#card-groq .res-text').innerText = resGroq;
    document.querySelector('#card-ds-chat .res-text').innerText = resDSChat;
    document.querySelector('#card-ds-think .res-text').innerText = resDSThink;

    statusText.innerText = "Судья выносит вердикт...";

    // 2. Формируем контекст для Судьи
    const fullContext = `
    1. GPT-4o-mini: ${resGithub}
    2. Llama 3.1: ${resGroq}
    3. DeepSeek V3: ${resDSChat}
    4. DeepSeek R1: ${resDSThink}
    `;

    // 3. Получаем финальный ответ от Gemini
    const finalVerdict = await fetchGeminiJudge(query, fullContext);

    // 4. Показываем результат
    document.getElementById('finalAnswer').innerText = finalVerdict;
    
    loader.classList.add('hidden');
    resultArea.classList.remove('hidden');
    sendBtn.disabled = false;
};

// Кнопка подробностей
document.getElementById('toggleDetails').onclick = () => {
    const details = document.getElementById('details');
    details.classList.toggle('hidden');
    const isHidden = details.classList.contains('hidden');
    document.getElementById('toggleDetails').innerText = isHidden ? "ОТКРЫТЬ СВИТКИ ЭКСПЕРТОВ" : "СКРЫТЬ ПОДРОБНОСТИ";
};


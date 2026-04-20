const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const DEFAULT_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

function buildPrompt(topic) {
  return `Generate a concise study summary for the topic: "${topic}".

Format your response exactly like this:

Topic: ${topic}

Definition: [2-3 sentence explanation of what this topic is]

Key Points:
1. [First key point]
2. [Second key point]
3. [Third key point]
4. [Fourth key point]

Example: [A practical, concrete example showing the topic in action]

Common Mistake: [A common misconception or error students make with this topic]

Keep each section brief and focused on helping a student revise quickly.`;
}

export async function generateTopicSummary(topic, customApiKey = '') {
  const cleanTopic = topic.trim();

  if (!cleanTopic) {
    throw new Error('Enter a topic to generate a summary.');
  }

  const apiKey = customApiKey.trim() || DEFAULT_API_KEY;

  if (!apiKey) {
    throw new Error('No Groq API key found. Please enter your API key.');
  }

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: buildPrompt(cleanTopic) }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `API error: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('No response received from Groq. Please try again.');
  }

  return text.trim();
}

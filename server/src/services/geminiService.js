import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';

let genAI = null;

const getGenAI = () => {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const SYSTEM_CONTEXT = `You are an AI assistant for the FIFA World Cup 2026 Smart Stadiums & Tournament Operations platform.
You help fans, volunteers, staff, security teams, and organizers with stadium navigation, crowd management,
transportation, accessibility, sustainability, and operational decisions. Be concise, helpful, and safety-conscious.
When providing routing or evacuation guidance, prioritize accessibility and safety.`;

const fallbackResponse = (prompt) => {
  const lower = prompt.toLowerCase();
  if (lower.includes('navigate') || lower.includes('route')) {
    return 'Based on current crowd levels, I recommend using Gate C entrance and taking the accessible concourse route to Section 112. Estimated walk time: 8 minutes.';
  }
  if (lower.includes('crowd') || lower.includes('congestion')) {
    return 'North concourse is currently at 78% capacity. I recommend routing through the West Gate corridor which has 45% occupancy. Predicted congestion decrease in 15 minutes.';
  }
  if (lower.includes('transport') || lower.includes('parking')) {
    return 'Metro Line 2 shuttle from Downtown Station has 30% capacity. Parking Lot B has 120 spaces available. Estimated arrival: 25 minutes with current traffic.';
  }
  if (lower.includes('evacuat') || lower.includes('emergency')) {
    return 'EVACUATION PROTOCOL: Proceed to nearest marked exit. Use accessible routes via Gate A and Gate D. Avoid North concourse. Follow staff instructions. Emergency assembly point: Parking Lot C.';
  }
  return 'Welcome to FIFA World Cup 2026 Smart Stadium Operations. I can help with navigation, crowd updates, transport planning, translations, and match-day information. How can I assist you?';
};

export const generateAIResponse = async (prompt, context = {}) => {
  const ai = getGenAI();
  if (!ai) {
    logger.warn('Gemini API key not configured, using fallback responses');
    return fallbackResponse(prompt);
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const contextStr = Object.keys(context).length
      ? `\nContext: ${JSON.stringify(context)}`
      : '';
    const result = await model.generateContent(`${SYSTEM_CONTEXT}${contextStr}\n\nUser: ${prompt}`);
    return result.response.text();
  } catch (error) {
    logger.error('Gemini API error:', error.message);
    return fallbackResponse(prompt);
  }
};

export const translateText = async (text, targetLanguage) => {
  const ai = getGenAI();
  const langMap = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German',
    pt: 'Portuguese', ar: 'Arabic', zh: 'Chinese', ja: 'Japanese',
    ko: 'Korean', it: 'Italian', nl: 'Dutch',
  };
  const lang = langMap[targetLanguage] || targetLanguage;

  if (!ai) {
    return `[${lang}] ${text}`;
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(
      `Translate the following text to ${lang}. Return only the translation:\n\n${text}`
    );
    return result.response.text();
  } catch (error) {
    logger.error('Translation error:', error.message);
    return `[${lang}] ${text}`;
  }
};

export const generateOperationalSummary = async (data) => {
  const prompt = `Generate a concise operational summary for stadium command center based on this data:
${JSON.stringify(data, null, 2)}
Include: key metrics, alerts, recommendations, and priority actions. Format with clear sections.`;

  return generateAIResponse(prompt, { type: 'operational_summary' });
};

export const generateIncidentSummary = async (incident) => {
  const prompt = `Summarize this stadium incident and provide 3 actionable recommendations:
${JSON.stringify(incident, null, 2)}`;

  const response = await generateAIResponse(prompt, { type: 'incident_summary' });
  const lines = response.split('\n').filter(Boolean);
  return {
    summary: lines.slice(0, 3).join(' '),
    recommendations: lines.slice(3, 6).length ? lines.slice(3, 6) : [
      'Deploy additional staff to affected zone',
      'Monitor crowd density in adjacent areas',
      'Update public announcements',
    ],
  };
};

export const generateRouteRecommendation = async (from, to, crowdData, accessibility = false) => {
  const prompt = `Recommend optimal stadium route from "${from}" to "${to}".
Accessibility required: ${accessibility}
Current crowd zones: ${JSON.stringify(crowdData)}
Provide: route steps, estimated time, accessibility notes, and crowd avoidance tips.`;

  return generateAIResponse(prompt, { type: 'route_recommendation' });
};

export const generateMatchDayReport = async (matchData, operationalData) => {
  const prompt = `Generate a comprehensive match-day report for FIFA World Cup 2026:
Match: ${JSON.stringify(matchData)}
Operations: ${JSON.stringify(operationalData)}
Include: attendance analysis, crowd management summary, incidents overview, sustainability metrics, and recommendations.`;

  return generateAIResponse(prompt, { type: 'match_day_report' });
};

export const generateSustainabilitySuggestions = async (metrics) => {
  const prompt = `Analyze these sustainability metrics for a World Cup stadium and provide 5 optimization suggestions:
${JSON.stringify(metrics, null, 2)}`;

  const response = await generateAIResponse(prompt, { type: 'sustainability' });
  return response.split('\n').filter((l) => l.trim()).slice(0, 5);
};

export default {
  generateAIResponse,
  translateText,
  generateOperationalSummary,
  generateIncidentSummary,
  generateRouteRecommendation,
  generateMatchDayReport,
  generateSustainabilitySuggestions,
};

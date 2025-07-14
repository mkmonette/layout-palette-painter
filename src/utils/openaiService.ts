import OpenAI from 'openai';
import { ColorPalette } from './colorGenerator';
import { logTokenUsage } from './tokenUsageLogger';

interface OpenAIColorRequest {
  mood?: string;
  theme?: string;
  backgroundStyle?: string;
  description?: string;
  isDarkMode?: boolean;
  backgroundSettings?: {
    enabled: boolean;
    mode: 'svg' | 'gradient';
    style?: string;
    opacity?: number;
  };
}

let openaiInstance: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openaiInstance = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const generateAIColorPalette = async (request: OpenAIColorRequest): Promise<ColorPalette> => {
  if (!openaiInstance) {
    throw new Error('OpenAI not initialized. Please provide API key.');
  }

  // Get selected model from admin settings
  const adminSettings = localStorage.getItem('openai_admin_settings');
  let selectedModel = "gpt-4.1-2025-04-14"; // default model
  
  console.log('OpenAI Service - Admin settings from localStorage:', adminSettings);
  
  if (adminSettings) {
    try {
      const settings = JSON.parse(adminSettings);
      selectedModel = settings.selectedModel || "gpt-4.1-2025-04-14";
      console.log('OpenAI Service - Parsed settings:', settings);
      console.log('OpenAI Service - Selected model:', selectedModel);
    } catch (error) {
      console.warn('Error parsing admin settings for model selection:', error);
    }
  } else {
    console.log('OpenAI Service - No admin settings found, using default model:', selectedModel);
  }

  const prompt = buildColorPrompt(request);
  
  try {
    const completion = await openaiInstance.chat.completions.create({
      model: selectedModel,
      messages: [
        {
          role: "system",
          content: `You are a professional color palette designer. Generate color palettes in JSON format with specific roles. Ensure WCAG AA contrast compliance for text colors against backgrounds.

Color roles to include:
- brand: Primary brand color
- accent: Secondary accent color
- button-primary: Primary button background
- button-text: Text color for primary buttons
- button-secondary: Secondary button background
- button-secondary-text: Text color for secondary buttons
- text-primary: Main text color
- text-secondary: Secondary/muted text color
- section-bg-1: Primary background color
- section-bg-2: Secondary background color
- section-bg-3: Tertiary background color
- border: Border color
- highlight: Highlight/emphasis color
- input-bg: Form input background
- input-text: Form input text color

Return ONLY valid JSON with hex color values. Ensure text colors have sufficient contrast against their respective backgrounds.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Log token usage
    if (completion.usage) {
      const userId = localStorage.getItem('currentUserId') || 'unknown';
      logTokenUsage(userId, 'ai-color-generation', completion.usage, selectedModel);
    }

    // Parse the JSON response - handle markdown code blocks
    let jsonString = response.trim();
    
    // Remove markdown code block formatting if present
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const palette = JSON.parse(jsonString) as ColorPalette;
    
    // Validate that all required keys are present
    const requiredKeys: (keyof ColorPalette)[] = [
      'brand', 'accent', 'button-primary', 'button-text', 'button-secondary',
      'button-secondary-text', 'text-primary', 'text-secondary', 'section-bg-1',
      'section-bg-2', 'section-bg-3', 'border', 'highlight', 'input-bg', 'input-text'
    ];
    
    for (const key of requiredKeys) {
      if (!palette[key]) {
        throw new Error(`Missing color role: ${key}`);
      }
    }

    return palette;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI color palette. Please try again.');
  }
};

const buildColorPrompt = (request: OpenAIColorRequest): string => {
  const { mood, theme, backgroundStyle, description, isDarkMode, backgroundSettings } = request;
  
  let prompt = `Generate a ${isDarkMode ? 'dark mode' : 'light mode'} color palette`;
  
  if (theme || backgroundStyle || mood || description) {
    prompt += ' with the following characteristics:\n';
    
    if (theme) prompt += `- Theme: ${theme}\n`;
    if (backgroundStyle) prompt += `- Background Style: ${backgroundStyle}\n`;
    if (backgroundSettings?.enabled && backgroundSettings.mode === 'svg' && backgroundSettings.style) {
      prompt += `- Background Type: ${backgroundSettings.style} with ${Math.round((backgroundSettings.opacity || 0.3) * 100)}% opacity\n`;
    } else if (backgroundSettings?.enabled && backgroundSettings.mode === 'gradient') {
      prompt += `- Background Type: Gradient background with ${Math.round((backgroundSettings.opacity || 0.3) * 100)}% opacity\n`;
    }
    if (mood) prompt += `- Mood: ${mood}\n`;
    if (description) prompt += `- Description: ${description}\n`;
  }
  
  prompt += `\nEnsure:
- Text colors have WCAG AA contrast ratio (4.5:1) against their backgrounds
- Colors work well together and create visual hierarchy
- ${isDarkMode ? 'Dark backgrounds with light text' : 'Light backgrounds with dark text'}
- Professional and accessible design`;

  // Check if high contrast enforcement is enabled in admin settings
  const adminSettings = localStorage.getItem('openai_admin_settings');
  if (adminSettings) {
    try {
      const settings = JSON.parse(adminSettings);
      if (settings.enforceHighContrast) {
        prompt += `\n- Ensure text colors have high contrast against their background colors for readability.`;
      }
    } catch (error) {
      console.warn('Error parsing admin settings for high contrast enforcement:', error);
    }
  }

  prompt += `\n\nReturn the palette as JSON with hex color values only.`;

  return prompt;
};

export const isOpenAIInitialized = (): boolean => {
  return openaiInstance !== null;
};
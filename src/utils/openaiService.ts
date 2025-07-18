import OpenAI from 'openai';
import { ColorPalette } from './colorGenerator';
import { logTokenUsage } from './tokenUsageLogger';

interface OpenAIColorRequest {
  mood?: string;
  theme?: string;
  backgroundStyle?: string;
  description?: string;
  isDarkMode?: boolean;
  themeMode?: 'light' | 'light-midtone' | 'midtone' | 'midtone-dark' | 'dark';
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
  const { mood, theme, backgroundStyle, description, isDarkMode, themeMode, backgroundSettings } = request;
  
  // Define lightness mapping for theme modes
  const lightnessMap = {
    light: [85, 100],
    'light-midtone': [70, 84],
    midtone: [45, 65],
    'midtone-dark': [30, 44],
    dark: [10, 25]
  };

  // If themeMode is specified, use the new template with lightness ranges
  if (themeMode && lightnessMap[themeMode]) {
    const [minL, maxL] = lightnessMap[themeMode];
    
    let prompt = `Generate a website color palette for the ${themeMode} theme.

- Use lightness values between ${minL} and ${maxL} for the background and accent colors.
- Include a background color, a text color, a primary accent, and a secondary accent.
- The text color must be clearly visible and have strong contrast against the background.
- Avoid generating text colors that are too similar to the background — no low-contrast gray-on-gray or similar-tone combinations.
- Return all values in both HEX and HSL formats.`;

    // Add additional characteristics if provided
    if (theme || backgroundStyle || mood || description) {
      prompt += '\n\nAdditional characteristics:';
      if (theme) prompt += `\n- Theme: ${theme}`;
      if (backgroundStyle) prompt += `\n- Background Style: ${backgroundStyle}`;
      if (backgroundSettings?.enabled && backgroundSettings.mode === 'svg' && backgroundSettings.style) {
        prompt += `\n- Background Type: ${backgroundSettings.style} with ${Math.round((backgroundSettings.opacity || 0.3) * 100)}% opacity`;
      } else if (backgroundSettings?.enabled && backgroundSettings.mode === 'gradient') {
        prompt += `\n- Background Type: Gradient background with ${Math.round((backgroundSettings.opacity || 0.3) * 100)}% opacity`;
      }
      if (mood) prompt += `\n- Mood: ${mood}`;
      if (description) prompt += `\n- Description: ${description}`;
    }

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

    return prompt;
  }

  // Fallback to the original prompt format if no themeMode is specified
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
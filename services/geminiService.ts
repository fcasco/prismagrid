import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GridConfig, ColumnMode } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const themeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    baseHue: { type: Type.NUMBER, description: "Starting Hue (0-360)" },
    baseSat: { type: Type.NUMBER, description: "Starting Saturation (0-100)" },
    baseLight: { type: Type.NUMBER, description: "Starting Lightness (0-100)" },
    hueStep: { type: Type.NUMBER, description: "Step size for Hue change per row" },
    satStep: { type: Type.NUMBER, description: "Step size for Saturation change (can be negative)" },
    lightStep: { type: Type.NUMBER, description: "Step size for Lightness change (can be negative)" },
    columnMode: { type: Type.STRING, enum: ["lightness", "saturation"], description: "Whether columns vary lightness or saturation" },
    name: { type: Type.STRING, description: "A creative name for this theme" },
    description: { type: Type.STRING, description: "Short explanation of the theme choice" }
  },
  required: ["baseHue", "baseSat", "baseLight", "hueStep", "satStep", "lightStep", "columnMode", "name", "description"]
};

export async function generateThemeFromPrompt(prompt: string): Promise<GridConfig & { name: string, description: string }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a color grid configuration based on the concept: "${prompt}".
      The grid has rows that vary by Hue, and columns that vary by either Lightness or Saturation.
      Ensure the steps create a visually pleasing and coherent palette.
      For 'baseLight' or 'baseSat', try to pick values that allow the steps to not clip immediately.
      If columnMode is 'lightness', lightStep is used. If 'saturation', satStep is used.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: themeSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text);

    // Map the result to our GridConfig structure, ensuring defaults for rows/cols which aren't AI generated to keep grid stable
    return {
      baseHue: result.baseHue,
      baseSat: result.baseSat,
      baseLight: result.baseLight,
      hueStep: result.hueStep,
      satStep: result.satStep,
      lightStep: result.lightStep,
      columnMode: result.columnMode as ColumnMode,
      rows: 8, // Keep constant or could be dynamic
      cols: 8,
      name: result.name,
      description: result.description,
    };
  } catch (error) {
    console.error("Error generating theme:", error);
    throw error;
  }
}
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

export const MODEL = 'gemini-2.0-flash'

export async function generateText(prompt: string, maxTokens = 2048): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL })
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: maxTokens },
  })
  return result.response.text().trim()
}

export async function* streamText(prompt: string, maxTokens = 5000): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({ model: MODEL })
  const result = await model.generateContentStream({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: maxTokens },
  })
  for await (const chunk of result.stream) {
    const text = chunk.text()
    if (text) yield text
  }
}

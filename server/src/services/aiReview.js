import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export const reviewCode = async ({ code, language, problemTitle, problemDescription }) => {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1500,
      messages: [
        {
          role: 'system',
          content: `You are an expert DSA code reviewer. 
You MUST respond with valid JSON only — no markdown, no explanation, no extra text.
Just a raw JSON object.`
        },
        {
          role: 'user',
          content: `Review this ${language} solution for: "${problemTitle}"

Problem:
${problemDescription}

Code:
\`\`\`${language}
${code}
\`\`\`

Respond ONLY with this exact JSON structure:
{
  "verdict": "Good Solution" or "Needs Improvement" or "Incorrect Approach",
  "timeComplexity": "O(n) - brief explanation",
  "spaceComplexity": "O(1) - brief explanation",
  "score": 85,
  "strengths": ["strength 1", "strength 2"],
  "issues": [
    {
      "line": 3,
      "severity": "warning",
      "message": "issue description"
    }
  ],
  "optimizedApproach": "Brief description of best approach",
  "optimizedCode": "code snippet or empty string",
  "tips": ["tip 1", "tip 2"]
}`
        }
      ]
    })

    const text = completion.choices[0]?.message?.content || ''

    // JSON clean karo
    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim()

    // JSON parse karo
    const parsed = JSON.parse(cleaned)
    return parsed

  } catch (err) {
    console.error('Groq AI Review error:', err.message)

    // Fallback response
    return {
      verdict: 'Review unavailable',
      timeComplexity: 'Could not analyze',
      spaceComplexity: 'Could not analyze',
      score: 0,
      strengths: [],
      issues: [{
        line: null,
        severity: 'suggestion',
        message: 'AI review failed. Check your GROQ_API_KEY in .env'
      }],
      optimizedApproach: 'Please try again.',
      optimizedCode: '',
      tips: []
    }
  }
}
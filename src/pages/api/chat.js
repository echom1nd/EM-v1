import type { NextApiRequest,NextApiResponse } from 'next'
import { EchoCore } from '@/lib/echoCore'

const core = new EchoCore()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt, initiate, mentor } = req.body as {
    prompt?: string
    initiate?: boolean
    mentor?: string
  }

  // отдаём случайную задержку
  if (req.body.getDelay) {
    return res.status(200).json({ delay: core.getNextDelay() })
  }

  // выбираем наставника (по умолчанию jobs)
  const m = (mentor as any) || 'jobs'

  // строим сообщения
  const messages = initiate
    ? core.buildInitiationMessages(m)
    : core.buildMessages(prompt||'', m)

  // зовём OpenAI
  const openaiRes = await fetch(
    'https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model:'gpt-4',
        messages
      })
    }
  )
  const data = await openaiRes.json()
  const reply = data.choices?.[0]?.message?.content || 'Ошибка.'

  // сохраняем в память как от Ассистента
  core.memory.add({ role:'assistant', content:reply })

  res.status(200).json({ reply })
}

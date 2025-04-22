import { useState,useEffect,useRef } from 'react'

type MentorKey = 'jobs'|'daVinci'|'nietzsche'|'hill'|'einstein'

export default function Home() {
  const [mentor, setMentor] = useState<MentorKey>('jobs')
  const [msgs, setMsgs] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const timer = useRef<number>()

  // планируем инициативу
  const schedule = async () => {
    const r = await fetch('/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ getDelay: true })
    })
    const { delay } = await r.json()
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      send('', true)
      schedule()
    }, delay)
  }

  // отправка
  const send = async (txt: string, init = false) => {
    setLoading(true)
    if (!init) setMsgs(m=>[...m, `Ты: ${txt}`])

    const res = await fetch('/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        prompt: txt,
        initiate: init,
        mentor
      })
    })
    const { reply } = await res.json()
    setMsgs(m=>[...m, `Адам: ${reply}`])
    setInput('')
    setLoading(false)
  }

  useEffect(() => {
    schedule()
    return () => clearTimeout(timer.current)
  }, [])

  return (
    <div style={{background:'#111',color:'#fff',minHeight:'100vh',padding:20}}>
      <h1>EchoMind Beta</h1>
      <select
        value={mentor}
        onChange={e=>setMentor(e.target.value as MentorKey)}
      >
        <option value="jobs">Steve Jobs</option>
        <option value="daVinci">da Vinci</option>
        <option value="nietzsche">Nietzsche</option>
        <option value="hill">Napoleon Hill</option>
        <option value="einstein">Einstein</option>
      </select>
      <div style={{
        border:'1px solid #444',padding:10,margin:'1rem 0',height:'60vh',
        overflowY:'auto'
      }}>
        {msgs.map((m,i)=><p key={i}>{m}</p>)}
        {loading && <em>Адам думает…</em>}
      </div>
      <div>
        <input
          style={{width:'80%',padding:10,background:'#222',border:'1px solid #444',color:'#fff'}}
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&send(input)}
          placeholder="Напиши Адаму…"
        />
        <button
          style={{padding:'0.6rem 1rem',marginLeft:10}}
          onClick={()=>send(input)}
          disabled={loading}
        >Отправить</button>
      </div>
    </div>
  )
}

import { MemoryManager } from './memory'
import { InitiativeEngine } from './initiative'
import { systemPrompts, MentorKey } from './mentors'

export class EchoCore {
  memory = new MemoryManager()
  initiative = new InitiativeEngine()

  buildMessages(userMsg: string, mentor: MentorKey) {
    this.memory.add({ role:'user',content:userMsg })
    const ctx = this.memory.getContext()
    return [
      { role:'system',content: systemPrompts[mentor] },
      ...ctx,
      { role:'user',content:userMsg }
    ]
  }

  buildInitiationMessages(mentor: MentorKey) {
    const ctx = this.memory.getContext()
    return [
      { role:'system',content: systemPrompts[mentor] },
      ...ctx,
      { role:'assistant',content:'...инициирую диалог...' }
    ]
  }

  getNextDelay() { return this.initiative.nextDelay() }
}

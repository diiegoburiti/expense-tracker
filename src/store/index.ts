import { reactive } from 'vue'
import type { Session, User } from '@supabase/supabase-js'

type StateType = {
  user: User | null
}
const state: StateType = reactive({ user: null })

const methods = {
  setUser(payload: Session | null) {
    state.user = payload ? payload.user : null
  }
}

export { state, methods }

import { STATE } from './state.enum'

export interface Chest {
  id?: string
  isLocked?: boolean
  creatorId?: string
  winnerId?: string
  state?: STATE
  title?: string
  riddle?: string
  attempts?: number
}

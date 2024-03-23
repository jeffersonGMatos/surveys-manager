import { Question } from '../questions/question'

export interface Survey {
  surveyId: string | null
  name: string
  expirationDate: Date
  questions?: Question[]
  isActive: string
}
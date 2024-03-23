export interface Question {
  questionId: string | null
  description: string
  selectionNumber: number
  surveyId: string
  options?: QuestionOption[]
}

export interface QuestionOption {
  optionId: string
  questionId: string
  description: string
}
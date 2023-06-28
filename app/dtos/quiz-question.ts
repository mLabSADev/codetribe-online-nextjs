interface QuizQuestion {
    question: string
    questionType: 'text'
    answerSelectionType: 'single'
    answers: string[]
    correctAnswer: number
}

export default QuizQuestion
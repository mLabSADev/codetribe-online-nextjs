import Quiz from "./quiz"

interface Lesson {
    key: string
    chapterKey: string
    body: string
    videoUrl: string
    duration: string
    lesson: number
    chapter: number
    title: string
    quiz?: Quiz
    isQuiz: boolean
}

export default Lesson
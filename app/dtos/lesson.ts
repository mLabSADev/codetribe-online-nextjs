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
    isQuiz?: Quiz
}

export default Lesson
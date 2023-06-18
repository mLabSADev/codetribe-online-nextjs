interface Lesson {
    key: string
    chapterKey: string
    body: string
    videoUrl: string
    duration: string
    lesson: number
    chapter: number
    title: string
    isQuiz?: boolean
}

export default Lesson
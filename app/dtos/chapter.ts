import Lesson from "./lesson"

interface Chapter {
    title: string
    chapter: number
    lessons: Lesson[]
}

export default Chapter
import Lesson from "./lesson"

interface Chapter {
    title: string
    chapter: number
    lessons: Lesson[]
    key: string
    courseKey: string
}

export default Chapter
import Chapter from "./chapter"

interface Course {
    key: string
    title: string
    author: string
    imageUrl: string
    excerpt: string
    chapters: Chapter[]
    outline: string
}

export default Course
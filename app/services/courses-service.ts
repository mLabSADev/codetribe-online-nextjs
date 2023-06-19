import firebase from "firebase"
import Course from "../dtos/course"
import Lesson from "../dtos/lesson"
import Chapter from "../dtos/chapter"
import axios from "axios"

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  }).then((base64: any) => {
    const position = base64.indexOf("base64")

    return base64.substring(position + 7, base64.length)
  })

export const CoursesService = {
  removeLesson: (courseId: string, chapter: Chapter, lesson: Lesson) => {
    let lessons: any = {}
    for (let l of chapter.lessons) {
      if (l.lesson <= lesson.lesson) {
        l.lesson -= 1

        if (lesson.key !== l.key) {
          lessons[l.key] = l
        }
      }
    }

    console.log(lessons);
    delete lessons[lesson.key]
    console.log(lessons);
    

    return firebase.database().ref(`courses/${courseId}/chapters/${chapter.key}/lessons`).set(lessons)
  },

  moveLessonUp: (courseId: string, chapter: Chapter, lesson: Lesson) => {
    let lessons: any = {}
    for (let l of chapter.lessons) {
      if (l.lesson <= lesson.lesson) {
        l.lesson -= 1

        lessons[l.key] = l
      }
    }

    return firebase.database().ref(`courses/${courseId}/chapters/${chapter.key}/lessons`).set(lessons)
  },

  saveLesson: (courseId: string, chapter: Chapter, lesson: Lesson, currentLessonId?: string) => {
    

    if (!currentLessonId) {
      let lastLesson = 0

      if (chapter.lessons && chapter.lessons.length > 0) {
        for (let l of chapter.lessons) {
          if (l.lesson > lastLesson) {
            lastLesson = l.lesson
          }
        }
  
        lesson.lesson = lastLesson + 1
      }
    }
    

    lesson.chapter = chapter.chapter

    const videoSplit = lesson.videoUrl.split('/')
    const videoId = videoSplit[videoSplit.length - 1]

    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyCSvPQ3-fpuAYGljNEBCrWTVO-yO9tepaU`

    return axios.get(url).then(result => {
      const duration = result.data.items[0].contentDetails.duration
        .split('PT').join('')
        .split('M').join(':')
        .split('S').join('')

        if (currentLessonId) {
          return firebase.database().ref(`courses/${courseId}/chapters/${chapter.key}/lessons/${currentLessonId}`).update({
            ...lesson,
            duration: duration
          })
        } else {
          return firebase.database().ref(`courses/${courseId}/chapters/${chapter.key}/lessons`).push().set({
            ...lesson,
            duration: duration
          })
        }
      
    })

    
  },
  saveCourse: (course: Course, file: string) => {
    console.log(course)
    console.log(file)

    const profile = new Promise((resolve, reject) => {})

    return new Promise((resolve, reject) => {
      if (file) {
        return getBase64(file)
          .then(base64 => {
            return firebase
              .storage()
              .ref(`courseImages/${course.key}`)
              .putString(base64, "base64")
              .then(snapshot => {
                return snapshot.ref.getDownloadURL()
              })
          })
          .then(url => {
            resolve(url)
          })
      } else {
        resolve(course.imageUrl)
      }
    }).then(url => {
      if (course.key) {
        return firebase
          .database()
          .ref(`courses/${course.key}`)
          .update({
            ...course,
            imageUrl: url,
          })
      } else {
        return firebase
          .database()
          .ref(`courses`)
          .push({
            ...course,
            imageUrl: url,
            overview: [],
          })
      }
    })
  },
  lesson: (course: string, chapter: string, lesson: string): Promise<Lesson> => {
    return firebase
      .database()
      .ref(`courses/${course}/chapters/${chapter}/lessons/${lesson}`)
      .once("value")
      .then(snapshot => {
        return snapshot.val()
      })
  },
  courses: (): Promise<Course[]> => {
    return firebase
      .database()
      .ref(`courses`)
      .once("value")
      .then(snapshot => {
        const value = snapshot.val()
        const keys = Object.keys(value)

        return keys.map(key => {
          return {
            ...value[key],
            key,
          } as Course
        })
      })
  },
  course: (id: string): Promise<Course> => {
    return firebase
      .database()
      .ref(`courses/${id}`)
      .once("value")
      .then(snapshot => {
        const value = snapshot.val()
        console.log(value);
        

        value.chapters = Object.keys(value.chapters)
          .map(key => {
            // Something breaks here when selecting NodeJS while creating new assessments
            return {
              key,
              ...value.chapters[key],
              lessons: Object.keys(value?.chapters[key]?.lessons)
                .map(lessonKey => {
                  return {
                    key: lessonKey,
                    chapterKey: key,
                    ...value.chapters[key].lessons[lessonKey],
                  }
                })
                .sort((a, b) => {
                  if (a.lesson < b.lesson) {
                    return -1
                  } else {
                    return 1
                  }
                }),
            }
          })
          .sort((a, b) => {
            if (a.chapter < b.chapter) {
              return -1
            } else {
              return 1
            }
          })

        return value
      })
  },
}

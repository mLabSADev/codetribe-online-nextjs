import firebase from "firebase"
import Course from "../dtos/course"
import Lesson from "../dtos/lesson"

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

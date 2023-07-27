import firebase from "firebase";
import { AuthService } from "./auth-service";
import { resolve } from "path";
import Lesson from "../dtos/lesson";
import { rejects } from "assert";
// const lessons = {
//   uid: {
//     angular: {
//       progress: {
//         chapterId: {
//           lessonId: true,
//         },
//       },
//       currentChapter: "chapterId",
//       currentLesson: "lessonId",
//     },
//   },
// };
const SUCCESS = {
  status: 200,
  message: "Success", // default message, can be changed
};
const ERROR = {
  status: 401,
  message: "Error",
};
export const LessonService = {
  currentLessonPosition: (lessonId: string) => {
    return AuthService.isLoggedIn().then((user: any) => {
      console.log(`lessons/${lessonId}/${user.uid}`)
      if (user) {
        return firebase
          .database()
          .ref(`lessons/${lessonId}/${user.uid}`)
          .once("value")
          .then((snapshot) => {
            let position = snapshot.val();

            if (!position) {
              position = {
                chapter: 0,
                lesson: 0,
              };
            }

            return position;
          });
      }

      return null;
    });
  },
  currentLessonPositionForStudent: (studentUid: string, lessonId: string) => {
    return firebase
      .database()
      .ref(`lessons/${lessonId}/${studentUid}`)
      .once("value")
      .then((snapshot) => {
        const position = snapshot.val();

        return position;
      });
  },
  setCurrentPosition: (lessonId: string, chapter: number, lesson: number) => {
    return AuthService.isLoggedIn().then((user: any) => {
      if (user) {
        return firebase
          .database()
          .ref(`lessons/${lessonId}/${user.uid}`)
          .update({
            chapter,
            lesson,
          });
      }

      return null;
    });
  },
  saveQuiz: (lessonId: string, chapter: number, results: any) => {
    return AuthService.isLoggedIn().then((user: any) => {
      if (user) {
        return firebase
          .database()
          .ref(`quizes/${user.uid}/${lessonId}/${chapter}`)
          .set(results);
      }
    });
  },
  getQuizResults: (lessonId: string, chapter: number) => {
    return AuthService.isLoggedIn().then((user: any) => {
      if (user) {
        return firebase
          .database()
          .ref(`quizes/${user.uid}/${lessonId}/${chapter}`)
          .once("value")
          .then((snapshot) => {
            return snapshot.val();
          });
      }
    });
  },

  // Student Progress & Tracking
  addFinishedLesson: (
    course: string,
    chapterId: string,
    lessonId: string,
    currentLesson: Lesson
  ) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((res: any) => {
        const obj: any = {
          lesson: currentLesson,
          isDone: true,
        };
        firebase
          .database()
          .ref(`lessons/${res.uid}/${course}/progress/${chapterId}/${lessonId}`)
          .set(obj)
          .then((res) => {
            resolve({ ...SUCCESS });
          })
          .catch((err) => {
            reject({ ...ERROR });
          });
      });
    });
  },
  getUserFinishedLessons: (course: string, chapterId: string) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((res: any) => {
        firebase
          .database()
          .ref(`lessons/${res.uid}/${course}/progress/`)
          .once("value")
          .then((snapshot) => {
            const lessons = snapshot.val();

            resolve(lessons);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  },
  updateLessonFinished: (
    course: string,
    chapterId: string,
    lessonId: string
  ) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((res: any) => {
        const obj: any = {
          lessonKey: `${lessonId}`,
          isDone: true,
        };
        const lessonsRef = firebase
          .database()
          .ref(`lessons/${res.uid}/${course}/progress/${chapterId}/`);
        lessonsRef
          .push()
          .set(obj)
          .then(() => {
            lessonsRef.once("value", (snapshot) => {
              const lessons = snapshot.val();
              resolve({ ...SUCCESS, lessons });
            });
          })
          .catch((err) => {
            reject({ ...ERROR, err });
          });
      });
    });
  },
  getCurrentChapter: (course: string) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((res) => {
        firebase
          .database()
          .ref(`lessons/${res.uid}/${course}/currentChapter`)
          .once("value")
          .then((snapshot) => {
            const currentChapter = snapshot.val();
            resolve(currentChapter);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  },
  updateCurrentChapter: (
    course: string,
    // chapterId: string,
    currentChapterId: string
  ) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((user) => {
        // 'lessons/AsQuLORppvdLG12RY9qaTrJekwM2/angular/progress/-NYIAo4sdBRnBCBYJtYk'
        firebase
          .database()
          .ref(`lessons/${user.uid}/${course}`)
          .update({ currentChapter: currentChapterId })
          .then((res) => {
            resolve({ ...SUCCESS, res });
          })
          .catch((err) => {
            reject({ ...ERROR, err });
          });
      });
    });
  },
  getCurrentLesson: (course: string) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((res: any) => {
        firebase
          .database()
          .ref(`lessons/${res.uid}/${course}/currentLesson`)
          .once("value")
          .then((snapshot) => {
            const currentLesson = snapshot.val();
            resolve(currentLesson);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  },
  updateCurrentLesson: (
    course: string,
    // chapterId: string,
    currentLessonId: string
  ) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((user) => {
        // 'lessons/AsQuLORppvdLG12RY9qaTrJekwM2/angular/'
        firebase
          .database()
          .ref(`lessons/${user.uid}/${course}/`)
          .update({ currentLesson: currentLessonId })
          .then((res) => {
            resolve({ ...SUCCESS, res });
          })
          .catch((err) => {
            reject({ ...ERROR, err });
          });
      });
    });
  },

  getAllUserProgress: () => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((user) => {
        // 'lessons/AsQuLORppvdLG12RY9qaTrJekwM2'
        firebase
          .database()
          .ref(`lessons/${user.uid}`)
          .once("value")
          .then((snapshot) => {
            const data = snapshot.val();
            resolve({ ...SUCCESS, data });
          })
          .catch((err) => {
            reject({ ...ERROR, err });
          });
      });
    });
  },
  /**
   *
   * @param course course key not title
   * @returns
   */
  getUserProgressByCourse: (course: string) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((user) => {
        // 'lessons/AsQuLORppvdLG12RY9qaTrJekwM2'
        firebase
          .database()
          .ref(`lessons/${user.uid}/${course}`)
          .once("value")
          .then((snapshot) => {
            const data = snapshot.val();
            resolve({ ...SUCCESS, data });
          })
          .catch((err) => {
            reject({ ...ERROR, err });
          });
      });
    });
  },
  /**
   *
   * @param course course key not title
   * @param chapterId firebase chapter key
   * @returns
   */
  getUserProgressByChapter: (course: string, chapterId: string) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((user) => {
        // 'lessons/AsQuLORppvdLG12RY9qaTrJekwM2'
        firebase
          .database()
          .ref(`lessons/${user.uid}/${course}/progress/${chapterId}`)
          .once("value")
          .then((snapshot) => {
            const data = snapshot.val();
            resolve({ ...SUCCESS, data });
          })
          .catch((err) => {
            reject({ ...ERROR, err });
          });
      });
    });
  },
};
interface FinishCourse {
  chapterId: string;
  lessonId: string;
  nextLesson: any;
}

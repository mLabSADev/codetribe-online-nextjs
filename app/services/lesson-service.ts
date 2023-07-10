import firebase from "firebase";
import { AuthService } from "./auth-service";
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
  // Updates the lesson true
  updateLessonFinished: (
    course: string,
    chapterId: string,
    lessonId: string
  ) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((res) => {
        const obj: any = {};
        obj[`${lessonId}`] = true;
        // 'lessons/AsQuLORppvdLG12RY9qaTrJekwM2/angular/progress/-NYIAo4sdBRnBCBYJtYk'
        firebase
          .database()
          .ref(`lessons/${res.uid}/${course}/progress/${chapterId}/`)
          .update(obj)
          .then((res) => {
            resolve({ ...SUCCESS, res });
          })
          .catch((err) => {
            reject({ ...ERROR, err });
          });
      });
    });
  },

  // updates currentChapter
  updateCurrentChapter: (
    course: string,
    chapterId: string,
    currentChapterId: string
  ) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((res) => {
        // 'lessons/AsQuLORppvdLG12RY9qaTrJekwM2/angular/progress/-NYIAo4sdBRnBCBYJtYk'
        firebase
          .database()
          .ref(`lessons/${res.uid}/${course}`)
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

  // updates currentLesson
  updateCurrentLesson: (
    course: string,
    chapterId: string,
    currentLessonId: string
  ) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((res) => {
        // 'lessons/AsQuLORppvdLG12RY9qaTrJekwM2/angular/'
        firebase
          .database()
          .ref(`lessons/${res.uid}/${course}/`)
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
      AuthService.isLoggedIn().then((res) => {
        // 'lessons/AsQuLORppvdLG12RY9qaTrJekwM2'
        firebase
          .database()
          .ref(`lessons/${res.uid}`)
          .get()
          .then((res) => {
            resolve({ ...SUCCESS, res });
          })
          .catch((err) => {
            reject({ ...ERROR, err });
          });
      });
    });
  },
  getAllUserProgressByCourse: (course: string) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((res) => {
        // 'lessons/AsQuLORppvdLG12RY9qaTrJekwM2'
        firebase
          .database()
          .ref(`lessons/${res.uid}/${course}`)
          .get()
          .then((res) => {
            resolve({ ...SUCCESS, res });
          })
          .catch((err) => {
            reject({ ...ERROR, err });
          });
      });
    });
  },
  getAllUserProgressByChapter: (course: string, chapterId: string) => {
    return new Promise((resolve, reject) => {
      AuthService.isLoggedIn().then((res) => {
        // 'lessons/AsQuLORppvdLG12RY9qaTrJekwM2'
        firebase
          .database()
          .ref(`lessons/${res.uid}/${course}/progress/${chapterId}`)
          .get()
          .then((res) => {
            resolve({ ...SUCCESS, res });
          })
          .catch((err) => {
            reject({ ...ERROR, err });
          });
      });
    });
  },
};

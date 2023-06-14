import firebase from "firebase"

export const AuthService = {
  createUser: (user: any) => {
    return firebase
      .database()
      .ref(`users`)
      .orderByChild("email")
      .equalTo(user.email)
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          throw new Error("User already exists")
        } else {
          return firebase
            .database()
            .ref(`users`)
            .push({
              ...user,
              registered: false,
              createdAt: firebase.database.ServerValue.TIMESTAMP,
            })
        }
      })
  },
  confirmRegistration: (user: any) => {
    delete user.key

    return AuthService.checkUser(user.email).then(userInfo => {
      const key = userInfo.key

      return firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(registeredUser => {
          delete user.password
          delete user.confirmPassword

          return firebase
            .database()
            .ref(`users/${key}`)
            .once("value")
            .then(snapshot => {
              if (snapshot.exists()) {
                const userData = snapshot.val()

                return firebase
                  .database()
                  .ref(`users/${registeredUser.user?.uid}`)
                  .set({
                    ...userData,
                    registered: true,
                    ...user,
                  })
                  .then(() => {
                    return firebase.database().ref(`users/${key}`).remove()
                  })
              } else {
                throw new Error("Couldn't register user. An error occurred")
              }
            })
        })
    })
  },
  checkUser: (email: string) => {
    return firebase
      .database()
      .ref(`users`)
      .orderByChild("email")
      .equalTo(email)
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          const user = snapshot.val()

          const keys = Object.keys(user)

          return {
            ...user[keys[0]],
            key: keys[0],
          }
        } else {
          throw new Error("User not found")
        }
      })
  },
  login: (email: string, password: string) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },
  isLoggedIn: () => {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          resolve(user)
        } else {
          reject()
        }
      })
    })
  },
  currentUser: () => {
    return AuthService.isLoggedIn().then((user: any) => {
      return firebase
        .database()
        .ref(`users/${user.uid}`)
        .once("value")
        .then(result => {
          const data = result.val()

          return data
        })
    })
  },
  forgotPassword: (email: string) => {
    return firebase.auth().sendPasswordResetEmail(email)
  },
  logout: () => {
    return firebase.auth().signOut()
  },
  changePassword: (currentPassword: string, password: string) => {
    const { email, uid } = firebase.auth().currentUser!

    return firebase
      .auth()
      .signInWithEmailAndPassword(email!, currentPassword)
      .then(() => {
        return firebase
          .auth()
          .currentUser!.updatePassword(password)
          .then(() => {
            return firebase.database().ref(`users/${uid}`).update({
              changedPassword: true,
            })
          })
      })
  },
  keepPassword: () => {
    const { uid } = firebase.auth().currentUser!

    return firebase.database().ref(`users/${uid}`).update({
      changedPassword: true,
    })
  },
  getUser: (id: string) => {
    return firebase
      .database()
      .ref(`users/${id}`)
      .once("value")
      .then(snapshot => {
        return snapshot.val()
      })
  },
  getUserByLocation: (location: string) => {
    return firebase
      .database()
      .ref(`users`)
      .orderByChild("location")
      .equalTo(location)
      .once("value")
      .then(res => {
        return res.val()
      })
  },
}

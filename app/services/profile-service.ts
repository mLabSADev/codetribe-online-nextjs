import firebase from "firebase"
import { AuthService } from "./auth-service"

export const ProfileService = {
    profile: () => {
        return AuthService.isLoggedIn().then((user: any) => {
            return firebase.database().ref(`users/${user.uid}`).once('value').then(snapshot => {
                return {
                    ...snapshot.val(),
                    uid: user.uid
                }
            })
        })
    },

    observerProfile: (callback: any) => {
        AuthService.isLoggedIn().then((user: any) => {
            firebase.database().ref(`users/${user.uid}`).on('value', (snapshot) => {
                callback({
                    ...snapshot.val(),
                    uid: user.uid
                })
            })
        })
    },

    updateProfile: (uid: string, profile: any) => {
        return new Promise((resolve, reject) => {
            return firebase.database().ref(`users/${uid}`).update(profile).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })

    }
}
import firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB7ADJqyTfAuaa9qGQrG-d7NUZ_bnkWGwg",
    authDomain: "appmanageprocess.firebaseapp.com",
    databaseURL: "https://appmanageprocess.firebaseio.com",
    projectId: "appmanageprocess",
    storageBucket: "appmanageprocess.appspot.com",
    messagingSenderId: "468699057866",
    appId: "1:468699057866:web:128885ffa7295e6faeae33",
    measurementId: "G-R0VW5ZPHC5"
}
class Fire {
    constructor(callback) {
        this.init(callback)
    }

    init(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback(null, user)
            } else {
                firebase
                    .auth()
                    .signInAnonymously()
                    .catch(error => {
                        callback(error);
                    });
            }
        });
    }

    getLists(callback) {
        let ref = this.ref.orderBy("name");

        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = []

            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() })
            })

            callback(lists)
        })
    }

    addList(list) {
        let ref = this.ref;

        ref.add(list);
    }

    updateList(list) {
        let ref = this.ref

        ref.doc(list.id).update(list)
    }

    get userId() {
        return firebase.auth().currentUser.uid
    }

    get ref() {
        return firebase
            .firestore()
            .collection('users')
            .doc(this.userId)
            .collection("lists")
    }
    detach() {
        this.unsubscribe();
    }
}
export default Fire;
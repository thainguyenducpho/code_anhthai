// Component tương tác trực tiếp với firebase thông qua package firebase
// Nhận và gửi các dữ liệu đến App component

//import các thành phần Core Components và Native Components
import firebase from 'firebase';
import '@firebase/firestore';

// Tạo firestore trên firebase và tạo biến firebaseConfig để lưu thiết lập kết nối
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

    // Hàm khởi tạo và bắt đầu kết nối
    init(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }

        // Xác thực và tạo lưu trữ 
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

    // Lấy dữ liệu realtime về từ Firebase
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

    // Thêm một list công việc mới
    addList(list) {
        let ref = this.ref;
        ref.add(list);
    }

    // Cập nhật list công việc realtime khi có thay đổi 
    updateList(list) {
        let ref = this.ref
        ref.doc(list.id).update(list)
    }

    // Xóa list công việc theo id được chọn
    deleteList(list) {
        let ref = this.ref;
        ref.doc(list.id).delete()
    }

    // Hàm lấy id của người dùng từ kết nối đến firebase
    get userId() {
        return firebase.auth().currentUser.uid
    }

    // Get cấu trúc của cloud firestore đã tạo 
    get ref() {
        return firebase
            .firestore()
            .collection('users')
            .doc(this.userId)
            .collection("lists")
    }
    // Ngắt kết nối nhưng giữ lại dữ liệu hiện thời.
    detach() {
        this.unsubscribe();
    }
}
export default Fire;
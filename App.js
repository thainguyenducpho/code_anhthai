// Component đầu tiên được khởi chạy có tác dụng như Component Main gọi, khởi chạy và truyền nhận dữ liệu giữa 
// các component khác.

//import các thành phần Core Components và Native Components
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import colors from './Colors';
import TodoList from './components/TodoList';
import AddListModal from './components/AddListModal';
import Fire from './Fire';

//Xuất class App là một component được kế thừa từ Component của React
export default class App extends React.Component {
   //Thiết lập trạng thái ban đầu của app khi chưa nhập bất cứ gì
   state = {
      addToDoVisible: false,
      lists: [],
      user: {},
      loading: true
   };

   // Là một Component Life Cycle của React
   // Được gọi sau khi đã hiển thị component ra ngoài trình duyệt, được thực hiện một lần duy nhất.
   // Được sử dụng để kết nối với các JS Framework khác.
   componentDidMount() {
      firebase = new Fire((error, user) => {
         // Nếu kết có lỗi kết nối xuất hiện thông báo lỗi
         if (error) {
            return alert("Oh, somthing went wrong!")
         }

         // Kết nối thành công, lấy các trạng thái trên firebase để set các trạng thái mới 
         firebase.getLists(lists => {
            this.setState({ lists, user }, () => {
               this.setState({ loading: false })
            })
         })
         // Set các trạng thái mới cho đối tượng người dùng
         this.setState({ user });
      });
   }

   // Là một Component Life Cycle của React
   // Được gọi đến trước khi hiển thị component ra ngoài.
   componentWillUnmount() {
      // Hủy tất cả kết nối trước đó nhưng giữ lại dữ liệu từ lần kết nối trước
      firebase.detach();
   }

   toggleAddToDoModal() {
      // Set trạng thái cho phép thêm công việc đảo từ false thành true và ngược lại
      this.setState({ addToDoVisible: !this.state.addToDoVisible })
   };

   // Hàm mũi tên với các thành phần phía trái mũi trên là tham số truyền vào, phải là nội dung thực thi của hàm 
   renderList = list => {
      // Gọi component TodoList chứa danh sách các công việc và truyền các hàm xử lý vào
      return <TodoList
         list={list}
         updateList={this.updateList}
         deleteList={this.deleteList}
      />
   };

   // Thêm các thuộc tính tên và màu sắc khác nhau cho mỗi công việc
   addList = list => {
      firebase.addList({
         name: list.name,
         color: list.color,
         todos: []
      });
   };

   // Hàm Update danh sách công việc 
   updateList = list => {
      firebase.updateList(list);
   };

   // Hàm Delete danh sách công việc 
   deleteList = list => {
      firebase.deleteList(list);
   };

   // Hàm Được gọi khi hiển thị component ra ngoài trình duyệt.
   // Sẽ return về nội dung mà bạn đã viết, có thể là một component hoặc null hoặc là false (trong trường hợp không muốn render gì cả).
   render() {
      // Nếu trạng thái loading vẫn còn true trả về giao diện vòng tròn loading
      if (this.state.loading) {
         return (
            <View style={styles.container}>
               <ActivityIndicator size="large" color={colors.blue} />
            </View>
         )
      }
      // Nếu trạng thái loading đã chuyển sang false trả về giao diện để gọi các component AddListModal, và component TodoList dưới dạng Flatlist
      return (
         // View tổng để chứa các view component con
         <View style={styles.container}>
            {/* Gọi một Modal xuất hiện khi tương tác với view này */}
            {/* Cấu hình Modal và các sự kiện khi tương tác với modal */}
            <Modal
               animationType="slide"
               visible={this.state.addToDoVisible}
               onRequestClose={() => this.toggleAddToDoModal()}
            >
               {/* Gọi component AddListModal khi mở Modal */}
               {/* Truyền các props là các hàm xử lý khi đóng Modal  */}
               <AddListModal closeModal={() => this.toggleAddToDoModal()} addList={this.addList} />
            </Modal>

            {/* View trình bày tên app cách điệu */}
            <View style={{ flexDirection: "row" }}>
               <View style={styles.divider} />
               <Text style={styles.title}>
                  ToDo <Text style={{ fontWeight: "300", color: colors.blue }}>List</Text>
               </Text>
               <View style={styles.divider} />
            </View>

            {/* View trình bày giao diện nút Add công việc */}
            <View style={{ marginVertical: 48 }}>
               {/* Sự kiện chạm vào màng hình Tappable Components khi chạm vào icon plus*/}
               <TouchableOpacity style={styles.addList} onPress={() => this.toggleAddToDoModal()}>
                  <AntDesign name="plus" size={16} color={colors.blue} />
               </TouchableOpacity>
               <Text style={styles.add}>Add List</Text>
            </View>

            {/* View hiển thị công việc dưới dạng một FlatList(là một danh sách data được hiển thị với cách sắp xếp linh hoạt) */}
            <View style={{ height: 275, paddingLeft: 32 }}>
               {/* Hiển thị data theo chiều ngang và là trạng thái của lists, show thanh trượt, item đươc render từ hàm renderList */}
               <FlatList
                  data={this.state.lists}
                  keyExtractor={item => item.id.toString()}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => this.renderList(item)}
                  keyboardShouldPersistTaps="always"
               />
            </View>
         </View>
      );
   }
}
// Các đối tượng dùng để trình bày giao diện của app (Nó có cách hoạt động giống với CSS nhưng không phải CSS)
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
   divider: {
      backgroundColor: colors.lightBlue,
      height: 1,
      flex: 1,
      alignSelf: "center"
   },
   title: {
      fontSize: 38,
      fontWeight: "bold",
      color: colors.black,
      paddingHorizontal: 64
   },
   addList: {
      borderWidth: 2,
      borderColor: colors.lightBlue,
      borderRadius: 4,
      padding: 16,
      alignItems: "center",
      justifyContent: "center"
   },
   add: {
      color: colors.blue,
      fontWeight: "600",
      fontSize: 14,
      marginTop: 8
   }
});
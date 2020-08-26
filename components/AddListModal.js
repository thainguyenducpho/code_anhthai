// Component có nhiệm vụ thêm công việc mới 
// Truyền công việc mới sang component App để đấy lên Firebase  

//import các thành phần Core Components và Native Components
import React from 'react'
import { Text, View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import colors from '../Colors';

//Xuất class AddListModal là một component được kế thừa từ Component của React
export default class AddListModal extends React.Component {
    // Set một mảng các mã màu
    backgroundColor = ["#5CD859", "#24A6D9", "#595BD9", "#8022D9", "#D159D8", "#D85963", "#D88559"]
    // Set tên công việc ban đầu là null và màu sắc mặc định cho công việc đó là mã màu đầu tiên
    state = {
        name: "",
        color: this.backgroundColor[0]
    }

    // Hàm tạo công việc mới
    createTodo = () => {
        // Lấy trạng thái của tên công việc hiện tại và màu sắc hiện tại
        const { name, color } = this.state;
        // Đồng thời lưu vào biến list
        const list = { name, color };
        // Truyền biến list theo props addList đến component App sau đó đẩy lên firebase
        this.props.addList(list);
        // Set trạng thái tên của công việc lại null để thêm công việc kế tiếp
        this.setState({ name: "" });
        // Gọi props đóng Modal của App component
        this.props.closeModal();
    }

    // Set color truyền đi theo màu sắc được lựa chọn
    renderColor() {
        // Map tất cả màu sắc được khai báo từ đầu chương trình 
        return this.backgroundColor.map(color => {
            return (
                <TouchableOpacity
                    key={color}
                    style={[styles.colorSelect, { backgroundColor: color }]}
                    onPress={() => this.setState({ color })}
                />
            )
        })
    }

    render() {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS == "ios" ? "padding" : "null"}
            >
                <TouchableOpacity style={{ position: "absolute", top: 28, right: 28 }} onPress={this.props.closeModal}>
                    <AntDesign name="close" size={24} color={colors.black} />
                </TouchableOpacity>


                <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
                    <Text style={styles.title}>Create Todo List</Text>
                    {/* Nhập tên công việc mới cần thêm */}
                    <TextInput
                        style={styles.input}
                        placeholder="List Name?"
                        onChangeText={text => this.setState({ name: text })}
                    />
                    {/* Hiển thị danh sách các màu được định nghĩa từ ban đầu */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>{this.renderColor()}</View>

                    {/* Nút nhấn Thêm công việc mới được hiển thị cùng màu với màu sắc được lựa chọn */}
                    <TouchableOpacity
                        style={[styles.create, { backgroundColor: this.state.color }]}
                        onPress={this.createTodo}
                    >
                        <Text style={{ color: colors.white, fontWeight: "600" }}>Create!</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
// Các đối tượng dùng để trình bày giao diện của app (Nó có cách hoạt động giống với CSS nhưng không phải CSS)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.black,
        alignSelf: "center",
        marginBottom: 16
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.blue,
        borderRadius: 6,
        height: 50,
        marginTop: 8,
        paddingHorizontal: 16,
        fontSize: 18
    },
    create: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center"
    },
    colorSelect: {
        width: 30,
        height: 30,
        borderRadius: 6
    }
})
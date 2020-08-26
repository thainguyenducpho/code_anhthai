// Component được gọi khi Modal xuất hiện có nhiệm vụ hiển thị danh sách các task nhỏ hơn phải hoàn thành trong công việc đã tạo
// Nhận các props truyền từ component TodoList và Truyền danh sách các task của công việc

//import các thành phần Core Components và Native Components
import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    TextInput,
    Keyboard,
    Animated
} from 'react-native';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import colors from '../Colors';
import { Swipeable } from 'react-native-gesture-handler';

//Xuất class TodoModal là một component được kế thừa từ Component của React
export default class TodoModal extends React.Component {
    // Set trạng thái ban đầu của danh sách là rỗng
    state = {
        newTodo: ""
    }

    // Hàm đảo trạng thái hoàn thiện của task là true hoặc false
    toggleTodoCompleted = index => {
        // Biến list để lưu tạm thời giá trị xử lí
        let list = this.props.list;
        // Đảo trạng thái hoàn thành của task: true hoặc false
        list.todos[index].completed = !list.todos[index].completed;
        // Cập nhật trạng thái mới của task
        this.props.updateList(list);
    }

    // Hàm thêm task mới
    addTodo = () => {
        let list = this.props.list;
        // Kiểm tra tiêu đề của task được thêm vào 
        // Set trạng thái của task là chưa hoàn thiện và thông qua hàm update để đẩy lên firebase
        if (!list.todos.some(todo => todo.title === this.state.newTodo)) {
            list.todos.push({ title: this.state.newTodo, completed: false });

            this.props.updateList(list);
        }
        // Set lại trạng thái công việc mới là null
        this.setState({ newTodo: "" });
        // Ẩn bàn phím
        Keyboard.dismiss();
    }

    deleteTodo = index => {
        let list = this.props.list;
        // Ghi đè null lên vị trí cần xóa
        list.todos.splice(index, 1);
        // Cập nhật trạng thái mới lên firebase
        this.props.updateList(list);
    }
    renderTodo = (todo, index) => {
        return (
            // Sự kiện cho phép lướt để gọi hàm xử lý 
            <Swipeable renderRightActions={(_, dragX) => this.rightActions(dragX, index)}>
                <View style={styles.todoContainer}>
                    <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                        <Ionicons
                            // Hiển thị icon check khi công việc đã hoàn thành và uncheck khi chưa hoàn tất
                            name={todo.completed ? "ios-square" : "ios-square-outline"}
                            size={33}
                            color={colors.lightGray}
                            style={{ width: 32 }}
                        />
                    </TouchableOpacity>

                    <Text style={[
                        styles.todo,
                        {
                            // Gạch ngang và đổi màu nội dung khi task được check
                            textDecorationLine: todo.completed ? "line-through" : "none",
                            color: todo.completed ? colors.gray : colors.black
                        }
                    ]}
                    >
                        {todo.title}
                    </Text>
                </View>
            </Swipeable>
        );
    };

    rightActions = (dragX, index) => {
        // Hằng số quy định kích thước giới hạn của sự kiện Swipe
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0.9],
            extrapolate: "clamp"
        })

        // Hằng số quy định phạm vị rõ nét, phạm vi mờ ảo giới hạn của sự kiện Swipe
        const opacity = dragX.interpolate({
            inputRange: [-100, -20, -10],
            outputRange: [1, 0.9, 0],
            extrapolate: "clamp"
        })

        return (
            // Gọi hàm xóa khi thực hiện hoàn tất sự kiện lướt (Swipe)
            <TouchableOpacity onPress={() => this.deleteTodo(index)}>
                <Animated.View style={[styles.deleteButton, { opacity: opacity }]}>
                    <Animated.Text style={{ color: colors.white, fontWeight: "800", transform: [{ scale }] }}>
                        Delete
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity >
        );
    };

    render() {
        const list = this.props.list;
        // Lấy độ dài của danh sách và gằn cho biến taskCount có nhiệm vụ đếm số task
        const taskCount = list.todos.length;
        // Lấy độ dài của danh sách các task đã hoàn thiện và gán cho biến completedCount
        const completedCount = list.todos.filter(todo => todo.completed).length;
        return (
            // Component gọi bàn phím điện thoại
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "null"}>
                {/* Bảo mật thông tin nhập từ bàn phím */}
                <SafeAreaView style={styles.container}>
                    {/* Sự kiện đóng Modal khi chạm icon close */}
                    <TouchableOpacity
                        style={{ position: "absolute", top: 28, right: 28, zIndex: 10 }}
                        onPress={this.props.closeModal}>
                        <AntDesign name="close" size={24} color={colors.black} />
                    </TouchableOpacity>

                    {/* Hiển thị số lượng các task đã hoàn thiện trên tổng số */}
                    <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
                        <View>
                            <Text style={styles.title}>{list.name}</Text>
                            <Text style={styles.taskCount}>
                                {completedCount} of {taskCount} tasks
                        </Text>
                        </View>
                    </View>

                    {/* Sử dụng Flatlist để hiển thị danh sách các task */}
                    <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
                        <FlatList
                            data={list.todos}
                            renderItem={({ item, index }) => this.renderTodo(item, index)}
                            keyExtractor={item => item.title}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>

                    {/* Hiển thị khung nhập thêm task mới và nút nhấn đẩy task mới thêm lên firebase */}
                    <View style={[styles.section, styles.footer]}>
                        <TextInput
                            style={[styles.input, { borderColor: list.color }]}
                            onChangeText={text => this.setState({ newTodo: text })}
                            value={this.state.newTodo} />
                        <TouchableOpacity style={[styles.addTodo, { backgroundColor: list.color }]} onPress={() => this.addTodo()}>
                            <AntDesign name="plus" size={16} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
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
    section: {
        alignSelf: "stretch"
    },
    header: {
        justifyContent: "flex-end",
        marginLeft: 64,
        borderBottomWidth: 3,
        paddingTop: 16
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: colors.black
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: colors.gray,
        fontWeight: "600"
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 32
    },
    todo: {
        color: colors.black,
        fontWeight: "700",
        fontSize: 16
    },
    deleteButton: {
        flex: 1,
        backgroundColor: colors.red,
        alignItems: "center",
        justifyContent: "center",
        width: 80
    }
})
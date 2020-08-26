// Component có nhiệm vụ hiển thị trạng thái các task nhỏ hơn phải hoàn thành trong công việc đã tạo
// Nhận dữ liệu truyền từ component App và Truyền trạng thái hoàn thành của các task  

//import các thành phần Core Components và Native Components
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import colors from '../Colors';
import TodoModal from './TodoModal';

//Xuất class TodoList là một component được kế thừa từ Component của React
export default class TodoList extends React.Component {
    // Set trạng thái ban đầu khi chưa nhận được dữ liệu
    state = {
        showListVisible: false
    }

    /// Set trạng thái cho phép gọi Modal đảo từ false thành true và ngược lại
    toggleListModal() {
        this.setState({ showListVisible: !this.state.showListVisible })
    }

    // Hàm mũi tên với các thành phần phía trái mũi trên là tham số truyền vào, phải là nội dung thực thi của hàm
    renderList = list => {
        return <TodoList list={list} updateList={this.updateList} deleteList={this.deleteList} />
    };

    // Hàm Được gọi khi hiển thị component ra ngoài trình duyệt.
    render() {
        // Khai báo các hằng số không thay đổi trong quá trình xử lý
        const list = this.props.list;
        const completedCount = list.todos.filter(todo => todo.completed).length;
        const remainingCount = list.todos.length - completedCount;

        return (
            <View>
                {/* Gọi một Modal xuất hiện khi tương tác với view này */}
                <Modal
                    animationType="slide"
                    visible={this.state.showListVisible}
                    onRequestClose={() => this.toggleListModal()}
                >
                    {/* Gọi component AddListModal khi mở Modal */}
                    {/* Truyền các props là các hàm xử lý khi đóng Modal  */}
                    <TodoModal
                        list={list}
                        closeModal={() => this.toggleListModal()}
                        updateList={this.props.updateList} />
                </Modal>
                {/* Sự kiện chạm vào màng hình Tappable Components*/}
                <TouchableOpacity
                    style={[styles.listContainer, { backgroundColor: list.color }]}
                    // Xóa công việc khi chạm và giữ lâu
                    onLongPress={() => this.props.deleteList(list)}
                    // Thực thi hàm đảo trạng thái cho phép hiển thị Modal mỗi khi chạm
                    onPress={() => this.toggleListModal()
                    }
                >
                    {/* Hiển thị tên công việc */}
                    <Text style={styles.listTitle} numberOfLines={1}>
                        {list.name}
                    </Text>

                    {/* Hiển thị các task còn chưa hoàn thiện */}
                    <View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={styles.count}>{remainingCount}</Text>
                            <Text style={styles.subtitle}>Remaining</Text>
                        </View>
                    </View>
                    {/* Hiển thị các task đã hoàn tất */}
                    <View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={styles.count}>{completedCount}</Text>
                            <Text style={styles.subtitle}>Completed</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

};

// Các đối tượng dùng để trình bày giao diện của app (Nó có cách hoạt động giống với CSS nhưng không phải CSS)
const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 12,
        alignItems: "center",
        width: 200
    },
    listTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.white,
        marginBottom: 18
    },
    count: {
        fontSize: 48,
        fontWeight: "200",
        color: colors.white
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.white
    }
})

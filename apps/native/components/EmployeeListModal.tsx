import React, {useState} from 'react'
import { collection, getDocs} from "firebase/firestore";
import {db} from "@native/firebase";
import {
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList
} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AddEmployeeModal from "@native/components/AddEmployeeModal";

export const EmployeeListModal = ({propertyId}) => {

    const [visible, setVisible] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    const fetchData = async () => {
        const users = [];
        const querySnapshot = await getDocs(collection(db, `properties/${propertyId}/Employees`));
        querySnapshot.forEach((employee) => {
            const data = employee.data();
            users.push({
                email: data.email,
                job: data.job
            })
        });
        setEmployeeList(users)
    }

    const handlePress = async () => {
        await fetchData()
        show()
    }

    return (
        <>
            <TouchableOpacity id={"viewEmployeesBtn"} style={[styles.modalButton, styles.modalButtonShow]} onPress={handlePress} >
                <Text style={styles.modalButtonText}>VIEW EMPLOYEES</Text>
            </TouchableOpacity>
            <Modal transparent={true} visible={visible} animationType={"fade"} onRequestClose={hide}>
                <SafeAreaView style={[styles.centeredContent, styles.backGround]}>
                    <View style={styles.modal}>
                        <TouchableOpacity id={"hideEmployeeListModal"} onPress={hide} style={styles.modalButton}>
                            <FontAwesome5  name="times" solid size={24} color="#fff" />
                        </TouchableOpacity>
                        <View id={"employeeList"} style={styles.container2}>
                            <FlatList
                                data={employeeList}
                                renderItem={({item}) => <View id={"employeeView"} style={styles.employeeView}>
                                    <Text id={"employeeEmail"} style={styles.item}>{item.email}</Text>
                                    <Text id={"employeeJob"} style={styles.job}>{item.job}</Text>
                                </View>}
                            />
                        </View>
                        <AddEmployeeModal propertyId={propertyId} />
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container2: {
        flex: 1,
        paddingTop: 22,
    },
    item: {
        paddingTop: 10,
        fontSize: 18,
        height: 44,
    },
    job: {
        paddingBottom: 10,
        fontSize: 14,
    },
    employeeView: {
        borderTopColor: "gray",
        borderBottomColor: "gray",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    backGround: {
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '80%',
        height: '65%',
        margin: 15,
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 20,
        overflow: 'hidden',
    },
    modalButton: {
        backgroundColor: '#2074df',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    modalButtonShow: {
        borderRadius: 5,
    },
    modalButtonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: "500",
    },
})

export default EmployeeListModal;
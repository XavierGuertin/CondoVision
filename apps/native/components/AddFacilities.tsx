/*
    This component creates a modal where condo management companies
    can input a facility name, and operating hours for a facility.

    It is accessed from the PropertyProfileComponent which is rendered
    in the PropertyManagementScreen.
*/

// AddFacilityForm.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'; // Importing updateDoc and arrayUnion for updating an existing document
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import DropDownPicker from "react-native-dropdown-picker";

interface Reservation {
  userId: string; // Unique identifier for the user making the reservation
  startTime: Date; // Start time of the reservation
  endTime: Date; // End time of the reservation
}

// Assuming facility data type definition
interface Facility {
  facilityName: string;
  openHour: number;
  closeHour: number;
  reservations: Array<Reservation>; // Define a more specific type according to your reservation structure
  //facilityType: string;
}

interface AddFacilityFormProps {
  propertyId: string; // Assuming the property ID is passed as a prop to this component
}

const AddFacilityForm: React.FC<AddFacilityFormProps> = ({ propertyId }) => {
    const [dropOpen, setDropOpen] = useState(false);
    const [dropClose, setDropClose] = useState(false);

    const onDropOpen = useCallback(() => {
        setDropClose(false);
      }, []);

      const onDropClose = useCallback(() => {
        setDropOpen(false);
      }, []);

    const [openTime, setOpenTime] = useState(0);
    const [closeTime, setCloseTime] = useState(24);
    const [times, setTimes] = useState([
        { "label": "00:00", "value": 0 },
        { "label": "01:00", "value": 1 },
        { "label": "02:00", "value": 2 },
        { "label": "03:00", "value": 3 },
        { "label": "04:00", "value": 4 },
        { "label": "05:00", "value": 5 },
        { "label": "06:00", "value": 6 },
        { "label": "07:00", "value": 7 },
        { "label": "08:00", "value": 8 },
        { "label": "09:00", "value": 9 },
        { "label": "10:00", "value": 10 },
        { "label": "11:00", "value": 11 },
        { "label": "12:00", "value": 12 },
        { "label": "13:00", "value": 13 },
        { "label": "14:00", "value": 14 },
        { "label": "15:00", "value": 15 },
        { "label": "16:00", "value": 16 },
        { "label": "17:00", "value": 17 },
        { "label": "18:00", "value": 18 },
        { "label": "19:00", "value": 19 },
        { "label": "20:00", "value": 20 },
        { "label": "21:00", "value": 21 },
        { "label": "22:00", "value": 22 },
        { "label": "23:00", "value": 23 },
        { "label": "24:00", "value": 24 }
    ]);

    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

  const [facility, setFacility] = useState<Facility>({
    facilityName: '',
    openHour: 0,
    closeHour: 24,
    reservations: [],
    //facilityType: '',
  });

  const handleInputChange = (field: keyof Facility, value: any) => {
    setFacility((prevFacility) => ({
      ...prevFacility,
      [field]: value,
    }));
  };

  // Simplified validation check (update according to your needs)
  const validInput = () => {
    return facility.facilityName !== "" && openTime < closeTime>;// && facility.facilityType !== "";
  }

  const saveFacility = async () => {
   facility.openHour = openTime;
   facility.closeHour = closeTime;
    if (!validInput()) {
      alert('Invalid facility information!');
      return;
    }
    try {
      // Update the specified property with the new facility
      const propertyRef = doc(db, 'properties', propertyId);
      await updateDoc(propertyRef, {
        facilities: arrayUnion(facility),
      });
      alert('Facility added successfully!');
      // Reset form after successful save
      setFacility({
        facilityName: '',
        openHour: 0,
        closeHour: 0,
        reservations: [],
        //facilityType: '',
      });
    } catch (error) {
      console.error('Error adding facility:', error);
      alert('Failed to add facility.');
    }
  };

  return (
  <>
  <TouchableOpacity style={[styles.modalButton, styles.modalButtonShow]} onPress={show}>
      <Text style={styles.modalButtonText}>Add Facilities</Text>
  </TouchableOpacity>
  <Modal transparent={true} visible={visible} animationType={"fade"} onRequestClose={hide}>
    <SafeAreaView style={[styles.centeredContent, styles.backGround]}>
        <View style={styles.modal}>
            <TouchableOpacity onPress={hide} style={styles.modalButton}>
                <FontAwesome5  name="times" solid size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableWithoutFeedback>
                <View style={styles.flexibleContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Add Facility</Text>
                    </View>
                    <View style={styles.centeredContent}>
                        <View style={styles.inputContainer}>
                            <View style = {styles.fieldView}>
                                <Text style={styles.label}>Facility Name <Text style = {styles.mandatory}>*</Text></Text>
                                <TextInput
                                    id={'facilityName'}
                                    style={styles.input}
                                    placeholder="Facility Name"
                                    placeholderTextColor={'rgba(0,0,0,0.3)'}
                                    value={facility.facilityName}
                                    onChangeText={(text) => handleInputChange('facilityName', text)}
                                />
                            </View>
                            <View style = {styles.fieldView}>
                                <Text style={styles.label}>Opening Time</Text>
                                <DropDownPicker
                                    open={dropOpen}
                                    onOpen={onDropOpen}
                                    setOpen={setDropOpen}
                                    value={openTime}
                                    style={styles.input}
                                    setValue={setOpenTime}
                                    items={times}
                                    zIndex={2000}
                                    zIndexInverse={1000}
                                >
                                </DropDownPicker>
                            </View>
                            <View style = {styles.fieldView}>
                                <Text style={styles.label}>Closing Time</Text>
                                <DropDownPicker
                                    open={dropClose}
                                    onOpen={onDropClose}
                                    setOpen={setDropClose}
                                    value={closeTime}
                                    style={styles.input}
                                    setValue={setCloseTime}
                                    items={times}
                                    zIndex={1000}
                                    zIndexInverse={2000}
                                >
                                </DropDownPicker>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={saveFacility}>
                            <Text id={'createFacilityBtn'} style={styles.buttonText}>Create Facility</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    </SafeAreaView>
  </Modal>{
}
    </>
  );
};

// Styles remain largely unchanged, adjust as needed
const styles = StyleSheet.create({
  backGround: {
      backgroundColor: 'rgba(0,0,0,0.6)'
  },
  button: {
      backgroundColor: '#2074df',
      width: '80%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
  },
  buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
  },
  centeredContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  fieldView: {
    padding: 20,
  },
  flexibleContainer: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 60
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    fontSize: 16,
    borderWidth: 1,
   },
  inputContainer: {
    width: '80%',
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  mandatory: {
    color: 'red',
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
  modal: {
    width: '90%',
    height: '90%',
    margin: 15,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default AddFacilityForm;

import React, { useEffect, useState } from "react";
import UserPropertyForm from "./UserPropertyForm";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Button,
  Linking
} from "react-native";
import EmployeeListModal from "@native/components/EmployeeListModal";
import AddFacilities from "@native/components/AddFacilities";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PDFUploader from "@native/components/PDFUploader";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

// Dummy data for the condo
const condoData = {
  id: "QWRTRQWNB:LGQ",
  address: "123 Condo Lane, Condo City, CC 12345",
  lockerCount: 2,
  owner: "OwnerMcgee",
  parkingCount: 3,
  propertyName: "20",
  unitCount: 1,
  units: [
    {
      id: "DSJKL:#KD:LJGP",
      condoFees: {
        includes: [],
        monthlyFee: "$300",
      },
      lockerId: "1",
      occupantInfo: {
        contact: "4386802279",
        name: "Sam",
      },
      owner: "Sam",
      parkingSpotId: "1",
      size: "1",
      unitId: "1",
    },
  ],
};

export const PropertyProfileComponent = ({
  data = condoData,
  imageRefs = [
    require("../../../public/logoWhiteBG.png"), // Adjust the path as necessary
    require("../../../public/logoBright.png"), // Adjust the path as necessary
  ],
}) => {
  const [pdfUrls, setPdfUrls] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [expanded, setExpanded] = useState(false); // State to toggle expanded/collapsed view
  const [selectedCondoId, setSelectedCondoId] = useState(Number);
  const navigation = useNavigation();

  const fetchPDFs = async () => {
    const storage = getStorage();
    const listRef = ref(storage, `properties/${data.id}/pdfs/`);

    try {
      const result = await listAll(listRef);
      const filesData = await Promise.all(
          result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { name: itemRef.name, url };
          })
      );
      setPdfFiles(filesData);
    } catch (error) {
      console.error("Failed to fetch PDFs:", error);
    }
  };

  useEffect(() => {
    if (expanded) {
      fetchPDFs();
    }
  }, [expanded]);
  const handleUploadPDF = () => {
    PDFUploader.uploadPDF(data.id, data.owner);
  };

  const onCondoClick = async (id: string) => {
    console.log("Called");
    await AsyncStorage.setItem("unitId", id);
    await AsyncStorage.setItem("propertyId", data.id);
    setTimeout(() => {}, 500);
    console.log("Unit id saved: ", id);
    navigation.navigate("CondoUnitDescriptionScreen");
  };

  const handleFormSubmit = async (formData) => {
    try {
      const docRef = await addDoc(collection(db, "RegistrationKeys"), formData);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      id={"propertyProfileComponentToggleBtn"}
      style={styles.container}
    >
      <View style={styles.toggleContainer}>
        {!expanded && (
          <View style={styles.collapsedInfo}>
            <Image source={imageRefs[0]} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>{data.propertyName}</Text>
            </View>
          </View>
        )}
      </View>
      {expanded && (
        <ScrollView
          style={styles.expandedScrollView}
          contentContainerStyle={styles.expandedContent}
        >
          <View style={styles.imageContainer}>
            {imageRefs.map((image, index) => (
              <Image key={index} source={image} style={styles.imageExpanded} />
            ))}
          </View>
          <Text style={styles.header}>Condo Details</Text>
          <View style={styles.detailSection}>
            <Text style={styles.infoTitle}>Address:</Text>
            <Text style={styles.infoText}>{data.address}</Text>
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.infoTitle}>Locker Count:</Text>
            <Text style={styles.infoText}>{data.lockerCount}</Text>
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.infoTitle}>Owner:</Text>
            <Text style={styles.infoText}>{data.owner}</Text>
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.infoTitle}>Parking Count:</Text>
            <Text style={styles.infoText}>{data.parkingCount}</Text>
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.infoTitle}>Property Name:</Text>
            <Text style={styles.infoText}>{data.propertyName}</Text>
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.infoTitle}>Unit Count:</Text>
            <Text style={styles.infoText}>{data.unitCount}</Text>
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.infoTitle}>Units:</Text>
            <View style={styles.condoDetailSection}>
              {data.units.map((unit) => (
                <View key={unit.id} style={styles.condoProfileContainer}>
                  <Text
                    style={styles.condoText}
                    onPress={() => {
                      onCondoClick(unit.id);
                    }}
                  >
                    {unit.id}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <UserPropertyForm
            onFormSubmit={handleFormSubmit}
            propertyID={data.id}
          />
          {/** This will need to be changed for when the CONDO UNIT SCREENS are added */}
          <View style={styles.detailSection}>
            <EmployeeListModal propertyId={data.id} />
          </View>
          <View style={styles.detailSection}>
            <AddFacilities propertyId={data.id} />
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.infoTitle}>PDF Files:</Text>
            {pdfFiles.map((file, index) => (
                <Text key={index} style={styles.pdfLink} onPress={() => Linking.openURL(file.url)}>
                  {file.name}
                </Text>
            ))}
          </View>
          <TouchableOpacity onPress={handleUploadPDF} style={styles.uploadButton}>
            <Text style={styles.buttonText}>Upload PDF</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </TouchableOpacity>
  );
};

const textSize = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    margin: 10,
    backgroundColor: "#FFFFFF",
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pdfLink: {
    fontSize: textSize,
    color: "#2f80ed",
    marginLeft: 10,
    marginTop: 5,
  },
  collapsedContainer: {
    height: 100,
  },
  expandedContainer: {
    height: "auto",
  },
  expandedScrollView: {
    paddingBottom: 20,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  imageExpanded: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2f80ed",
    textAlign: "center",
    marginVertical: 10,
  },
  expandedHeader: {
    fontSize: 22,
  },
  detailSection: {
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  infoTitle: {
    fontSize: textSize,
    fontWeight: "600",
    color: "#333",
  },
  infoText: {
    fontSize: textSize,
    color: "#666",
    marginLeft: 10,
    fontFamily: "System",
  },
  uploadButton: {
    backgroundColor: "#2074df",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: textSize,
    fontWeight: "500",
  },
  infoContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  condoProfileContainer: {
    padding: 10,
    borderRadius: 3,
    margin: 10,
    backgroundColor: "#FFFFFF",
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  condoDetailSection: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  condoText: {
    fontSize: textSize,
    color: "#666",
    fontFamily: "System",
  },
});

export default PropertyProfileComponent;

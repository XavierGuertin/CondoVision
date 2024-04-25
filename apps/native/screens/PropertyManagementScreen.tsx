import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import {Button} from "@native/components/button";
import {useNavigation} from "@react-navigation/native";
import PropertyProfileComponent from "../components/PropertyProfileComponent";
import {db} from "../firebase";
import {getDocs, collection, query, where} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropertyAdapter from "@native/components/PropertyAdapter";
import {processCondoUnits} from "@native/components/processCondoUnits";


const CondoProfileScreen = () => {
    const navigation = useNavigation();

    const [ownedProperties, setOwnedProperties] = useState<Object[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const propertyList: Object[] = [];
            try {
                const userUID = await AsyncStorage.getItem("userUID");
                const propertiesCollectionSnapshot = await getDocs(
                    query(collection(db, "properties"), where("owner", "==", userUID))
                );

                propertiesCollectionSnapshot.forEach(async (propertyDoc) => {
                    const condoUnitsSnapshot = await getDocs(
                        collection(db, "properties", propertyDoc.id, "condoUnits")
                    );

                    const propertyData = propertyDoc.data();

                    let unitList = processCondoUnits(condoUnitsSnapshot);

                    if (propertyData.owner === userUID) {
                        const property = new PropertyAdapter(
                            propertyDoc.id,
                            propertyData.address,
                            propertyData.lockerCount,
                            propertyData.owner,
                            propertyData.parkingCount,
                            propertyData.propertyName,
                            propertyData.unitCount,
                            propertyData.latitude,
                            propertyData.longitude,
                            unitList
                        );
                        propertyList.push(property.toJSON());
                        setOwnedProperties(propertyList);
                    }
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 500);
            }
        };

        fetchData();
    }, []);

    const handleMapPress = () => {
        navigation.navigate("Map", {
            properties: ownedProperties,
        })
    }

    if (isLoading)
        return <ActivityIndicator style={styles.loading} size="large"/>;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Condo Profiles</Text>
                <TouchableOpacity id={"mapBtn"} style={styles.mapButton} onPress={handleMapPress}>
                    <Text style={styles.mapText}>Map</Text>
                </TouchableOpacity>
            </View>
            <ScrollView id="propertyView" style={styles.flexibleContainer}>
                {ownedProperties.length > 0 ? (
                    ownedProperties.map((property) => (
                        <PropertyProfileComponent
                            id="propertyProfileComponent"
                            data={property}
                            key={property.id}
                        />
                    ))
                ) : (
                    <Text style={styles.noCondosText}>No Condos were found.</Text>
                )}
            </ScrollView>
            <View id="addPropertyBtnView" style={styles.addPropertyBtn}>
                <Button
                    text="Register a New Property"
                    onClick={() => navigation.navigate("AddCondoProfileScreen")}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    flexibleContainer: {
        flex: 1,
        width: "100%",
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: "flex-start",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 20,
        marginTop: 20,
    },
    headerIcon: {
        padding: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginLeft: 20, // Added margin to space out the title from the icon
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noCondosText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
    },
    addPropertyBtn: {
        margin: 30,
        marginBottom: 100,
    },
    mapButton: {
        backgroundColor: '#2074df',
        width: 'auto',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginRight: 20,
        borderRadius: 10,
    },
    mapText: {
        color: 'white',
        fontWeight: "500",
    }
});

export default CondoProfileScreen;

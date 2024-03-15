import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PDFUploader {
    static async uploadPDF(propertyId, propertyOwner) {
        const pickerResult = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true
        });

        // Check if the operation was canceled
        if (pickerResult.canceled || !pickerResult.assets || pickerResult.assets.length === 0) {
            console.log('Document picker was canceled or no file was selected');
            return;
        }

        // Assuming only one file is picked, access the first item in the assets array
        const pickedFile = pickerResult.assets[0];

        try {
            // Fetch the blob directly from the file URI
            const response = await fetch(pickedFile.uri);
            const blob = await response.blob();

            
            const fileName = pickedFile.name || `CondoPDF-${new Date().toISOString()}.pdf`;

            const storage = getStorage();
            const storageRef = ref(storage, `users/${propertyOwner}/properties/${propertyId}/pdfs/${fileName}`);

            // Use uploadString to upload the file directly
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);

            console.log('File available at', downloadURL);
            // Save the download URL using AsyncStorage
            await AsyncStorage.setItem(`pdf_${propertyId}`, downloadURL);

            alert("File uploaded successfully!");
        } catch (error) {
            console.error("Error uploading file or getting download URL: ", error);
        }
    }
}

export default PDFUploader;
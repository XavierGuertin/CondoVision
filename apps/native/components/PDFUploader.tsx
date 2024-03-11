import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { size } from 'cypress/types/lodash';

class PDFUploader {
    static async uploadPDF(propertyId) {
        // Attempt to pick a document
        const pickerResult = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true
        });

        // Check for cancellation
        if (pickerResult.type === 'cancel') {
            console.log('Document picker was canceled');
            return;
        }


        try {
            const uri = pickerResult.uri;
            const response = await fetch(uri);
            const blob = await response.blob();
            console.log(`Blob size: ${blob.size}`);
            const fileName = pickerResult.name || `CondoPDF.pdf`;

            const storage = getStorage();
            const storageRef = ref(storage, `properties/${propertyId}/pdfs/${fileName}`);

            const snapshot = await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(snapshot.ref);

            console.log('File available at', downloadURL);

            await AsyncStorage.setItem(`pdf_${propertyId}`, downloadURL);
            alert("File uploaded successfully!")
        } catch (error) {
            console.error("Error uploading file or getting download URL: ", error);
        }
    }
}

export default PDFUploader;
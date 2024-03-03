import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from "@web/firebase";
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface PdfUploadButtonProps {
  propertyId: string; // Unique ID for the property
}

const PdfUploadButton: React.FC<PdfUploadButtonProps> = ({ propertyId }) => {
  const uploadPDF = async () => {
    console.log("Upload PDF function triggered");
    try {
      console.log("Attempting to pick a document...");
      // Use DocumentPicker.pick for single file selection
      const result: DocumentPickerResponse[] =  await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log("Document picked:", result[0].name);

      // Ensure user is signed in 
      const auth = getAuth();
      const user = auth.currentUser;
      if(!user){
        console.log("No authenticated user found.");
        Alert.alert("Upload Failed", "No authneticated user dounds.");
        return;
      }
      console.log("Authenticated user:", user.uid); // Log the user's UID

      //TODO: Add verification that user is has Property Management role

      const fileUri = result[0].uri;
      const fileName = result[0].name;
      console.log(`File URI: ${fileUri}, File Name: ${fileName}`);

      const filePath = `users/${user.uid}/${fileName}`;
      const fileRef = ref(storage, filePath);

      console.log(`File URI: ${fileUri}, File Name: ${fileName}`);
      const response = await fetch(fileUri);
      const blob = await response.blob();

      await uploadBytes(fileRef, blob).then(async (snapshot) => {
        console.log("File uploaded. Getting download URL...");
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Add file reference to Firestore in the propertyFiles collection
        console.log("Adding file reference to Firestore...");
        const propertyFilesRef = collection(db, "properties", propertyId, "propertyFiles");
        await addDoc(propertyFilesRef, { fileName, downloadURL });

        console.log("Upload Success. PDF has been successfully uploaded and linked.");
        Alert.alert("Upload Success", "PDF has been successfully uploaded and linked.");
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.error('Upload Error:', err);
        Alert.alert("Upload Error", "Failed to upload PDF.");
      }
    }
  };

  return (
    <TouchableOpacity onPress={uploadPDF} style={{ padding: 10, backgroundColor: '#007bff' }}>
      <Text style={{ color: '#ffffff' }}>Upload PDF new</Text>
    </TouchableOpacity>
  );
};

export default PdfUploadButton;
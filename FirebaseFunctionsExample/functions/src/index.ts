import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp({
  databaseURL: 'http://localhost:8080'
});

const COLLECTION_NAME = 'maintenance-collection';

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  console.log('hello test');
  response.send("Hello from Firebase!");
});

export const addMessage = functions.https.onRequest(async (request, response) => {
  if(request.method != 'POST') response.send('Need a POST message to send request');
  let original = request.query.text;
  console.log(request.query);
  const writeResult = await admin.firestore().collection("messages").add({ original: original });

  response.json({ result: `Message with ID: ${writeResult.id} added.` });
});

exports.saveMaintenanceDataToFirestore = functions.https.onRequest(async (req, res) => {
  try {
    console.log(req.body);
    // Get the data from the request body
    const data = req.body;

    // Save the data to Firestore
    const docRef = await admin.firestore().collection(COLLECTION_NAME).add(data);

    // Return the ID of the newly created document
    res.json({  result: `Data with ID: ${docRef.id} was added` });
  } catch (error) {
    // Handle any errors that occur
    console.error('Error saving data to Firestore:', error);
    res.status(500).send('Error saving data to Firestore');
  }
});

export const getSpecificStoreData = functions.https.onRequest(async (req, res) => {
  try {
    const fieldName = 'StoreName';
    const fieldValue = req.query.fieldValue;

    const querySnapshot = await admin.firestore().collection(COLLECTION_NAME).where(fieldName, '==', fieldValue).get();
    const data = querySnapshot.docs.map((doc) => doc.data());

    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Error retrieving data from Firestore');
  }
});






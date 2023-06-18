import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
//Need to import Timestamp from google-cloud and not admin
import { Timestamp } from "@google-cloud/firestore";

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
  if (request.method != 'POST') response.send('Need a POST message to send request');
  let original = request.query.text;
  console.log(request.query);
  const writeResult = await admin.firestore().collection("messages").add({ original: original });

  response.json({ result: `Message with ID: ${writeResult.id} added.` });
});

export const saveMaintenanceDataToFirestore = functions.https.onRequest(async (req, res) => {
  try {
    console.log(req.body);
    // Get the data from the request body
    const data = req.body;
    // Convert "WorkDate" field to a Firestore Timestamp
    if (data["WorkDate"]) {
      const dateConvert = new Date(data["WorkDate"]);
      const timeStamp = Timestamp.fromDate(dateConvert); // Use Timestamp from the correct package
      data.WorkDate = timeStamp;
    }

    // Save the data to Firestore
    const docRef = await admin.firestore().collection(COLLECTION_NAME).add(data);

    // Return the ID of the newly created document
    res.json({ result: `Data with ID: ${docRef.id} was added` });
  } catch (error) {
    // Handle any errors that occur
    console.error('Error saving data to Firestore:', error);
    res.status(500).send('Error saving data to Firestore');
  }
});

export const getSpecificStoreData = functions.https.onRequest(async (req, res) => {
  try {
    //Field Name we are filtering on
    const fieldName = 'StoreName';
    //Grabs the field value from request query 
    const storeName = req.query.storeName;

    //Queries the Firestore collection based on the field value
    const querySnapshot = await admin.firestore().collection(COLLECTION_NAME).where(fieldName, '==', storeName).get();
    //Grabs all the docs that were filtered and stores it into an object to pass back
    const data = querySnapshot.docs.map((doc) => doc.data());
    //Send the json data back
    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Error retrieving data from Firestore');
  }
});

export const updateDataByField = functions.https.onRequest(async (req, res) => {
  try {
    // Extract the field value from the request body
    const ticketLink = req.query.ticketLink;

    // Extract the updated data from the request body
    const updatedMaintenance = req.query.updatedMaintenance;

    // Query the Firestore collection based on the field value
    const querySnapshot = await admin.firestore().collection(COLLECTION_NAME).where('TicketLink', '==', ticketLink).get();
    console.log(querySnapshot);
    // Update the documents with the updated data
    const batch = admin.firestore().batch();
    querySnapshot.forEach((doc) => {
      const docRef = doc.ref;
      batch.update(docRef, { 'WorkTime.Maintenance': updatedMaintenance });
    });

    // Commit the batch write
    await batch.commit();

    res.status(200).send('Data updated successfully');
  } catch (error) {
    console.log(error);
    console.error('Error updating data:', error);
    res.status(500).send('Error updating data');
  }
});

// Function to get data by date range passed into parameters GET Call
export const getDataByDateRange = functions.https.onRequest(async (request, response) => {
  //Grabs the start/end date and store name from GET Request
  const startDate = request.query.startDate as string;
  const endDate = request.query.endDate as string;
  const storeName = request.query.storeName as string;
  try {
    //Creates the snapshot that filters the collection by the date range and store name
    const snapshot = await admin.firestore().collection(COLLECTION_NAME)
      .where('StoreName', '==', storeName)
      .where('WorkDate', '>=', new Date(startDate))
      .where('WorkDate', '<=', new Date(endDate))
      .get();

    const objects: any[] = [];
    //filters through the snapshot and adds it to the objects array
    snapshot.forEach((doc) => {
      const data = doc.data();
      //Grabs the Timestamp field and changes it to a Javascript Date to work with
      const workDateTimestamp = data.WorkDate.toDate();
      const updatedData = { ...data, WorkDate: workDateTimestamp };
      objects.push(updatedData);
    });

    response.json(objects);
  } catch (error) {
    console.error('Error getting objects:', error);
    response.status(500).send('Error getting objects');
  }
});

//Clears the collection, we call this before initializing to ensure we don't re-input initial load
export const clearCollection = functions.https.onRequest(async (req, res) => {
  try {
    const batch = admin.firestore().batch();
    const collectionRef = admin.firestore().collection(COLLECTION_NAME);

    const snapshot = await collectionRef.get();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.status(200).send('Collection cleared successfully');
  } catch (error) {
    console.error('Error clearing collection:', error);
    res.status(500).send('Error clearing collection');
  }
});




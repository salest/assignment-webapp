import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const addMessage = functions.https.onRequest(async (request, response) =>
{
    let original  = request.query.text;

    const writeResult = await admin.firestore().collection("messages").add({original: original});

    response.json({result: `Message with ID: ${writeResult.id} added.`});
});
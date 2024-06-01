const Firestore = require('@google-cloud/firestore');

const db = new Firestore();
const predictionsCollection = db.collection('predictions');

async function storeData(id, data) {
  try {
    const predictCollection = db.collection('predictions');
    await predictCollection.doc(id).set(data);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to store data' };
  }
}


module.exports = {predictionsCollection, storeData };

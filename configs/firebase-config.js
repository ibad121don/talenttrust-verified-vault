const admin = require("firebase-admin");

//for testing
const serviceAccount = require("./lookoutFirebaseSDK.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
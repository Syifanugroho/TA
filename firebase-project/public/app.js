// Database Paths
var dataFloatPath = 'test/activity';

// Get a database reference 
const databaseFloat = database.ref(dataFloatPath);

// Variables to save database current values
var floatReading;

// Attach an asynchronous callback to read the data
databaseFloat.on('value', (snapshot) => {
  floatReading = snapshot.val();
  console.log(floatReading);
  document.getElementById("reading-activity").innerHTML = floatReading;
}, (errorObject) => {
  console.log('The read failed: ' + errorObject.name);
});
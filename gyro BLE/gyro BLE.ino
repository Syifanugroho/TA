// source : https://randomnerdtutorials.com/esp32-data-logging-firebase-realtime-database/ 

#include <Arduino.h>
#include <WiFi.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <Firebase_ESP_Client.h>
#include "time.h"
#include <string>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID "TOWER HOUSE 2"
#define WIFI_PASSWORD "0150150150"

// Insert Firebase project API Key
#define API_KEY "AIzaSyA1a7i27piXVjDQsofH4QpC7jFNMM0q5ms"

// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "https://gyro-46e36-default-rtdb.asia-southeast1.firebasedatabase.app/" 


//Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// user anon pake ini
bool signupOK = false;

// Database main path (to be updated in setup with the user UID)
String databasePath;
// Database child nodes
String distance_1 = "/distance1"; 
String distance_2 = "/distance2";
String distance_3 = "/distance3";
String activityPath = "/activity";
String timePath = "/timestamp";

// Parent Node (to be updated in every loop)
String parentPath;

int timestamp;
FirebaseJson json;

const char* ntpServer = "pool.ntp.org";

// MPU6050 sensor
Adafruit_MPU6050 mpu; // I2C

// Timer variables (send new readings every three minutes)
unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 15000;

// BLE
int scanTime = 5; //In seconds
BLEScan* pBLEScan;
typedef struct {
  char address[17];   // 67:f1:d2:04:cd:5d
  int rssi;
  float dista;
} BeaconData;

uint8_t bufferIndex = 0;
BeaconData buffer[50];
float rssi_str;
float distance;

//d3:bb:c2:50:f6:89
float x_1 = 0.22;
float y_1 = 0;
//db:3a:0c:92:b1:4f
float x_2 = 2;
float y_2 = 0.22;
//ee:fd:44:1d:15:07
float x_3 = 0.1;
float y_3 = 1.5;
// Initialize MPU6050
void initMPU(){
  // Try to initialize!
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");
}

// Initialize WiFi
void initWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
  Serial.println();
}

// Function that gets current epoch time
unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    //Serial.println("Failed to obtain time");
    return(0);
  }
  time(&now);
  return now;
}

// BLE

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
      extern uint8_t bufferIndex;
      extern BeaconData buffer[];
      if(bufferIndex >= 50){
        return;
      }
    rssi_str = float(advertisedDevice.getRSSI());
    distance = pow(10,(-70-rssi_str)/42);

    if(advertisedDevice.haveRSSI()) {
      buffer[bufferIndex].rssi = advertisedDevice.getRSSI();
      buffer[bufferIndex].dista = distance;
    } else { buffer[bufferIndex].rssi =  0; }
    strcpy (buffer[bufferIndex].address, advertisedDevice.getAddress().toString().c_str());
    
    bufferIndex++;

    // Print everything via serial port for debugging
    //Serial.printf("MAC: %s \n", advertisedDevice.getAddress().toString().c_str());
    //Serial.printf("name: %s \n", advertisedDevice.getName().c_str());
    //Serial.printf("RSSI: %d \n", advertisedDevice.getRSSI());
    //Serial.printf("Distance: %f \n",distance);
    }
};

// Write float values to the database
void sendFloat(String path, float value){
  if (Firebase.RTDB.setFloat(&fbdo, path.c_str(), value)){
    Serial.print("Writing value: ");
    Serial.print (value);
    Serial.print(" on the following path: ");
    Serial.println(path);
    Serial.println("PASSED");
    Serial.println("PATH: " + fbdo.dataPath());
    Serial.println("TYPE: " + fbdo.dataType());
  }
  else {
    Serial.println("FAILED");
    Serial.println("REASON: " + fbdo.errorReason());
  }
}
void setup(){
  Serial.begin(115200);

  // Initialize MPU6050 sensor
  initMPU();
  initWiFi();
  configTime(0, 0, ntpServer);

  // Assign the api key (required)
  config.api_key = API_KEY;


  // Assign the RTDB URL (required)
  config.database_url = DATABASE_URL;

  // user anon
  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  // Assign the maximum retry of token generation (user bukan anon)
  // config.max_token_generation_retry = 5;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); //create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);  // less or equal setInterval value
}

void loop(){
  //BLE
  float d1,d2,d3;
  // put your main code here, to run repeatedly:
  BLEScanResults foundDevices = pBLEScan->start(scanTime, false);
  Serial.print("Devices found: ");
  Serial.println(foundDevices.getCount());
  for (uint8_t i = 0; i < bufferIndex; i++) {
    Serial.print(buffer[i].address);
    Serial.print(" : ");
    Serial.println(buffer[i].rssi);
    Serial.println(buffer[i].dista);
    if (buffer[i].address[1] == '3'){
      d1 = buffer[i].dista;
    }
    else if (buffer[i].address[1] == 'b'){
      d2 = buffer[i].dista;
    }
    else if (buffer[i].address[1] == 'e'){
      d3 = buffer[i].dista;
    }
  }

  // Send new readings to database
  if (Firebase.ready() && (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();

    //Get current timestamp
    timestamp = getTime();
    Serial.print ("time: ");
    Serial.println (timestamp);

    parentPath= databasePath + "/" + "test";
    /* Get new sensor events with the readings */
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);
    
    float accX, accY, accZ, gyroX, gyroY, gyroZ, magAcc, magGyro;
    accX=a.acceleration.x-0.3;
    accY=a.acceleration.y+0.05;
    accZ=a.acceleration.z;
    gyroX=g.gyro.x*57.3+2.4;
    gyroY=g.gyro.y*57.3+0.8;
    gyroZ=g.gyro.z*57.3+1;

    magAcc=pow(pow(accX,2)+pow(accY,2)+pow(accZ,2),0.5);
    magGyro=pow(pow(gyroX,2)+pow(gyroY,2)+pow(gyroZ,2),0.5);

    String activity;

    if(magAcc < 10 && magAcc > 9 && magGyro < 10 && magGyro > 1){
      activity="Walking";      
    }
    else if (magGyro < 1){
      activity="Sleeping"; 
    }
    else if (magGyro > 20){
      activity="Falling"; 
    }
    else{
      activity="Walking"; 
    }

    sendFloat(distance_1, d1);
    sendFloat(distance_2, d2);
    sendFloat(distance_3, d3);
    json.set(activityPath.c_str(), activity);
    json.set(timePath, String(timestamp));
    Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, parentPath.c_str(), &json) ? "ok" : fbdo.errorReason().c_str());
  }
  // Stop BLE
  pBLEScan->stop();
  Serial.println("Scan done!");
  bufferIndex = 0;
  delay(2000);
}

Hello there, this is a guide on how to access this application through android emulator using Ionic and Capacitor. The following prerequisites is required to run the application on android emulator.

1. Type the following CLI commands:
   a) npm install -g @ionic/cli
   b) npm install @capacitor/core @capacitor/cli
   c) npm i react-chartjs-2 chart.js
2. To run the android version of this application, do the following CLI command: ionic cap run android
3. To open the android build of this application, do the following CLI command: ionic cap open android
4. To run the web build of this application, do the following CLI command: ionic serve

ALTERNATIVE METHOD - To open android build for application
1. Open the android build using the following CLI command: ionic cap open android
2. Go to the "Tools" tab in Android Studio and select "Device Manager"
3. Click on any android emulator OR Create a new one then run the android application

BIG NOTE: There may be an issue if you attempt to run the android application for the first time using the ionic cap run android command. To solve this, you have to go into the android build and update your AGP version to the latest verison in Android Studio (it should be an obvious blue button below for you to update)

Note #2: To ensure that you are using the latest version of the android build, please do "ionic cap sync" before opening/running the build for android

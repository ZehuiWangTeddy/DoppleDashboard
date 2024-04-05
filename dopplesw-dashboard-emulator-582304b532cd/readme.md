# Dashboard Emulator
This software package emulates the data that gets published by services part of the Tailor project. The data gets published to MQTT using the tailor MQTT specification, where a new data type 'dashboard' was created for this.

## What does it do?
When the software starts up it connects to the provided MQTT server. If the connection was successfull it will show `MQTT_CONNECTED` in the console. Then on a timer it will publish data over mqtt to the provided services. When it does this it publishes `EMULATING_SERVICES` to the console.

You can exit the software using <kbd>Ctrl</kbd> + <kbd>C</kbd>. It will show `STOPPING_SERVER` in the console.

## How to run it?
If this is your first time using NodeJS make sure you have installed Node and added it to your `$PATH`  
If you already have node installed you can open the directory you have cloned the source code to and simply run `npm install`. After that completes you can run `npm start` and the application will start.
### Configuration
Default the program is configured to connect using `mqtt://localhost:1883` this means you need to run a mqtt broker locally. 
If you have a mqtt server running somewhere else, change the MQTT_URI variable in `dashboard.js`:
```js 
const MQTT_URI = "mqtt://localhost:1883"
```

Other configuration options include the `DASHBOARD_FREQUENCY` and `SERVICES` constant variables. This changes the behavior of what gets published.
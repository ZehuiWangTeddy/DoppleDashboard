import { connect } from "mqtt";
import names from './random_names.json' assert { type: "json" };

/**
 * Param that allows the console app to be exited.
 */
let requested_stop = false;

/**
 * Prevents the looper from starting if there is no connection
 */
let mqtt_connected = false;

/**
 * Gets the javascript timeout object so we can cancel the next looper call.
 */
let looper_timeout = null;

/**
 * Frequency at which dashboard updates should be published.
 * Unit is in seconds
 */
const DASHBOARD_FREQUENCY = 300;

/**
 * Change this to connect to a different server
 */
const MQTT_URI = "mqtt://localhost:1883"

/**
 * List of services that this application emulates
 */
const SERVICES = [
    {
        key: "CHISEL-SERVER",
        name: "Chisel Server",
        keys: [
            { name: "total_production_orders", type: "number" },
            { name: "production_orders_planned_today", type: "number" },
            { name: "production_orders_planned_week", type: "number" },
            { name: "production_orders_in_progress", type: "list" },
            { name: "current_operator", type: "string" },
        ]
    },
    {
        key: "ORDER-PORTAL",
        name: "Order API",
        keys: [
            { name: "total_orders_earsonly_created", type: "number" },
            { name: "total_orders_earsonly_locked", type: "number" },
            { name: "total_orders_earsonly_confirmed", type: "number" },
            { name: "total_orders_earsonly_in_production", type: "number" },
            { name: "total_orders_earsonly_shipped", type: "number" },
            { name: "total_orders_earsonly_completed", type: "number" },
            { name: "total_orders_reduson_created", type: "number" },
            { name: "total_orders_reduson_locked", type: "number" },
            { name: "total_orders_reduson_confirmed", type: "number" },
            { name: "total_orders_reduson_in_production", type: "number" },
            { name: "total_orders_reduson_shipped", type: "number" },
            { name: "total_orders_reduson_completed", type: "number" },
        ]
    },
    {
        key: "PRADA",
        name: "Printing Service",
        keys: [
            { name: "printer_1_status", type: "string" },
            { name: "printer_2_status", type: "string" },
            { name: "printer_3_status", type: "string" },
        ]
    },
    {
        key: "STATUS-REPORTER",
        name: "Status Reporter",
        keys: [
            { name: "service_1_status", type: "string" },
            { name: "service_2_status", type: "string" },
            { name: "service_3_status", type: "string" },
            { name: "service_4_status", type: "string" },
            { name: "service_5_status", type: "string" },
        ]
    },
    {
        key: "GATEKEEPER",
        name: "Dopple Access Controller",
        keys: [
            { name: "doors_opened_today", type: "number" },
            { name: "gate_opened_today", type: "number" },
        ]
    }
];

/**
 * Function that holds the code for the publishing of data that runs on a loop.
 */
const loopFunction = async () => {
    console.log(logtime(), "EMULATING_SERVICES")

    // Loop through all the available services
    for (let service of SERVICES) {
        const keys = service.keys;

        // create the MQTT packet template.
        let packet = {
            last_updated: new Date().toLocaleString("nl-NL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                second: "2-digit",
                minute: "2-digit",
                hour12: false
            }),
            service_name: service.name,
            keys: {},
            values: {}
        };

        const PRINTER_STATUS_STRINGS = ["PRINTING", "FREE"]
        const SERVICE_STATUS_STRINGS = ["ONLINE", "OFFLINE", "WARNING"]

        // Loop through all the given keys.
        for (let key of keys) {
            packet.keys[key.name] = key.type;

            // generate random values for each type.
            switch (key.type) {
                case "number":
                    packet.values[key.name] = Math.round(Math.random() * 1000)
                    break;
                case "string":
                    if(key.name.includes("print")) {
                        packet.values[key.name] = PRINTER_STATUS_STRINGS[Math.floor(Math.random() * PRINTER_STATUS_STRINGS.length)];
                    }
                    else if (key.name.includes("service")) {
                        packet.values[key.name] = SERVICE_STATUS_STRINGS[Math.floor(Math.random() * SERVICE_STATUS_STRINGS.length)];
                    }
                    else {
                        packet.values[key.name] = names[Math.floor(Math.random() * names.length)];
                    }
                    
                    break;
                case "list":
                    packet.values[key.name] = [];
                    const listLength = 5;
                    for (let i = 0; i < listLength; i++) {
                        packet.values[key.name].push(i + " " + names[Math.floor(Math.random() * names.length)]);
                    }
                    break;
            }
        }

        // Publish the packet to MQTT with retention.
        await client.publishAsync('tailor/' + service.key + "/dashboard", JSON.stringify(packet), {
            retain: true
        });
    }
}

/**
 * Creates the MQTT client.
 * Change the params as you see fit.
 */
var client = connect(MQTT_URI, {
    clientId: "nhlstenden-students-dashboard-client",
    resubscribe: true,
    clean: true
});

/**
 * MQTT Event -> OnError
 */
client.on('error', (error) => {
    console.log(logtime(), "MQTT_ERROR", error)
})

/**
 * MQTT Event -> OnConnect
 */
client.on('connect', (conn_packet) => {
    console.log(logtime(), "MQTT_CONNECTED")
    mqtt_connected = true;

    // Once connected -> start looper
    loopController()
});

/**
 * MQTT Event -> OnDisconnect
 */
client.on('disconnect', (conn_packet) => {
    console.log(logtime(), "MQTT_DISCONNECTED")
    mqtt_connected = false;
    if (looper_timeout) {
        clearTimeout(looper_timeout);
    }
});

/**
 * Setup the Windows support for using CTRL+C as a way to safely exit the program
 */
if (process.platform === "win32") {
    import("readline").then(readline => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on("SIGINT", function () {
            process.emit("SIGINT");
        });
    });
}

/**
 * Callback from the console when CTRL+C is pressed
 * Will exit the current program safely
 */
process.on('SIGINT', () => {
    if (!requested_stop) {
        console.log(logtime(), "STOPPING_SERVER")
        client.end()
        requested_stop = true;
    }
});

/**
 * Function that maintains the loop
 */
const loopController = () => {
    if (mqtt_connected) {
        loopFunction().catch((err) => {
            console.log(logtime(), "LOOPER_CRASHED", err.message)
        }).finally(() => {
            looper_timeout = setTimeout(loopController, DASHBOARD_FREQUENCY * 1000);
        });
    }
}

/**
 * Function that checks every 100ms if the code should exit.
 */
const exitController = () => {
    if (requested_stop) {
        process.exit(1);
    }
    else {
        setTimeout(exitController, 100);
    }
}

function logtime() {
    return "[" + new Date().toLocaleString("nl-NL", {
        hour: "2-digit",
        second: "2-digit",
        minute: "2-digit",
        hour12: false
    }) + "]>"
}

exitController()
# Smart Home Extension Demo
Here you can find an example of extension utilizing the new 
[MQTT API](./api/README.md). In short the API allows for making topic subscriptions and publishing messages to the **MQTT Broker**. Since MQTT is the most common open protocol in IoT appliances, being able to send and receive MQTT messages allows for easy integration with most of the smart home configurations based on *open platforms* like [Home Assistant](https://www.home-assistant.io), [Homebridge](https://homebridge.io), [Node Red](https://nodered.org) or any other supporting the **MQTT** protocol. 

 Using the [API](./../api/README.md), extensions can declare various smart home entities like *sensors*, *switches*, *commands*, *triggers*, etc. 
 
 Additionaly the example shows how to use the [Home Assistant MQTT Discovery](https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery) mechanism to announce the presense of implemented entities and group them within a one device on the Home Assistant side. Of course the entities can still be used with any other smart home platforms, the announcing part is simply a nod to users of Home Assistant and costs only a single  MQTT message sent to the broker every few minutes. The topic of the announce message starts with `'homeassistant/'` which is subscribed by the Home Assistant with [MQTT Integration](https://www.home-assistant.io/integrations/mqtt). Other platforms will simply not get the message until purposly subscribed to it.

# Structure
The extension implements a [smart home device](./src/scripts/device.js) class along with five types of entities used by it:
* `sensor` ([src](./src/scripts/base/sensor.js)),
* `binary sensor`([src](./src/scripts/base/binary_sensor.js)),
* `command`([src](./src/scripts/base/command.js)),
* `trigger`([src](./src/scripts/base/trigger.js)),
* `switch`([src](./src/scripts/base/sensor.js))

and implements one entity for each of those types:
* Number of tabs `sensor`
* Conference `binary sensor`
* Mute all tabs `switch`
* Open new tab `command`
* Closed tab `trigger`.

Below you can find a description of those parts and an explanation how to develope your own extension based on it.

# How does it work
Once installed or when starting the the browser the extension checks if there's an active MQTT broker connection. If YES - it composes the [discovery message](https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery) and lets each of the components (smart home entities) set up their specific listeners. If there's no active MQTT connection it sets up a listener for changing the MQTT connection state.

The smart home entities represented by derivatives of the [Component](./src/scripts/base/component.js) class depending on their role, set up listeners and/or make appropriate MQTT subscriptions within the `setupListeners` method.

# Types of entities
Currently there are 5 types of entities implemented by base classes that you can find in the [base](./src/scripts/base) folder. For each of them you can find one example of entity based on it.

Below you can find the description of each of the entity types followed with an explanation for how to write your own entity of given type. Each entity has it's unique id that along with the entity type translate to the topis of incoming and outgoing MQTT messages.

Once implemented a new class for a new entity the instance of that class needs to be added to the `#components` table in the constructor of the [Device](./src/scripts/device.js).

## Sensor
The **Sensor** is an entity representing a single read only state (like number of open tabs, color of the theme, amount of free memory etc.) of the Opera Browser. 

The [Device](./src/scripts/device.js) takes the responsibility of publishing the states of the sensors repeatedly every 5 minutes but the sensor itself can also publish it's state when it changes.

### MQTT messages
* Outgoing
  * topic: `sensor/[entity_id]`
  * payload: the value of the sensor

### Example
The example implementation of the **Sensor** is the [Number of tabs sensor](./src/scripts/number_of_tabs_sensor.js). The state represented by it is obviously the number of tabs open in the browser. 

**Example automations**:
* Shift the *hue* of the room lights from blue to red depending on the number of tabs open in the browser.
* Start blinking the room lights if the number of tabs exceeds given number.

### Make your own
In oder to implement a sensor one needs to make a new class derived from the [Sensor](./src/scripts/base/sensor.js) and override 1 method:
* `_getSensorState()`: it should return a value representing the state for which the sensor is implemented.

## Binary sensor
The **Binary sensor** is essentialy a sensor with a boolean value. It represents a single read only state like for example 'active online meeting'.

### MQTT messages
* Outgoing
  * topic: `binary_sensor/[entity_id]`
  * payload: the value of the sensor

### Example
The example implementation of the **Binary sensor** is the [Conference sensor](./src/scripts/conference_sensor.js). It returns *true* if any of the active tabs has an url matching one of the common sites for video-conferencing.

**Possible automations**:
* Set the shades in position 50% to reduce the reflections on the screen.
* Stop the music

### Make your own
In oder to implement a binary sensor one needs to make a new class derived from the [BinarySensor](./src/scripts/base/binary_sensor.js) and override one method:
* `_getSensorState()`: it should return a `true` or `false` depending on the current state.

## Command
The **Command** is an entity similar to a button. When activated it performs an action assigned to it.

### MQTT messages
* Incoming
  * topic: `command/[entity_id]`
  * payload: not needed

### Example
The example implementation of the **Command** is the [Open new tab](./src/scripts/open_new_tab_command.js). Once activated it simply opens a new tab in the current window.

### Make your own
In oder to implement the Command one needs to make a new class derived from the [Command](./src/scripts/base/command.js) and override 1 method:
* `_onCommandReceived()`: the method is called when the extension gets 

## Switch
The **Switch** can be though of as an on/off toggle. It represents a single boolean state that can be changed internally within the browser or externally by the smart home.

### MQTT messages
* Incoming
  * topic: `switch/set/[entity_id]`
  * payload: `ON` or `OFF`
* Outgoing
  * topic: `switch/[entity_id]`
  * payload: `ON` or `OFF`

### Example
The example implementation of the **Switch** is the [Mute all tabs](./src/scripts/mute_all_tabs_switch.js). When switched ON it mutes all the currently open and new tabs. Switching it OFF unmutes the tabs that were muted by the extension (tab muted by the user stay muted). 

**Example automations**:
* Mute the tabs if the door sensor reports the door was open

### Make your own
In oder to implement a switch one needs to make a new class derived from the [Switch](./src/scripts/base/switch.js) and override two methods:
* `_onStateUpdatedRemotely()`: called after `this._enabled` is changed on remote request
* `_assureStateDefined()`: called by `super` class before publishing the state, it should make sure `this._enabled` has assigned `true` or `false` value

## Trigger
The **Trigger** is an entity that represents an event that happened within the browser, like *opened new tab*, *closed a tab* etc. Allows the smart home to react on browser events.

### MQTT messages
* Outgoing
  * topic: `trigger/[entity_id]`
  * payload: not needed

### Example
The example implementation of the **Trigger** is the [Closed tab](./src/scripts/closed_tab_trigger.js). Once a tab is closed the event if fired and the outgoing MQTT message is sent.

**Example automations**:
* Blink lights when the tab is closed

### Make your own
In oder to implement the Trigger one needs to make a new class derived from the [Trigger](./src/scripts/base/trigger.js) call the `_fireTrigger()` when the event happens.

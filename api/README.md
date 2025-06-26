# MQTT API in Opera GX
In version 119.0.5497.163 **Opera GX** has introduced **MQTT extension API** that allows for publishing and subscribing to MQTT messages. The formal definition of the API can be found in the **mqtt.idl** file in this directory.

## Permissions
To use the **opr.mqtt API**, declare the "mqtt" permission in the manifest:
```
{
  "name": "My extension",
  ...
  "permissions": [
    "mqtt"
  ],
  ...
}
```
## Usage and concept of the 'global' parameter
**opr.mqtt API** is intended for publishing messages to the MQTT broker and subscribing to messages with specific topics in order to integrate the Opera browser with a smart home. 

The API doesn't allow to change the MQTT broker that Opera is connected to nor to change the status of the connection - those can be configured only by the user in the browser settings.

The API however allows to check the state of the connection at any time.

Since at home there may be many computers with Opera connected to the same MQTT broker at the same time, the API adds an instance specific **prefix** to all the topics of messages sent or subscribed to. That helps differentating the instances within the network even if they have the same extensions installed. 

That behaviour can be disabled by passing the **global** parameter with value **true**, which applies to both sending and subscribing to topics.

The prefixed topic is constructed in the following way:
```
'opera/' + prefix_defined_in_browser_settings + '/' + topic_passed_in_the_api
```

### Example
When calling the API to send a message with a topic:
```
topic_1
```
the actual topic of the message that will be sent by the API to the MQTT broker will be:
```
opera/prefix_defined_in_the_settings/topic_1
```

## Data Types

* **`Subscription`**: Represents a subscription to an MQTT topic.
    * `topic` (DOMString): The topic to subscribe to.
    * `global` (boolean): If true, the prefix won't be added
* **`PublishMessageResult`**: Enum representing the result of a publish operation.
    * `Sent`: Message sent successfully.
    * `NotSentNotConnected`: Message not sent due to a disconnected state.
    * `NotSentIncorrectTopic`: Message not sent due to an invalid topic.
    * `NotSentOtherError`: Message not sent due to another error.
* **`ConnectionState`**: Enum representing the connection state:
    * `Disconnected`
    * `Connecting`
    * `Connected`
    * `Reconnecting`

## Callbacks

* **`VoidCallback`**: A callback function with no arguments.
* **`PublishMessageResultCallback`**: A callback function taking a `PublishMessageResult` value.
* **`StringCallback`**: A callback function taking a `DOMString` value.
* **`ConnectionStateCallback`**: A callback function taking a `ConnectionState` value.

## Functions

* **`publishMessage(topic, payload, global, callback)`**: Publishes a message to an MQTT topic.
    * `topic` (DOMString): The topic to publish to.
    * `payload` (DOMString): The message payload.
    * `global` (boolean, optional): If true, uses the `topic` value directly; otherwise, prepends `opera/{user_defined_prefix}/`.
    * `callback` (`PublishMessageResultCallback`): Callback receiving the publish result.
* **`subscribe(topic, global, callback)`**: Subscribes to an MQTT topic. Subscribing to topics with wildcards is not allowed and will result with `NotSentIncorrectTopic` error.
    * `topic` (DOMString): The topic to subscribe to.
    * `global` (boolean, optional): If true, uses the `topic` value directly; otherwise, prepends `opera/{user_defined_prefix}/`.
    * `callback` (`VoidCallback`): Callback executed upon successful subscription.
* **`getConnectionState(callback)`**: Gets the current connection state.
    * `callback` (`ConnectionStateCallback`): Callback receiving the connection state.
* **`getTopicPrefix(callback)`**: Gets the user-defined topic prefix.
    * `callback` (`StringCallback`): Callback receiving the topic prefix.

All functions support **Promises**.
## Events

* **`onMessageReceived(subscription, payload)`**: Fired when a message is received.
    * `subscription` (`Subscription`): The subscription for which given message is received. One extension will not receive this event for subscriptions created by another extension.
    * `payload` (DOMString): The message payload.
* **`onConnectionStateChanged(connectionState)`**: Fired when the state of connection to the MQTT broker changes.
    * `connectionState` (`ConnectionState`): The new connection state.


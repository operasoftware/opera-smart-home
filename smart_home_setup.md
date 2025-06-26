# New Smart Home Setup
If you don't have a smart home yet, or you're using a platform that doesn't support **MQTT** protocol, you can easily install one of the popular platforms like [Home Assistant](https://www.home-assistant.io), [Homebridge](https://homebridge.io) or [Node Red](https://nodered.org) on your PC or Raspberry Pi.

## Home Assistant
Home Assistant is a very pupular open-source home automation platform that lets you monitor and control your smart home devices from a central dashboard. It's very versatile, supporting a huge range of devices and offering extensive customization options. You can automate tasks, create scenes, and integrate various smart home ecosystems, all from one convenient interface.

In case you want to start using Home Assistant you have a variety options to choose from.

### Home Assistant Green
One of the options is to buy the [Home Assistant Green](https://www.home-assistant.io/green). While it's not the cheapest option it's definitely the easiest one. You just plug it in, install the [MQTT Integration](https://www.home-assistant.io/integrations/mqtt/) and you're ready to add Opera to your smart home in minutes.

### Running Home Assistant on PC
[Home Assistant](https://www.home-assistant.io) can be easily installed on your PC or Raspberyy PI. Our experience show that the easiest way of doing that is using the [docker-compose](https://docs.docker.com/compose/). 

You can do that with only few steps:
1. Install [Docker Compose](https://docs.docker.com/compose/install/)
2. Create a `docker-compose.yml` file with the following content:
```
services:
  homeassistant:
    container_name: home-assistant
    image: "ghcr.io/home-assistant/home-assistant:stable"
    volumes:
      - ./ha/ha_config:/config
    restart: unless-stopped
    ports:
      - 8123:8123
    networks:
      - shared_network
    depends_on: 
      - mosquitto
  mosquitto:
    container_name: mosquitto
    image: eclipse-mosquitto:latest
    volumes:
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/etc:/etc/mosquitto
    restart: always
    ports:
      - 1883:1883
    networks:
      - shared_network

networks:
  shared_network:
    driver: bridge
```
3. Open a terminal 
4. Change directory to the one containing the `docker-compose.yml'
5. Enter command: `docker-compose up -d`
6. Your **Home Assistant** should be ready to be configured on http://localhost:8123 and your **MQTT Broker** should be running on tcp://localhost:1883 (no credentials unless you configure it)

## Homebridge
If you are using **Apple** devices with the native **Home** app, a convenient option for you may be to install the [Homebridge](https://homebridge.io) platform. Homebridge is a lightweight Node.js server that allows you to add **HomeKit** support to your non-HomeKit smart home devices. It acts as a bridge, enabling devices that aren't officially compatible with Apple's HomeKit to be controlled through the Home app on iOS devices. Through various community-created plugins, it also offers robust support for MQTT. This allows you to integrate a wide array of MQTT-enabled devices - including **Opera Smart Home**'s toggles, sensors, buttons - into your HomeKit setup.

[Here](https://homebridge.io/how-to-install-homebridge) you can find a good description on how to install Homebridge on your PC or Raspberry Pi.

## Node Red
Yes another option is the [Node Red](https://nodered.org). Node-RED, with its visual programming interface, simplifies the process of integrating smart home devices that use the MQTT protocol. By using readily available MQTT nodes, you can easily connect to and control these devices, including Opera. This allows you to build custom automations and workflows based on data received from your MQTT-enabled devices. Essentially, Node-RED acts as a powerful intermediary, enabling seamless communication between your MQTT devices and other parts of your smart home system.

[Here](https://nodered.org/docs/getting-started/local) you can find a good description on how to install Node Red on your PC or Raspberry Pi.
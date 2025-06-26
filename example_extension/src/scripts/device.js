/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import NumberOfTabsSensor from './number_of_tabs_sensor.js';
import MuteAllTabsSwitch from './mute_all_tabs_switch.js';
import OpenNewTabCommand from './open_new_tab_command.js';
import ClosedTabTrigger from './closed_tab_trigger.js';
import ConferenceSensor from './conference_sensor.js';

export default class HADevice {
  #components;

  constructor() {
    this.#components = [
      new OpenNewTabCommand(),
      new MuteAllTabsSwitch(),
      new NumberOfTabsSensor(),
      new ConferenceSensor(),
      new ClosedTabTrigger(),
    ];
    this.setupComponentsListeners();
  }

  async sendMqttDiscovery() {
    let prefix = await opr.mqtt.getTopicPrefix();

    let deviceId = (await chrome.storage.local.get(['device_id'])).device_id;
    if (!deviceId) {
      deviceId = prefix;
      chrome.storage.local.set({device_id: deviceId});
    }

    let topic = `homeassistant/device/${deviceId}config`;
    let discoveryConfig = {
      dev: {
        ids: deviceId,
        name: 'Opera example device',
        mf: 'Opera Software'
      },
      o: {
        name: 'Opera Browser'
      },
      cmps: {},
    };

    for (const component of this.#components) {
      discoveryConfig.cmps[component.getId()] = component.getDiscoveryComponent(
        deviceId,
        prefix,
      );
    }

    let payload = JSON.stringify(discoveryConfig);
    opr.mqtt.publishMessage(topic, payload, true);
  }

  setupComponentsListeners() {
    for (const component of this.#components) {
      component.setupListeners();
    }
  }

  publishComponentsStates() {
    for (const component of this.#components) {
      component.publishState();
    }
  }

  async sendDiscoveryAndPublishStates() {
    const sleep = async millis =>
      new Promise(resolve => setTimeout(resolve, millis));
    await this.sendMqttDiscovery();
    await sleep(5000);
    this.publishComponentsStates();
  }
}

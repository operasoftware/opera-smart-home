/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Component from './component.js';

export default class BinarySensor extends Component {
  #name;
  #stateTopic;

  constructor(id, name) {
    super(id);
    this.#name = name;
    this.#stateTopic = `binary_sensor/${id}`;
    this._deviceClass = undefined;
  }

  getDiscoveryComponent(deviceId, topicPrefix) {
    return {
      p: 'binary_sensor',
      state_topic: `${topicPrefix}${this.#stateTopic}`,
      name: this.#name,
      unique_id: `${deviceId}${this.#stateTopic}`,
      ...(this._deviceClass !== undefined && {
        device_class: this._deviceClass,
      }),
    };
  }

  async publishState() {
    opr.mqtt.publishMessage(
      this.#stateTopic,
      (await this._getSensorState()) ? 'ON' : 'OFF',
    );
  }

  async _getSensorState() {
    return null;
  }
}

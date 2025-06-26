/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Component from './component.js';

export default class Sensor extends Component {
  #name;
  #stateTopic;

  constructor(id, name) {
    super(id);
    this.#name = name;
    this.#stateTopic = `sensor/${id}`;
    this._deviceClass = undefined;
    this._unitOfMeasurement = undefined;
  }

  getDiscoveryComponent(deviceId, topicPrefix) {
    return {
      p: 'sensor',
      state_topic: `${topicPrefix}${this.#stateTopic}`,
      name: this.#name,
      unique_id: `${deviceId}${this.#stateTopic}`,
      ...(this._deviceClass !== undefined && {
        device_class: this._deviceClass,
      }),
      ...(this._unitOfMeasurement !== undefined && {
        unit_of_measurement: this._unitOfMeasurement,
      }),
    };
  }

  async publishState() {
    const state = await this._getSensorState();
    if (state) opr.mqtt.publishMessage(this.#stateTopic, state);
  }

  async _getSensorState() {
    return null;
  }
}

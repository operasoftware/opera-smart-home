/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Component from './component.js';

export default class Switch extends Component {
  #name;
  #stateTopic;
  #commandTopic;

  constructor(id, name) {
    super(id);
    this.#name = name;
    this.#stateTopic = `switch/${id}`;
    this.#commandTopic = `switch/${id}/set`;
  }

  getDiscoveryComponent(deviceId, topicPrefix) {
    return {
      p: 'switch',
      state_topic: `${topicPrefix}${this.#stateTopic}`,
      command_topic: `${topicPrefix}${this.#commandTopic}`,
      name: this.#name,
      unique_id: `${deviceId}${this.#stateTopic}`,
    };
  }

  setupListeners() {
    opr.mqtt.subscribe(this.#commandTopic);
    opr.mqtt.onMessageReceived.addListener((subscription, payload) => {
      if (!subscription.global && subscription.topic === this.#commandTopic) {
        this._enabled = payload === 'ON';
        this._onStateUpdatedRemotely();
        this.publishState();
      }
    });
  }

  async publishState() {
    await this._assureStateDefined();
    opr.mqtt.publishMessage(this.#stateTopic, this._enabled ? 'ON' : 'OFF');
  }

  _onStateUpdatedRemotely() {}

  async _assureStateDefined() {}
}

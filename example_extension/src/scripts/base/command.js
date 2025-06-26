/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Component from './component.js';

export default class Command extends Component {
  #name;
  #commandTopic;

  constructor(id, name) {
    super(id);
    this.#name = name;
    this.#commandTopic = `command/${id}`;
  }

  getDiscoveryComponent(deviceId, topicPrefix) {
    return {
      p: 'button',
      command_topic: `${topicPrefix}${this.#commandTopic}`,
      name: this.#name,
      unique_id: `${deviceId}${this.#commandTopic}`,
    };
  }

  setupListeners() {
    opr.mqtt.subscribe(this.#commandTopic);
    opr.mqtt.onMessageReceived.addListener(subscription => {
      if (!subscription.global && subscription.topic === this.#commandTopic) {
        this._onCommandReceived();
      }
    });
  }

  _onCommandReceived() {}
}

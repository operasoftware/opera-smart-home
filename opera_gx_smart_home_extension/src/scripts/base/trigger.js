/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Component from './component.js';

export default class Trigger extends Component {
  #name;
  #triggerTopic;

  constructor(id, name) {
    super(id);
    this.#name = name;
    this.#triggerTopic = `trigger/${id}`;
  }

  getDiscoveryComponent(deviceId, topicPrefix) {
    return {
      p: 'device_automation',
      automation_type: 'trigger',
      topic: `${topicPrefix}${this.#triggerTopic}`,
      type: 'action',
      subtype: this.#name,
      unique_id: `${deviceId}${this.#triggerTopic}`,
    };
  }

  _fireTrigger() {
    opr.mqtt.publishMessage(this.#triggerTopic, '');
  }
}

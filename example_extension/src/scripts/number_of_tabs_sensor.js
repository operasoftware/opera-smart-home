/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Sensor from './base/sensor.js';

export default class NumberOfTabsSensor extends Sensor {
  constructor() {
    super('number_of_tabs', 'Number of tabs');
  }

  setupListeners() {
    chrome.tabs.onCreated.addListener(() => {
      this.publishState();
    });

    chrome.tabs.onRemoved.addListener(() => {
      this.publishState();
    });
  }

  async _getSensorState() {
    return (await chrome.tabs.query({})).length.toString();
  }
}

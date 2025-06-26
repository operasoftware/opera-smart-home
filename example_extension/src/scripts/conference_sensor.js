/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import BinarySensor from './base/binary_sensor.js';

export default class ConferenceSensor extends BinarySensor {
  constructor() {
    super('conference', 'Ongoing conference');

    this.teleconferenceUrls = [
      'https://zoom.us/j/.*', // Zoom
      'https://meet.google.com/.*', // Google Meet
      'https://teams.microsoft.com/.*', // Microsoft Teams
      // Add more URLs as needed
    ];
  }

  _isConference(url) {
    for (const regex of this.teleconferenceUrls) {
      const r = new RegExp(regex);
      if (r.test(url)) return true;
    }
    return false;
  }

  setupListeners() {
    chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
      if (changeInfo.status === 'complete') {
        this.publishState();
      }
    });
    chrome.tabs.onCreated.addListener(() => {
      this.publishState();
    });
    chrome.tabs.onRemoved.addListener(() => {
      this.publishState();
    });
  }

  async _getSensorState() {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (this._isConference(tab.url)) {
        return true;
      }
    }
    return false;
  }
}

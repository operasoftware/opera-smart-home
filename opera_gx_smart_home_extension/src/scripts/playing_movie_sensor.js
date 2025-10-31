/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import BinarySensor from './base/binary_sensor.js';

export default class PlayingMovieSensor extends BinarySensor {
  constructor() {
    super('playing_movie', 'Playing movie');

    this.movieUrls = [
      /https?:\/\/(www\.)?netflix\.com\/watch\/\d+/, // Netflix
      /https?:\/\/(www\.)?hulu\.com\/watch\/\d+/, // Hulu
      /https?:\/\/(www\.)?amazon\.com\/gp\/video\/detail\/\w+/, // Amazon Prime
      /https?:\/\/(www\.)?disneyplus\.com\/watch\/\w+/, // Disney+
      /https?:\/\/(www\.)?play\.max\.com\/video\/watch\/.*/, // Max
    ];
  }

  _isPlayingMovie(url) {
    for (const regex of this.movieUrls) {
      if (regex.test(url)) return true;
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
      if (this._isPlayingMovie(tab.url)) {
        return true;
      }
    }
    return false;
  }
}

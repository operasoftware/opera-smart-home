/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Sensor from './base/sensor.js';

const GB = 1024 * 1024 * 1024;

export default class RamSensor extends Sensor {
  constructor() {
    super('ram', 'RAM available');
    this._deviceClass = 'data_size';
    this._unitOfMeasurement = 'GB';
  }

  setupListeners() {
    const alarmName = 'ram-update';
    chrome.alarms.get(alarmName, alarm => {
      if (!alarm) {
        chrome.alarms.create(alarmName, {
          delayInMinutes: 1,
          periodInMinutes: 1,
        });
      }
    });
    chrome.alarms.onAlarm.addListener(alarm => {
      if (alarm.name === alarmName) {
        this.publishState();
      }
    });
  }

  async _getSensorState() {
    const {metrics} = await opr.liveWallpaperMetricsPrivate.getMetrics({
      metrics: ['RAM'],
    });
    if (!metrics) {
      return null;
    }
    const bytes = metrics[0]?.value[0]?.available_bytes || 0;
    return (bytes / GB).toFixed(2);
  }
}

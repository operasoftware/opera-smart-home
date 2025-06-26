/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Sensor from './base/sensor.js';

export default class BatterySensor extends Sensor {
  constructor() {
    super('battery', 'Battery level');
    this._deviceClass = 'battery';
    this._unitOfMeasurement = '%';
  }

  setupListeners() {
    const alarmName = 'battery-update';
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
      metrics: ['BATTERY'],
    });
    return metrics
      ? metrics[0]?.value[0]?.remaining_charge_pct.toString()
      : undefined;
  }
}

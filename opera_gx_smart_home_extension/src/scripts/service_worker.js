/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Device from './device.js';

const device = new Device();

async function setupAlarm() {
  const alarmName = 'ha-update';
  const alarm = await chrome.alarms.get(alarmName);

  if (!alarm) {
    chrome.alarms.create(alarmName, {delayInMinutes: 5, periodInMinutes: 5});
  }

  chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === alarmName) {
      sendDiscoveryAndPublishStatesIfConnected();
    }
  });
}

setupAlarm();

async function sendDiscoveryAndPublishStatesIfConnected() {
  if ((await opr.mqtt.getConnectionState()) === 'Connected') {
    device.sendDiscoveryAndPublishStates();
  }
}

chrome.runtime.onStartup.addListener(() => {
  sendDiscoveryAndPublishStatesIfConnected();
});

chrome.runtime.onInstalled.addListener(() => {
  sendDiscoveryAndPublishStatesIfConnected();
});

opr.mqtt.onConnectionStateChanged.addListener(state => {
  if (state === 'Connected') {
    device.sendDiscoveryAndPublishStates();
  }
});

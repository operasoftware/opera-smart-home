/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import AccentColorSensor from './accent_color_sensor.js';
import BatterySensor from './battery_sensor.js';
import NumberOfTabsSensor from './number_of_tabs_sensor.js';
import ConferenceSensor from './conference_sensor.js';
import PlayingMovieSensor from './playing_movie_sensor.js';
import RamSensor from './ram_sensor.js';
import MuteAllTabsSwitch from './mute_all_tabs_switch.js';
import PanicModeSwitch from './panic_mode_switch.js';
import PrefSwitch from './pref_switch.js';
import CloseCurrentTabCommand from './close_current_tab_command.js';
import ClosePrivateWindowsCommand from './close_private_windows_command.js';
import OpenNewTabCommand from './open_new_tab_command.js';
import ClosedTabTrigger from './closed_tab_trigger.js';
import NewTabTrigger from './new_tab_trigger.js';

export default class HADevice {
  #components;

  constructor() {
    this.#components = [
      new OpenNewTabCommand(),
      new CloseCurrentTabCommand(),
      new ClosePrivateWindowsCommand(),
      new MuteAllTabsSwitch(),
      new PanicModeSwitch(),
      new PrefSwitch('music', 'Background music', 'gx.play_background_music'),
      new PrefSwitch('browser_sounds', 'Browser sounds', 'gx.play_sounds'),
      new PrefSwitch(
        'keyboard_sounds',
        'Keyboard sounds',
        'gx.sounds_in_addressbar',
      ),
      new AccentColorSensor(),
      new NumberOfTabsSensor(),
      new RamSensor(),
      new ConferenceSensor(),
      new PlayingMovieSensor(),
      new BatterySensor(),
      new NewTabTrigger(),
      new ClosedTabTrigger(),
    ];
    this.setupComponentsListeners();
  }

  async sendMqttDiscovery() {
    let prefix = await opr.mqtt.getTopicPrefix();

    let deviceId = (await chrome.storage.local.get(['device_id'])).device_id;
    if (!deviceId) {
      deviceId = prefix;
      chrome.storage.local.set({device_id: deviceId});
    }

    let topic = `homeassistant/device/${deviceId}config`;
    let discoveryConfig = {
      dev: {
        ids: deviceId,
        name: 'Opera GX',
        mf: 'Opera Software',
      },
      o: {
        name: 'Opera Browser',
        url: 'https://operagx.gg/smart-home-usage',
      },
      cmps: {},
    };

    for (const component of this.#components) {
      discoveryConfig.cmps[component.getId()] = component.getDiscoveryComponent(
        deviceId,
        prefix,
      );
    }

    let payload = JSON.stringify(discoveryConfig);
    opr.mqtt.publishMessage(topic, payload, true);
  }

  setupComponentsListeners() {
    for (const component of this.#components) {
      component.setupListeners();
    }
  }

  publishComponentsStates() {
    for (const component of this.#components) {
      component.publishState();
    }
  }

  async sendDiscoveryAndPublishStates() {
    const sleep = async millis =>
      new Promise(resolve => setTimeout(resolve, millis));
    await this.sendMqttDiscovery();
    await sleep(5000);
    this.publishComponentsStates();
  }
}

/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Switch from './base/switch.js';

export default class PrefSwitch extends Switch {
  #key;

  constructor(id, name, key) {
    super(id, name);
    this.#key = key;
  }

  setupListeners() {
    super.setupListeners();
    chrome.settingsPrivate.onPrefsChanged.addListener(prefs => {
      for (const pref of prefs) {
        if (pref.key == this.#key) {
          this._enabled = pref.value;
          this.publishState();
        }
      }
    });
  }

  _onStateUpdatedRemotely() {
    chrome.settingsPrivate.setPref(this.#key, this._enabled);
  }

  async _assureStateDefined() {
    if (this._enabled !== undefined) return;
    this._enabled = (await chrome.settingsPrivate.getPref(this.#key)).value;
  }
}

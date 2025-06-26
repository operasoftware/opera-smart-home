/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Switch from './base/switch.js';

export default class MuteAllTabsSwitch extends Switch {
  constructor() {
    super('mute_all_tabs', 'Mute all tabs');
  }

  setupListeners() {
    super.setupListeners();
    chrome.tabs.onCreated.addListener(tab => {
      this._assureStateDefined().then(() => {
        if (this._enabled) {
          chrome.tabs.update(tab.id, {muted: true});
        }
      });
    });
  }

  _onStateUpdatedRemotely() {
    this._saveState();
    chrome.tabs.query({}, tabs => {
      for (const tab of tabs) {
        if (
          !tab.mutedInfo.muted ||
          (tab.mutedInfo.muted && tab.mutedInfo.reason === 'extension')
        ) {
          chrome.tabs.update(tab.id, {muted: this._enabled});
        }
      }
    });
  }

  _saveState() {
    chrome.storage.session.set({tabs_muted: this._enabled});
  }

  async _assureStateDefined() {
    if (this._enabled !== undefined) return;
    const {tabs_muted} = await chrome.storage.session.get(['tabs_muted']);
    this._enabled = tabs_muted != undefined ? tabs_muted : false;
  }
}

/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Switch from './base/switch.js';

export default class PanicModeSwitch extends Switch {
  constructor() {
    super('panic_mode', 'Panic mode');
  }

  setupListeners() {
    super.setupListeners();
    opr.panicButtonPrivate.onPanicButtonEnabled.addListener(() => {
      this._enabled = true;
      this.publishState();
    });
    opr.panicButtonPrivate.onPanicButtonDisabled.addListener(() => {
      this._enabled = false;
      this.publishState();
    });
  }

  _onStateUpdatedRemotely() {
    opr.panicButtonPrivate.isEnabled(enabled => {
      if (enabled !== this._enabled) {
        opr.panicButtonPrivate.toggle();
      }
    });
  }

  async _assureStateDefined() {
    this._enabled = await opr.panicButtonPrivate.isEnabled();
  }
}

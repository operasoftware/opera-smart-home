/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Trigger from './base/trigger.js';

export default class NewTabTrigger extends Trigger {
  constructor() {
    super('new_tab', 'New tab opened');
  }

  setupListeners() {
    chrome.tabs.onCreated.addListener(() => {
      this._fireTrigger();
    });
  }
}

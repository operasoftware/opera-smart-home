/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Trigger from './base/trigger.js';

export default class ClosedTabTrigger extends Trigger {
  constructor() {
    super('closed_tab', 'Closed a tab');
  }

  setupListeners() {
    chrome.tabs.onRemoved.addListener(() => {
      this._fireTrigger();
    });
  }
}

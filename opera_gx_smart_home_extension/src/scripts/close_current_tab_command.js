/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Command from './base/command.js';

export default class CloseCurrentTabCommand extends Command {
  constructor() {
    super('close_current_tab', 'Close current tab');
  }

  _onCommandReceived() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      if (tabs.length > 0) {
        chrome.tabs.remove(tabs[0].id);
      }
    });
  }
}

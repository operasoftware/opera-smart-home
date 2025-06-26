/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Command from './base/command.js';

export default class ClosePrivateWindowsCommand extends Command {
  constructor() {
    super('close_private_windows', 'Close private windows');
  }

  _onCommandReceived() {
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(function(tab) {
          if (tab.incognito) { // Check if the tab is incognito
              chrome.tabs.remove(tab.id); // Close the incognito tab
          }
      });
    });
  }
}

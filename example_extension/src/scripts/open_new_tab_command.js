/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Command from './base/command.js';

export default class OpenNewTabCommand extends Command {
  constructor() {
    super('open_new_tab', 'Open new tab');
  }

  _onCommandReceived() {
    chrome.tabs.create({});
  }
}

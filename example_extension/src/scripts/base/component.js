/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

export default class Component {
  #id;

  constructor(id) {
    this.#id = id;
  }

  getId() {
    return this.#id;
  }

  getDiscoveryComponent(_deviceId, _topicPrefix) {
    return {};
  }

  setupListeners() {}

  async publishState() {}
}

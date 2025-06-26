/*
 * Copyright © 2025 Opera Norway AS. All rights reserved.
 *
 * This file is an original work developed by Opera.
 */

import Sensor from './base/sensor.js';

export default class AccentColorSensor extends Sensor {
  constructor() {
    super('accent_color', 'Accent color');
  }

  setupListeners() {
    opr.palette.onPaletteChanged.addListener(() => {
      this.publishState();
    });
  }

  async _getSensorState() {
    const color = await opr.palette.getColor('gx_accent');
    const hex = num => num.toString(16).toUpperCase().padStart(2, '0');
    return `#${hex(color.r)}${hex(color.g)}${hex(color.b)}`;
  }
}

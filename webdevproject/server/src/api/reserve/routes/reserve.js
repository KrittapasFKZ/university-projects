'use strict';

/**
 * reserve router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::reserve.reserve');

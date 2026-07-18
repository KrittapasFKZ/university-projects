'use strict';

/**
 * reserve controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::reserve.reserve', ({ strapi }) => ({

    async method_confirm(ctx) {
        const entityId = ctx.params.id;
        try {

            let item = await strapi.entityService.findOne("api::reserve.reserve", entityId, {
                populate: '*',
            });

            let current_time = new Date()

            if (ctx.state.user.role.name != "admin") {
                item = await strapi.entityService.update("api::reserve.reserve", entityId, {
                    data: {
                        payment_status: true,
                        confirm_date: current_time
                    }
                })
                ctx.body = {
                    status: "OK",
                    message: "Action Completed!"
                };

            }
            else {
                ctx.body = {
                    status: "Denied",
                    message: "No Permission."
                };
            };

        } catch (err) {
            ctx.body = {
                status: "Failed",
                message: err
            };
        }

    },
    async method_cancel(ctx) {
        const entityId = ctx.params.id;
        try {

            let item = await strapi.entityService.findOne("api::reserve.reserve", entityId, {
                populate: '*',
            });

            if (ctx.state.user.role.name != "admin") {
                item = await strapi.entityService.update("api::reserve.reserve", entityId, {
                    data: {
                        payment_status: false,
                        confirm_date: null
                    }
                })
                ctx.body = {
                    status: "OK",
                    message: "Action Completed!"
                };

            }
            else {
                ctx.body = {
                    status: "Denied",
                    message: "No Permission."
                };
            };

        } catch (err) {
            ctx.body = {
                status: "Failed",
                message: err
            };
        }

    },

})
);

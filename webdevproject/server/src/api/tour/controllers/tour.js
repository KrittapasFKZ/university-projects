'use strict';

/**
 * tour controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tour.tour', ({ strapi }) => ({

    async method_refresh(ctx) {
        const entityId = ctx.params.id;
        try {
            let target_Tour = await strapi.entityService.findOne('api::tour.tour', entityId)

            if (target_Tour.user_amount >= target_Tour.user_max) {
                target_Tour = await strapi.entityService.update('api::tour.tour', entityId, {
                    data: {
                        status: false
                    }
                })
            } else {
                target_Tour = await strapi.entityService.update('api::tour.tour', entityId, {
                    data: {
                        status: true
                    }
                })
            }

            ctx.body = {
                status: "OK",
                message: "Action Completed!",

            };
        } catch (err) {
            ctx.body = {
                status: "Failed",
                message: err
            };
        }
    },

    async method_complete(ctx) {
        const entityId = ctx.params.id;
        const { numberOfPeople } = ctx.request.body;
        try {
            let target_Tour = await strapi.entityService.findOne('api::tour.tour', entityId)

            if ((target_Tour.user_amount + numberOfPeople) >= target_Tour.user_max) {
                target_Tour = await strapi.entityService.update('api::tour.tour', entityId, {
                    data: {
                        user_amount: (target_Tour.user_amount || 0) + numberOfPeople,
                        status: false
                    }
                })
            } else {
                target_Tour = await strapi.entityService.update('api::tour.tour', entityId, {
                    data: {
                        user_amount: (target_Tour.user_amount || 0) + numberOfPeople,
                    }
                })
            }

            ctx.body = {
                status: "OK",
                message: "Action Completed!",

            };
        } catch (err) {
            ctx.body = {
                status: "Failed",
                message: err
            };
        }
    },
    async method_delete(ctx) {
        const entityId = ctx.params.id;
        const { numberOfPeople } = ctx.request.body;
        try {
            let target_Tour = await strapi.entityService.findOne('api::tour.tour', entityId)
                target_Tour = await strapi.entityService.update('api::tour.tour', entityId, {
                    data: {
                        user_amount: (target_Tour.user_amount || 0) - numberOfPeople,
                    }});
                
            

            ctx.body = {
                status: "OK",
                message: "Action Completed!",

            };
        } catch (err) {
            ctx.body = {
                status: "Failed",
                message: err
            };
        }
    },

    async deleteRelation(ctx) {
        const entityId = ctx.params.id;
        const event = await strapi.entityService.findOne('api::tour.tour', entityId);

        if (!event) {
            return ctx.notFound(`Not Found`);
        }
        
        ctx.body = { Stats: `Deleting ${entityId}` }
        const entries = await strapi.entityService.findMany('api::reserve.reserve', {
            populate: '*',
            filters: {
                tour_id: {
                    id: {
                        $eq: entityId,
                    },
                },

            }
        });
    
        for (let i of entries) {
            const entry = await strapi.entityService.delete('api::reserve.reserve', i.id);
        }
        const entry = await strapi.entityService.delete('api::tour.tour', entityId);
    },

}));

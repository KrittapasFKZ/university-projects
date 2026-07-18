'use strict';

module.exports = {
    routes: [ 

        {
            method: 'POST',
            path: '/reserve/:id/method_confirm',
            handler: 'reserve.method_confirm'
        },
        {
            method: 'POST',
            path: '/reserve/:id/method_cancel',
            handler: 'reserve.method_cancel'
        },


        

    ]
}

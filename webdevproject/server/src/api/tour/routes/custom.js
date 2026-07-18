'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/tours/:id/complete',
      handler: 'tour.method_complete'
    },
    {
      method: 'PUT',
      path: '/tours/:id/refresh',
      handler: 'tour.method_refresh'
    },
    {
      method: 'DELETE',
      path: '/tours/:id/remove',
      handler: 'tour.deleteRelation'
  },
  {
    method: 'PUT',
    path: '/tours/:id/less',
    handler: 'tour.method_delete'
  },
  ]
}
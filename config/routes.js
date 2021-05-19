/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': { view: 'pages/homepage' },
  // signup api
  'POST /signup': { action: 'auth/signup' },
  // login via google
  'POST /login/google': { action: 'auth/sso-login' },
  // login api
  'POST /login': { action: 'auth/login' },
  // logout api
  'POST /logout': { action: 'auth/logout' },
  'GET /blog/:id': 'BlogController.getBlogDetails',
  'GET /blog/:id/comments': 'CommentController.getComments',
  'POST /blog/:id/comment': 'CommentController.postComment',
  'GET /author/:id': 'UserController.authorDetails',
  '/blogs': 'BlogController.getBlogList',
  'GET /blog/:id/like': 'LikeController.getTotalLikesForBlog',
  'GET /blog/:id/like/user/:userId': 'LikeController.getUserLikes',
  'PATCH /blog/:id/like/user/:userId': 'LikeController.putLikes'
  /*************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};

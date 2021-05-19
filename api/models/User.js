/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const updateNameToLowerCase = (valuesToSet, proceed) => {
  valuesToSet.name = valuesToSet.name.toLowerCase();
  return proceed();
};
module.exports = {
  attributes: {
    name: { type: 'string', required: true },
    passwordHash: { type: 'string', required: true },
    email: { type: 'string', unique: true, required: true },
    salt: { type: 'string' },
    sessions: {
      collection: 'session',
      via: 'user'
    },
    blogs: {
      collection: 'blog',
      via: 'authorId'
    },
    profile: {
      model: 'profile'
    },
    like: {
      collection: 'like',
      via: 'userId'
    }

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  },
  beforeCreate: updateNameToLowerCase,
  beforeUpdate: updateNameToLowerCase
};

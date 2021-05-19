/**
 * Blog.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const updateTitleToLowerCase = (valuesToSet, proceed) => {
  valuesToSet.title = valuesToSet.title?.toLowerCase();
  return proceed();
};
module.exports = {
  attributes: {
    content: { type: 'string', required: true },
    title: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    image: { type: 'string', required: true },
    publishedDate: { type: 'number', required: true },
    likeCount: { type: 'number', required: true },
    authorId: {
      model: 'user',
      required: true
    },
    categoryId: {
      model: 'category',
      required: true
    },
    like: {
      collection: 'like',
      via: 'blogId'
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
  beforeCreate: updateTitleToLowerCase,
  beforeUpdate: updateTitleToLowerCase
};

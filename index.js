var ObjectId  = require('mongodb').ObjectId
var jade      = require('jade');
var jadeAsync = require('jade-async');
var _         = require('lodash');
var path      = require('path');
var util      = require('util');
var md5       = require('md5');
var moment    = require('moment');

var jadeHelpers = require('./jade-helpers.js');

module.exports = function (sails) {

  var jadeLocals       = {};
  var extendJadeLocals = function (locals) {
    return _.assign(jadeLocals, locals);
  };
  return {
    initialize: function (cb) {
      console.log('sails-hook-cms:initialize');
      jadeLocals.sails = sails;

      jadeLocals.helpers = jadeHelpers(sails);
      jadeLocals._       = _;
      jadeLocals.moment  = moment;
      //This adds the validation function cms as [model].type = cms = function(){}
      //This is to prevent

      for (var key in sails.models) {
        if (sails.models.hasOwnProperty(key)) {
          if (!sails.models[key].types) sails.models[key].types = {};
          sails.models[key].types.cms = function () {
            return true;
          };
        }
      }

      require('./lib/bindAssets')(sails, function (err, result) {
        if (err) {
          sails.log.error(err);
          return cb(err);
        }
        cb();
      });
    },
    routes: {
      after: {
        'GET /admin/login': function (req, res) {
          let html = jade.compileFile(path.join(__dirname, 'views/login.jade'))({
            referer: req.query.referer
          });
          res.send(html);
        },
        'GET /admin/logout': function (req, res) {
          delete req.session.userId;
          res.redirect('/admin');
        },

        'POST /admin/login': function (req, res, next) {
          Users.findOne({email: req.body.email, password: md5(req.body.password), role: 'admin'}).then((user) => {
            if (!user)
              return res.redirect('/admin');

            req.session.userId = user.id;

            return res.redirect(req.query.referer);
          })
        },


        'GET /admin': function (req, res, next) {
          var jadeFn = jade.compileFile(path.join(__dirname, 'views/home.jade'));
          var html   = jadeFn(extendJadeLocals({}));
          return res.send(html);
        },


        'GET /admin/:model': async function (req, res, next) {
          if (req.params.model && sails.models[req.params.model]) {
            let model       = sails.models[req.params.model];
            var modelSchema = model._attributes;
            //let relation_fields = Object.entries(modelSchema).reduce((fields, [field_key, field_config]) => field_config.model || field_config.collection ? fields.push({name: field_key, modelName: field_config.model}) && fields : fields, []);
            //Find all models
            let numRecords = await model.count({});
            let pageCount = numRecords / 100;
            let query = model.find({}, {limit: 100});

            if(req.query.page) {
              let skipBy = (req.query.page-1) * 100;
              query.skip(skipBy);
            }

            if (req.query.sortBy) {
              req.query.sortBy.split(",").forEach((sortBy) => query.sort(sortBy))
            }

            query.then((rows) => {
              var jadeFn = jadeAsync.compileFile(path.join(__dirname, 'views/model.index.jade'));
              jadeFn(extendJadeLocals({
                currentUrl: req.path,
                sortBy: req.query.sortBy || false,
                modelName: req.params.model,
                modelSchema: modelSchema,
                cms: model.cms || {},
                models: rows,
                pageCount,
                currentPage: req.query.page
              })).done(res.ok);
            }).catch(res.negotiate);

          } else {
            return next();
          }
        },


        'GET /admin/:model/create': function (req, res, next) {
          if (req.params.model && sails.models[req.params.model]) {

            var modelSchema = _.clone(sails.models[req.params.model]._attributes);
            delete modelSchema.id;
            delete modelSchema.createdAt;
            delete modelSchema.updatedAt;

            //Using the async thing
            var jadeFn = jadeAsync.compileFile(path.join(__dirname, 'views/model.create.jade'));
            jadeFn(extendJadeLocals({
              modelName: req.params.model,
              modelSchema: modelSchema
            })).done(function (html) {
              return res.send(html);
            });
          } else {
            return next();
          }
        },

        'GET /admin/:model/edit/:modelId': function (req, res, next) {
          if (req.params.modelId && req.params.model && sails.models[req.params.model]) {

            var modelSchema = _.clone(sails.models[req.params.model]._attributes);
            delete modelSchema.id;
            delete modelSchema.createdAt;
            delete modelSchema.updatedAt;

            // make function for READONLY attributes

            //FindOne model
            sails.models[req.params.model]
            .findOne({id: req.params.modelId})
            .then(function (model) {
              var jadeFn = jadeAsync.compileFile(path.join(__dirname, 'views/model.edit.jade'));
              jadeFn(extendJadeLocals({
                modelName: req.params.model,
                modelSchema: modelSchema,
                model: model
              })).done(function (html) {
                return res.send(html);
              });
            }).catch((err) => res.negotiate(err));
          } else {
            return next();
          }
        },

        'POST /admin/:model/store': function (req, res, next) {
          if (req.params.model && sails.models[req.params.model]) {
            fields = req.body; //TODO: Clean req.body from empty attrs or _.omit(sourceObj, _.isUndefined) <- allows false, null, 0

            Object.entries(fields).forEach(([key, value]) => {
              if (sails.models[req.params.model]._attributes[key].type == "objectid")
                fields[key] = new ObjectId(value);
            })

            sails.models[req.params.model].create(fields).then(() => res.redirect('/admin/' + req.params.model)).catch(res.negotiate);
          } else {
            return next();
          }
        },

        'GET /admin/:model/duplicate/:modelId': function (req, res, next) {
          if (req.params.model && sails.models[req.params.model]) {

            sails.models[req.params.model].findOne({id: req.params.modelId}).then((found_model) => {
               //TODO: Clean req.body from empty attrs or _.omit(sourceObj, _.isUndefined) <- allows false, null, 0
              delete found_model.id;
              return sails.models[req.params.model]
              .create(found_model)
              .then((created) => {
                res.redirect('/admin/' + req.params.model + '/edit/' + created.id)
              });

            }).catch(res.negotiate);
          } else {
            return next();
          }
        },

        'POST /admin/:model/update/:modelId': function (req, res, next) {
          if (req.params.model && sails.models[req.params.model]) {
            let fields = req.body; //TODO: Clean req.body from empty attrs or _.omit(sourceObj, _.isUndefined) <- allows false, null, 0

            Object.entries(fields).forEach(([key, value]) => {
              if (sails.models[req.params.model]._attributes[key].type == "objectid")
                fields[key] = ObjectId(value);

              if (sails.models[req.params.model]._attributes[key].type == "date")
                fields[key] = moment(value, "MM-DD-YYYY").toDate();

              if (sails.models[req.params.model]._attributes[key].type == "datetime")
                fields[key] = moment(value, "MM-DD-YYYY hh:mm").toDate();

            })


            sails.models[req.params.model].update({id: req.params.modelId}, fields)
            .then(() => res.redirect(`/admin/${req.params.model}/edit/${req.params.modelId}`))
            .catch(res.negotiate);
          } else {
            return next();
          }
        },


        'GET /admin/:model/delete/:modelId': function (req, res, next) {
          if (req.params.modelId && req.params.model && sails.models[req.params.model]) {

            //FindOne model
            sails.models[req.params.model]
            .destroy({id: req.params.modelId})
            .then(() => res.redirect('/admin/' + req.params.model))
            .catch(res.negotiate);
          } else {
            return next();
          }
        }

      }
    }
  };
};

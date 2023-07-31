var ObjectId  = require('mongodb').ObjectId
var jade      = require('jade');
var jadeAsync = require('jade-async');
var _         = require('lodash');
var path      = require('path');
var md5       = require('md5');
var moment    = require('moment');
var pkg       = require('./package.json')

var jadeHelpers = require('./lib/jade-helpers.js');

module.exports = function (sails) {

  var jadeLocals       = {};
  var extendjadeLocals = function (locals) {
    return _.assign(jadeLocals, locals);
  };
  return {
    initialize: function (cb) {
      console.log('sails-hook-cms:initialize');
      jadeLocals.sails = sails;

      const defaultConfig = {
        title: "Sails CMS",
        logo_url: false,
        styles: [
          '/admin/css/admin.css?v='+pkg.version
        ]
      }

      jadeLocals.config = {
        title: _.get(sails,"config.cms.title", defaultConfig.title),
        logo_url: _.get(sails,"config.cms.logo_url", defaultConfig.logo_url),
        styles: _.get(sails,"config.cms.styles", defaultConfig.styles),
      }

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
          var html   = jadeFn(extendjadeLocals({}));
          return res.send(html);
        },


        'GET /admin/:model': async function (req, res, next) {
          if (req.params.model && sails.models[req.params.model]) {
            let model       = sails.models[req.params.model];
            var modelSchema = model._attributes || model.attributes;
            //let relation_fields = Object.entries(modelSchema).reduce((fields, [field_key, field_config]) => field_config.model || field_config.collection ? fields.push({name: field_key, modelName: field_config.model}) && fields : fields, []);
            //Find all models
            let numRecords = await model.count({});
            let pageCount = numRecords / 100;
            let query = model.find({}).limit(100);

            if(req.query.page) {
              let skipBy = (req.query.page-1) * 100;
              query.skip(skipBy);
            }

            if (req.query.sortBy) {
              req.query.sortBy.split(",").forEach((sortBy) => query.sort(sortBy))
            }

            query.populateAll().then((rows) => {
              let render = jade.compileFile(path.join(__dirname, 'views/model.index.jade'))
              let html = render(extendjadeLocals({
                currentUrl: req.path,
                sortBy: req.query.sortBy || false,
                modelName: req.params.model,
                modelSchema: modelSchema,
                cms: model.cms || {},
                models: rows,
                pageCount,
                currentPage: req.query.page
              }));

                return res.send(html);
            }).catch(res.negotiate);

          } else {
            return next();
          }
        },


        'GET /admin/:model/create': function (req, res, next) {
          if (req.params.model && sails.models[req.params.model]) {

            let attributes = sails.models[req.params.model]._attributes || sails.models[req.params.model].attributes;

            var modelSchema = _.clone(attributes);
            delete modelSchema.id;
            delete modelSchema.createdAt;
            delete modelSchema.updatedAt;

            //Using the async thing
            let jadeRender = jadeAsync.compileFile(path.join(__dirname, 'views/model.create.jade'));
            jadeRender(extendjadeLocals({
              modelName: req.params.model,
              modelSchema: modelSchema
            })).done(function(html) {
              return res.send(html);
            });
          } else {
            return next();
          }
        },

        'GET /admin/:model/edit/:modelId': function (req, res, next) {
          if (req.params.modelId && req.params.modelId != "false" && req.params.model && sails.models[req.params.model]) {
            let attributes = sails.models[req.params.model]._attributes || sails.models[req.params.model].attributes;
            var modelSchema = _.clone(attributes);
            delete modelSchema.id;
            delete modelSchema.createdAt;
            delete modelSchema.updatedAt;

            // make function for READONLY attributes

            //FindOne model
            let q = sails.models[req.params.model]
                .findOne({id: req.params.modelId});

            sails.models[req.params.model].associations.forEach(function (associationInfo) {
              q.populate(associationInfo.alias);
            });

            q.then(function (model) {
              jadeAsync.compileFile(path.join(__dirname, 'views/model.edit.jade'))(extendjadeLocals({
                modelName: req.params.model,
                modelSchema: modelSchema,
                model: model
              })).done(function(html) {
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

            let attributes = sails.models[req.params.model]._attributes || sails.models[req.params.model].attributes;

            Object.entries(fields).forEach(([key, value]) => {
              if (attributes[key].type == "objectid")
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

            let attributes = sails.models[req.params.model]._attributes || sails.models[req.params.model].attributes;

            Object.entries(fields).forEach(([key, value]) => {
              if (attributes[key].type == "objectid")
                fields[key] = ObjectId(value);

              if (typeof sails.models[req.params.model]._attributes[key].collection != "undefined" && !Array.isArray(fields[key])) {
                if(sails.config.connections[sails.models[req.params.model].connection].adapter == 'sails-mysql')
                  fields[key] = fields[key] == "" ? [] : [parseInt(fields[key])];
                else
                  fields[key] = [fields[key]];
              }

              if (attributes[key].type == "date")
                fields[key] = moment(value, "MM-DD-YYYY").toDate();

              if (attributes[key].type == "datetime")
                fields[key] = moment(value, "MM-DD-YYYY hh:mm").toDate();

              if(key == "password" && fields[key] == "")
                delete fields[key];
            });

            sails.models[req.params.model].update({id: req.params.modelId}, fields)
                .then(() => res.redirect(`/admin/${req.params.model}/edit/${req.params.modelId}`))
                .catch((err) => {
                  res.negotiate(err)
                });
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

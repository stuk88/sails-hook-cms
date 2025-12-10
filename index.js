var ObjectId = require('mongodb').ObjectId
var jade = require('jade');
var jadeAsync = require('jade-async');
var _ = require('lodash');
var path = require('path');
var moment = require('moment');
var pkg = require('./package.json')
const utils = require('./lib/utils');

var jadeHelpers = require('./lib/jade-helpers.js');
var ejsHelpers = require('./lib/ejs-helpers.js');

module.exports = function (sails) {

  const isSuperAdmin = (req, res, next) => {
    sails.log('isSuperAdmin check:', {
      path: req.path,
      hasSession: !!req.session,
      hasUser: !!(req.session && req.session.me),
      userRole: req.session && req.session.me ? req.session.me.role : null,
      userId: req.session && req.session.me ? req.session.me.id : null
    });
    
    if (req.session && req.session.me && req.session.me.role === 'super_admin') {
      sails.log.verbose('isSuperAdmin: Access granted');
      return next();
    }
    
    sails.log('isSuperAdmin: Access denied, redirecting to login');
    return res.redirect(`/admin/login?referer=${req.path}`);
  };

  var injectedVars = {};
  injectedVars.sails = sails;

  const defaultConfig = {
    title: "Sails CMS",
    logo_url: false,
    styles: [
      '/admin/css/admin.css?v=' + pkg.version
    ],
    template: 'jade'
  }

  injectedVars.config = {
    title: _.get(sails, "config.cms.title", defaultConfig.title),
    logo_url: _.get(sails, "config.cms.logo_url", defaultConfig.logo_url),
    styles: _.get(sails, "config.cms.styles", defaultConfig.styles),
    template: _.get(sails, "config.cms.template", defaultConfig.template)
  }

  injectedVars._ = _;
  injectedVars.moment = moment;
  injectedVars.hasJsonEditor = false;
  var extendInjectedVars = (locals) => _.assign(injectedVars, locals);
  
  const camel2title = (camelCase) => camelCase
  .replace(/([A-Z])/g, (match) => ` ${match}`)
  .replace(/^./, (match) => match.toUpperCase())
  .trim();

  const addAttrLabels = function (modelName, modelSchema) {
    Object.entries(modelSchema).forEach(([name, attr]) => {
      modelSchema[name].cms = _.get(modelSchema,`[${name}].cms`, {});
      modelSchema[name].cms.label = _.get(modelSchema,`[${name}].cms.label`, camel2title(name)) 
    })
    return modelSchema;
  }

  const fixCmsAttributeConfig = function(modelName, modelSchema) {
    if(_.get(sails, `models[${modelName}].cms.attributes`, false))
      {
        Object.entries(modelSchema).forEach(([name, attr]) => {
          modelSchema[name] = {
            ...modelSchema[name],
            cms: {
              ...(_.get(sails, `models[${modelName}].cms.attributes[${name}]`, null)),
            }
          }
        })
      }
      return modelSchema;
  }

  const buildModelSchema = (modelName, modelSchema) => addAttrLabels(modelName, fixCmsAttributeConfig(modelName, modelSchema));

  /**
   * 
   * @param {string} fileName 
   * @param {object} locals 
   * @returns 
   */
  var renderTemplate = function (fileName, locals = {}) {
    locals = extendInjectedVars(locals);

    const templatePath = (!locals.config.template || locals.config.template == "ejs") ? 'admin/'+ fileName : path.join(__dirname, 'views', `${fileName}`);
    if(locals.config.template && locals.config.template !== "ejs")
      templatePath += locals.config.template;

    locals.helpers = locals.config.template == 'jade' ? jadeHelpers(sails) : ejsHelpers(sails);

    if (locals.config.template === 'ejs') {
        return sails.renderView(templatePath, { ...locals, async: true, layout: 'layout' });
    } else {
      if (locals.async)
        return new Promise((resolve, reject) => { jadeAsync.compileFile(templatePath)(locals).done((html) => resolve(html)) });
      else
        return jade.compileFile(templatePath)(locals);
    }
  };

  return {
    initialize: function () {
      console.log('sails-hook-cms:initialize');

      //This adds the validation function cms as [model].type = cms = function(){}
      //This is to prevent

      return new Promise((resolve) => {
        sails.on('hook:orm:loaded', () => {

          for (var key in sails.models) {
            if (sails.models.hasOwnProperty(key)) {
              if (!sails.models[key].types) 
                sails.models[key].types = {};
              sails.models[key].types.cms = function () {
                return true;
              };
            }
          }

          injectedVars.modelsArray = Object.values(sails.models).filter((model) => (!model.junctionTable && !model.meta.junctionTable));

          // Uncomment on package install or update. It will overide the admin theme files from the packge files.
          return resolve();

          require('./lib/bindAssets')(sails, function (err, result) {
            if (err) {
              sails.log.error(err);
              return cb(err);
            }
            resolve();
          });
        });
      });

    },
    routes: {
      after: {
        'GET /admin/login': async function (req, res) {
          let html = await renderTemplate('login', {
            referer: req.query.referer
          });
          res.send(html);
        },
        'GET /admin/logout': [
          isSuperAdmin, // Use the policy here
          function (req, res) {
          delete req.session.userId;
          delete req.session.me;
          res.redirect('/admin');
        }],

        'POST /admin/login': function (req, res, next) {
        
          if (!req.body.email || !req.body.password)
            return res.redirect('/admin');

            User.find({ where: {email: req.body.email, role: 'super_admin'}, limit: 1 }).then(async (user) => {
              if (!user) {
                sails.log.warn('Login attempt for non-existent user:', req.body.email);
                return res.redirect('/admin');
              }

              user = user[0]
              sails.log.verbose('User found for login:', req.body.email);
              await sails.helpers.passwords.checkPassword(req.body.password, user.password)
              .then(() => {
                req.session.userId = user.id;
                req.session.me = user;
                sails.log.verbose('Session saved for user:', req.body.email);
                req.session.save(function() {
                  return res.redirect(req.body.referer || '/admin');
                });
              })
              .catch((err) => {
                sails.log.warn('Failed login attempt for user:', req.body.email);
                return res.redirect('/admin');
              });
            });
          
        },


        'GET /admin': [
          isSuperAdmin, // Use the policy here
          async function (req, res, next) {
          let html = await renderTemplate('home');

          return res.send(html);
        }],


        'GET /admin/:model': [
          isSuperAdmin, // Use the policy here
          async function (req, res, next) {
          if (req.params.model && sails.models[req.params.model]) {
            let model = sails.models[req.params.model];
            var modelSchema = model._attributes || model.attributes;
            //let relation_fields = Object.entries(modelSchema).reduce((fields, [field_key, field_config]) => field_config.model || field_config.collection ? fields.push({name: field_key, modelName: field_config.model}) && fields : fields, []);
            //Find all models
            let numRecords = await model.count({});
            let pageCount = Math.ceil(numRecords / 100);
            let query = model.find({}).limit(100);

            if (req.query.page) {
              let skipBy = (req.query.page - 1) * 100;
              query.skip(skipBy);
            }

            if (req.query.sortBy) {
              req.query.sortBy.split(",").forEach((sortBy) => query.sort(sortBy))
            }

            query.populateAll().then(async (rows) => {
              return res.send(await renderTemplate('model.index', {
                currentUrl: req.path,
                sortBy: req.query.sortBy || false,
                modelName: req.params.model,
                modelSchema: buildModelSchema(req.params.model, modelSchema),
                cms: model.cms || {},
                models: rows,
                pageCount,
                currentPage: req.query.page
              }));
            }).catch(res.negotiate);

          } else {
            return next();
          }
        }],


        'GET /admin/:model/create': [
          isSuperAdmin, // Use the policy here
          async function (req, res, next) {
          if (req.params.model && sails.models[req.params.model]) {

            let attributes = sails.models[req.params.model]._attributes || sails.models[req.params.model].attributes;

            var modelSchema = _.clone(attributes);
            delete modelSchema.id;
            delete modelSchema.createdAt;
            delete modelSchema.updatedAt;

            //Using the async thing
            let html = await renderTemplate('model.create', {
              modelName: req.params.model,
              modelSchema: buildModelSchema(req.params.model, modelSchema)
            })
            res.send(html);
          } else {
            return next();
          }
        }],

        'GET /admin/:model/edit/:modelId': [
          isSuperAdmin, // Use the policy here
          async function (req, res, next) {
          if (req.params.modelId && req.params.modelId != "false" && req.params.model && sails.models[req.params.model]) {
            let attributes = sails.models[req.params.model]._attributes || sails.models[req.params.model].attributes;
            var modelSchema = _.clone(attributes);
            delete modelSchema.id;
            delete modelSchema.createdAt;
            delete modelSchema.updatedAt;

            // make function for READONLY attributes

            //FindOne model
            let q = sails.models[req.params.model]
              .findOne({ id: req.params.modelId });

            sails.models[req.params.model].associations.forEach(function (associationInfo) {
              q.populate(associationInfo.alias);
            });

            q.then(async function (model) {

              if (!model)
                return res.status(404).send();

              let html = await renderTemplate('model.edit', {
                hasJsonEditor: utils.hasJsonEditor(modelSchema),
                modelName: req.params.model,
                modelSchema: buildModelSchema(req.params.model, modelSchema),
                model: model
              })
              res.send(html);
            }).catch((err) => res.negotiate(err));
          } else {
            return next();
          }
        }],

        'POST /admin/:model/store': [
          isSuperAdmin, // Use the policy here
          function (req, res, next) {
          if (req.params.model && sails.models[req.params.model]) {
            fields = req.body; //TODO: Clean req.body from empty attrs or _.omit(sourceObj, _.isUndefined) <- allows false, null, 0

            let attributes = sails.models[req.params.model]._attributes || sails.models[req.params.model].attributes;

            Object.entries(fields).forEach(([key, value]) => {

              if(attributes[key].type == 'number' && value == '')
                fields[key] = 0;

              if((attributes[key].collection || attributes[key].model) && value == '' )  {
                delete fields[key];
                return;
              }

              if (attributes[key].type == "objectid")
                fields[key] = new ObjectId(value);


              if (_.get(sails,`models[${req.params.model}]._attributes[${key}].collection`, false) && !Array.isArray(fields[key])) {
                if (_.get(sails,`config.connections[${_.get(sails,`models[${req.params.model}].connection`)}].adapter`, false) == 'sails-mysql')
                  fields[key] = fields[key] == "" ? [] : [parseInt(fields[key])];
                else
                  fields[key] = [fields[key]];
              }


              if (attributes[key].type == "date")
                fields[key] = moment(value, "MM-DD-YYYY").toDate();

              if (attributes[key].type == "datetime")
                fields[key] = moment(value, "MM-DD-YYYY hh:mm").toDate();

            })

            sails.models[req.params.model].create(fields)
            .then(() => res.redirect('/admin/' + req.params.model))
            .catch(res.negotiate);
          } else {
            return next();
          }
        }],

        'GET /admin/:model/duplicate/:modelId': 
        [
          isSuperAdmin, // Use the policy here
        function (req, res, next) {
          if (req.params.model && sails.models[req.params.model]) {

            sails.models[req.params.model].findOne({ id: req.params.modelId }).then((found_model) => {
              //TODO: Clean req.body from empty attrs or _.omit(sourceObj, _.isUndefined) <- allows false, null, 0
              delete found_model.id;
              return sails.models[req.params.model]
                .create(found_model)
                .fetch()
                .then((created) => {
                  res.redirect('/admin/' + req.params.model + '/edit/' + created.id)
                });

            }).catch(res.negotiate);
          } else {
            return next();
          }
        }],

        'POST /admin/:model/update/:modelId': 
        [
          isSuperAdmin, // Use the policy here
        function (req, res, next) {
          if (req.params.model && sails.models[req.params.model]) {
            let fields = req.body; //TODO: Clean req.body from empty attrs or _.omit(sourceObj, _.isUndefined) <- allows false, null, 0

            let attributes = sails.models[req.params.model]._attributes || sails.models[req.params.model].attributes;

            Object.entries(fields).forEach(([key, value]) => {

              if(attributes[key].type == 'number' && value == '')
                fields[key] = 0;

              if((attributes[key].collection || attributes[key].model) && value == '' )  {
                delete fields[key];
                return;
              }

              if (attributes[key].type == "objectid")
                fields[key] = ObjectId(value);

              if (attributes[key].collection && !Array.isArray(fields[key])) {
                if (_.get(sails,`config.datastores[${_.get(sails,`models[${req.params.model}].datastore`)}].adapter`, false) == 'sails-mysql')
                  fields[key] = fields[key] == "" ? [] : fields[key].split(",").map(parseInt);
                else
                  fields[key] = fields[key].split(",");
              }

              if (attributes[key].type == "date")
                fields[key] = moment(value, "MM-DD-YYYY").toDate();

              if (attributes[key].type == "datetime")
                fields[key] = moment(value, "MM-DD-YYYY hh:mm").toDate();

              if (key == "password" && fields[key] == "")
                delete fields[key];
            });

            sails.models[req.params.model].update({ id: req.params.modelId }, fields)
              .then(() => res.redirect(`/admin/${req.params.model}/edit/${req.params.modelId}`))
              .catch((err) => {
                res.negotiate(err)
              });
          } else {
            return next();
          }
        }],


        'GET /admin/:model/delete/:modelId': [
          isSuperAdmin, // Use the policy here
          function (req, res, next) {
          if (req.params.modelId && req.params.model && sails.models[req.params.model]) {

            //FindOne model
            sails.models[req.params.model]
              .destroy({ id: req.params.modelId })
              .then(() => res.redirect('/admin/' + req.params.model))
              .catch(res.negotiate);
          } else {
            return next();
          }
        }]

      }
    }
  };
};

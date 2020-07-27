
var jade = require('jade');
var path = require('path');
var _ = require('lodash');
var moment =  require('moment');
if (!Promise) var Promise = require('q');


module.exports = function(sails) {
  if(!sails) return 'No sails reference specified';

  var enumAsOptions = function (values) {
    return _.map(values, function (item){
      return {value:item, name:item};
    });
  };
  var getModelName = function(item, config) {
      if(typeof item.name == "function") // support for model instance functions
        return item.name();

     return (config && config.title) ? item[config.title] : item.name;
  }

  var getModelNameById = function (id, modelName, config) {
    var p = Promise.defer();
    if(sails.models[modelName]){
      sails.models[modelName].findOne({id: id}).then(function(model){
        p.resolve(getModelName(model, config));
      }).catch(p.resolve);
    } else {
      return p.resolve('No model found for ' + attr.model);
    }
    return p.promise;
  }

  var modelsAsOptions = function (models, config, attr) {
    let options = _.map(models, function (item) {
      let row = {value: item.id, name: getModelName(item, config)};
      if(_.get(item,"parent_id", false))
        row['parent_id'] = item.parent_id;

      return row;
    });

    if(!_.get(attr,"notNull", false))
    {
        let AttributeName = attr.cms.label || attr.collection || attr.model;
        options.unshift({value: null, name: 'Without '+ AttributeName })
    }

    return options;
  };

  return {
    list: {
      item: function(value, attrName, attrs){
        if(!value)
          return '';
        if(attrs.type == 'datetime' ){
          return moment(value).format('DD/MM/YYYY:hh-mm a');
        } else if(attrs.type == 'date'){
          return moment(value).format('DD/MM/YYYY');
        } else if(attrs.collection){
            return (value && getModelName(value, sails.models[attrs.collection].cms)) ? getModelName(value, sails.models[attrs.collection].cms) : '';
        } else if(attrs.model){
          return (value && getModelNameById(value, attrs.model, sails.models[attrs.model].cms)) ? getModelNameById(value, attrs.model, sails.models[attrs.model].cms) : '';
        } else if(attrs.collection){
          return (value.length) ? value.length : 0;
        } else if(attrs.type == "json"){
          return (typeof value != "undefined") ? JSON.stringify(value) : '';
        } else {
          return value;

        }
      }
    },
    form: {
      getElement : function(name, attr, value){
        var jadeFormPartials = jade.compileFile(path.join(__dirname, 'partials/forms.jade'));

        //If is STRING
        if(attr.type == 'string'){
          if(attr.enum){
            return jadeFormPartials({
              element: 'select',
              name: name,
              attr: attr,
              value: value,
              options: enumAsOptions(attr.enum)
            });
          } else {
            return jadeFormPartials({
              element: 'input',
              name: name,
              attr: attr,
              value: value
            });
          }

          //if is DATE or DATETIME
        } else if(attr.type == 'date' || attr.type == 'datetime') {

          if(attr.type == 'date')
            value = moment(value).format("MM-DD-YYYY");
          else
            value = moment(value).format("MM-DD-YYYY hh:mm");

          return jadeFormPartials({
            element: attr.type,
            name: name,
            attr: attr,
            value: value
          });

          //if is BOOLEAN
        } else if(attr.type == 'boolean') {
          return jadeFormPartials({
            element: 'checkbox',
            name: name,
            attr: attr,
            value: value
          });

            // If is FLOAT or NUMBER
        } else if((attr.type == 'integer' || attr.type == 'float') && !attr.model) {
            return jadeFormPartials({
                element: 'input',
                type: 'number',
                name: name,
                attr: attr,
                value: value,
                defaultsTo: attr.defaultsTo
            });

            // If is json
        } else if(attr.type == 'json' && !attr.model) {
            return jadeFormPartials({
                element: 'textarea',
                name: name,
                attr: attr,
                value: JSON.stringify(value, null, 2)
            });

            // If is a RELATION
        } else if(attr.model) {
            var p = Promise.defer();
            if(sails.models[attr.model]){
                sails.models[attr.model].find().then(function(models){
                    p.resolve(jadeFormPartials({
                        element: 'select',
                        attr: attr,
                        name: name,
                        options: modelsAsOptions(models, sails.models[attr.model].cms, attr),
                        value: value
                    }));
                }).catch(p.resolve);
            }else {
                return p.resolve('No model found for ' + attr.model);
            }
            return p.promise;

            // If is a RELATION of many
            } else if(attr.collection) {
                var p = Promise.defer();
                if(sails.models[attr.collection]){
                    sails.models[attr.collection].find().exec(function(err, models){
                        if(err) return p.resolve('error on model');
                        p.resolve(jadeFormPartials({
                            element: 'combo',
                            attr: attr,
                            name: name,
                            options: JSON.stringify(modelsAsOptions(models, sails.models[attr.collection].cms)),
                            value: value
                        }));
                    });
                }else {
                    return p.resolve('No model found for ' + attr.collection);
                }
                return p.promise;
            }
      }
    }
  };
};

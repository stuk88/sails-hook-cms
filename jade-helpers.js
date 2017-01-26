
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

  var modelsAsOptions = function (models, config) {
    return _.map(models, function (item){
      var name = getModelName(item, config);
      return {value:item.id, name:name};
    });
  };

  return {
    list: {
      item: function(value, attrName, attrs){
        if(attrs.type == 'datetime' ){
          return moment(value).format('DD/MM/YYYY:hh-mm a');
        } else if(attrs.type == 'date'){
          return moment(value).format('DD/MM/YYYY');
        } else if(attrs.collection){
            return (value && value.name) ? getModelName(value, sails.models[attrs.collection].cms) : '';
        } else if(attrs.model){
          return (value && value.name) ? getModelName(value, sails.models[attrs.model].cms) : '';
        } else if(attrs.collection){
          return (value.length) ? value.length : 0;
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
                value: value
            });

            // If is json
        } else if(attr.type == 'json') {
            return jadeFormPartials({
                element: 'textarea',
                name: name,
                attr: attr,
                value: value
            });

            // If is a RELATION
        } else if(attr.model) {
            var p = Promise.defer();
            if(sails.models[attr.model]){
                sails.models[attr.model].find().exec(function(err, models){
                    if(err) return p.resolve('error on model');
                    p.resolve(jadeFormPartials({
                        element: 'select',
                        attr: attr,
                        name: name,
                        options: modelsAsOptions(models, sails.models[attr.model].cms),
                        value: value
                    }));
                });
            }else {
                return p.resolve('No model found for ' + attr.model);
            }
            return p.promise;

            // If is a RELATION of many
            } else if(attr.collection) {
                var p = Promise.defer();
                if(sails.models[attr.collection]){
                  console.log(JSON.stringify(value));
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

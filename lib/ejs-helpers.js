const Promise = require('bluebird');
const ejs = require('ejs');
const path = require('path');
const _ = require('lodash');
const moment = require('moment');

module.exports = function (sails) {
    if (!sails) return 'No sails reference specified';

    var enumAsOptions = function (values) {
        return _.map(values, function (item) {
            return { value: item, name: item };
        });
    };
    var getModelName = function (item, config) {
        if (typeof item.name == "function") // support for model instance functions
            return item.name();
        return (config && config.title) ? item[config.title] : item.name;
    }

    var modelsAsOptions = function (models, config) {
        return _.map(models, function (item) {
            var name = getModelName(item, config);
            return { value: item.id, name: name };
        });
    };

    var modelsAsList = function (models, config) {
        return _.map(models, function (item) {
            var name = getModelName(item, config);
            return name;
        }).join(", ");
    };

    var nl2br = function (str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    };


    var populateAttrWithCollectionOptions = function (attr, model) {
        return new Promise(function (resolve, reject) {
            if (sails.models[model]) {
                sails.models[model].find().then(function (records) {
                    let attr_config = sails.models[model].cms;
                    attr.options = modelsAsOptions(records, attr_config);
                    resolve(attr);
                }).catch(function (err) {
                    reject(err);
                })
            }
        });
    };

    var populateAttrWithEnumOptions = function (attr) {
        attr.options = enumAsOptions(attr.enum);
        return attr;
    }

    var convertSubfieldsToAttrObject = function (attrs, keys) {
        let result = {};
        for (var i = 0; i < attrs.length; i++) {
            result[keys[i]] = attrs[i];
        }
        return result;
    };

    var getSubFieldsBasedOnAttr = function (models, field_key) {
        console.log(models);
        if (models.length == 0 || !Array.isArray(models))
            return [];

        return models.map(function (model) {
            return model[field_key];
        });
    }


    return {
        list: {
            item: function (value, attrName, attrs) {

                if (attrs.cms && attrs.cms.type == 'password')
                    return;

                if (attrs.type == 'datetime') {
                    return moment(value).format('DD/MM/YYYY hh:mm a');
                } else if (attrs.type == 'date') {
                    return moment(value).format('DD/MM/YYYY');
                } else if (attrs.collection) {
                    return (value) ? modelsAsList(value, sails.models[attrs.collection].cms) : '';
                } else if (attrs.model) {
                    return ((value) ? getModelName(value, sails.models[attrs.model].cms) : '');
                } else if (attrs.collection) {
                    return (value.length) ? value.length : 0;
                } else if (attrs.type == "json" && attrs.cms && attrs.cms.collection) {
                    return modelsAsList(value, sails.models[attrs.cms.collection].cms);
                } else {
                    return value;
                }
            }
        },
        form: {
            getElement: async function (name, attr, value, model) {
                var ejsFormPartials = async (options) => await ejs.renderFile(path.join(__dirname, '../partials/forms.ejs'), options);

                if (attr.cms && attr.cms.description) {
                    attr.cms.description = nl2br(attr.cms.description)
                }

                //If is STRING
                if (attr.type == 'string' || attr.type == "float" || attr.type == "integer") {
                    if (attr.enum) {
                        return ejsFormPartials({
                            element: 'select',
                            name: name,
                            attr: attr,
                            value: value,
                            options: enumAsOptions(attr.enum)
                        });
                    } else {
                        var type = attr.type;
                        var attr_type = (type == "float" || type == "integer") ? 'number' : type,
                            attr_type = (type == "string") ? 'text' : attr_type,
                            attr_type = (attr.cms && attr.cms.type) ? attr.cms.type : attr_type;
                        return ejsFormPartials({
                            element: 'input',
                            type: attr_type,
                            name: name,
                            attr: attr,
                            value: value
                        });
                    }

                    //if is DATE or DATETIME
                } else if (attr.type == 'date' || attr.type == 'datetime') {
                    return ejsFormPartials({
                        element: attr.type,
                        name: name,
                        attr: attr,
                        value: value
                    });

                    //if is BOOLEAN
                } else if (attr.type == 'boolean') {
                    return ejsFormPartials({
                        element: 'checkbox',
                        name: name,
                        attr: attr,
                        value: value
                    });

                    // If is FLOAT or NUMBER
                } else if ((attr.type == 'integer' || attr.type == 'float') && !attr.model) {
                    return ejsFormPartials({
                        element: 'input',
                        type: 'number',
                        name: name,
                        attr: attr,
                        value: value
                    });

                    // If is json
                } else if ((attr.type == 'json' || attr.type == 'text') && !(attr.cms && attr.cms.collection) && !(attr.cms)) {
                    return ejsFormPartials({
                        element: 'textarea',
                        name: name,
                        attr: attr,
                        value: value
                    });

                    // If is a RELATION
                } else if (attr.model) {
                    return new Promise((resolve, reject) => {
                        if (sails.models[attr.model]) {
                            sails.models[attr.model].find().exec(function (err, models) {
                                if (err) return resolve('error on model');
                                resolve(ejsFormPartials({
                                    element: 'select',
                                    attr: attr,
                                    name: name,
                                    options: modelsAsOptions(models, sails.models[attr.model].cms),
                                    value: value
                                }));
                            });
                        } else {
                            return resolve('No model found for ' + attr.model);
                        }
                    })

                    // If is a RELATION of many
                } else if (attr.collection) {
                    return new Promise((resolve, reject) => {
                        if (sails.models[attr.collection]) {
                            sails.models[attr.collection].find().exec(function (err, models) {
                                if (err) return resolve('error on model');
                                resolve(ejsFormPartials({
                                    element: 'combo',
                                    attr: attr,
                                    name: name,
                                    options: JSON.stringify(modelsAsOptions(models, sails.models[attr.collection].cms)),
                                    value: JSON.stringify(modelsAsOptions(value, sails.models[attr.collection].cms)) || "[]"
                                }));
                            });
                        } else {
                            return resolve('No model found for ' + attr.collection);
                        }
                    })
                } else if (attr.type == "json" && attr.cms.collection) {
                    return new Promise((resolve, reject) => {
                        if (sails.models[attr.cms.collection]) {
                            sails.models[attr.cms.collection].find().exec(function (err, models) {
                                if (err) return resolve('error on model');
                                resolve(ejsFormPartials({
                                    element: 'combo',
                                    attr: attr,
                                    name: name,
                                    options: JSON.stringify(modelsAsOptions(models, sails.models[attr.cms.collection].cms)),
                                    value: JSON.stringify(modelsAsOptions(value, sails.models[attr.cms.collection].cms))
                                }));
                            });
                        } else {
                            return resolve('No model found for ' + attr.collection);
                        }
                    })
                } else if (attr.type == "json" && attr.cms.type == "repeater") {
                    return new Promise((resolve, reject) => {
                    
                    let sub_fields = null;
                    let sub_fields_keys = [];
                    if (attr.cms.repeater_fields) {
                        sub_fields = _.values(attr.cms.repeater_fields);
                        sub_fields_keys = Object.keys(attr.cms.repeater_fields);
                    } else if (attr.cms.repeater_collection) {
                        let model_attrs = _.clone(sails.models[attr.cms.repeater_collection]._attributes);
                        delete model_attrs.id;
                        delete model_attrs.createdAt;
                        delete model_attrs.updatedAt;

                        sub_fields = _.values(model_attrs);
                        sub_fields_keys = Object.keys(model_attrs);
                    }
                    Promise.map(sub_fields, function (attr) {
                        if (attr.collection)
                            return populateAttrWithCollectionOptions(attr, attr.collection);

                        if (attr.model)
                            return populateAttrWithCollectionOptions(attr, attr.model);

                        if (attr.type == "json" && attr.cms.collection)
                            return populateAttrWithCollectionOptions(attr, attr.cms.collection);

                        if (attr.enum)
                            return populateAttrWithEnumOptions(attr);

                        return attr;
                    }).then(function (attrs) {
                        resolve(ejsFormPartials({
                            element: 'repeater',
                            attr: attr,
                            sub_fields: convertSubfieldsToAttrObject(attrs, sub_fields_keys),
                            name: name,
                            value: value
                        }));
                    }).catch(function (err) {
                        resolve("Error on repeater: ejs-helpers.js:231 " + err);
                    });
                })

                } else if (attr.type == "json" && attr.cms.type == "dynamic_content") {
                    var sub_fields = model && model[attr.cms.based_on] && model[attr.cms.based_on][attr.cms.fields_attr];
                    return ejsFormPartials({
                        element: 'dynamic_content',
                        attr: attr,
                        name: name,
                        value: value,
                        sub_fields: sub_fields
                    });
                }
            }
        }
    };
};

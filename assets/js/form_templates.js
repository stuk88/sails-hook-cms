this["Templates"] = this["Templates"] || {};

this["Templates"]["partials/forms"] = function template(locals) {
var jade = window.jade && window.jade.runtime;
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (JSON, attr, element, id, name, options, sub_fields, type, value) {
var jade_indent = [];
jade_mixins["input"] = jade_interp = function(name, attr, type, value){
var block = (this && this.block), attributes = (this && this.attributes) || {};
type = type || 'text'
{
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel panel-default form-group\">\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-body\">\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<label" + (jade.attr("for", name, true, false)) + " class=\"control-label capitalize\">" + (jade.escape((jade_interp = attr.cms && attr.cms.label || name) == null ? '' : jade_interp)) + "" + (jade.escape((jade_interp = attr.required ? '*': '') == null ? '' : jade_interp)) + ":</label>");
var value = (value && (attr.cms && attr.cms.type != "password" || !attr.cms) ? value : '')
buf.push("\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<input" + (jade.attr("type", type, true, false)) + (jade.attr("name", name, true, false)) + (jade.attr("value", value, true, false)) + (jade.attr("required", (attr.required ? "required" : undefined), true, false)) + (jade.attr("disabled", (attr.cms && attr.cms.disabled), true, false)) + (jade.attr("step", (attr.type === 'float'? "any" : undefined), true, false)) + (jade.attr("id", name, true, false)) + " class=\"form-control\"/>\n  ");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
if ((attr.cms && attr.cms.description))
{
buf.push("\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-footer\">" + (((jade_interp = attr.cms.description) == null ? '' : jade_interp)) + "</div>");
}
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
}
};
jade_mixins["select"] = jade_interp = function(name, attr, options, value){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel panel-default form-group\">\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-body\">\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<label" + (jade.attr("for", name, true, false)) + " class=\"control-label capitalize\">" + (jade.escape((jade_interp = attr.cms && attr.cms.label || name) == null ? '' : jade_interp)) + "" + (jade.escape((jade_interp = attr.required ? '*' : '') == null ? '' : jade_interp)) + ":</label>\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<select" + (jade.attr("name", "" + (name) + "", true, false)) + (jade.attr("disabled", (attr.cms && attr.cms.disabled), true, false)) + (jade.attr("id", "" + (name) + "", true, false)) + (jade.attr("data-model-name", (attr && attr.model), true, false)) + (jade.attr("data-value", value, true, false)) + " class=\"selectize_select\">\n      ");
buf.push.apply(buf, jade_indent);
buf.push("<option value=\"\">Select one</option>");
// iterate options
;(function(){
  var $$obj = options;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var item = $$obj[index];

id = value && value.id || null;
buf.push("\n      ");
buf.push.apply(buf, jade_indent);
buf.push("<option" + (jade.attr("value", "" + (item.value) + "", true, false)) + (jade.attr("selected", (item.value === id) ? "selected" : undefined, true, false)) + ">" + (jade.escape((jade_interp = item.name) == null ? '' : jade_interp)) + "</option>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var item = $$obj[index];

id = value && value.id || null;
buf.push("\n      ");
buf.push.apply(buf, jade_indent);
buf.push("<option" + (jade.attr("value", "" + (item.value) + "", true, false)) + (jade.attr("selected", (item.value === id) ? "selected" : undefined, true, false)) + ">" + (jade.escape((jade_interp = item.name) == null ? '' : jade_interp)) + "</option>");
    }

  }
}).call(this);

buf.push("\n    ");
buf.push.apply(buf, jade_indent);
buf.push("</select>");
if ( attr.model)
{
buf.push("<a" + (jade.attr("href", '/admin/' + (attr.model || name) + '/create', true, false)) + " target=\"_blank\">" + (jade.escape(null == (jade_interp = "New "+ name) ? "" : jade_interp)) + "</a>");
}
buf.push("\n  ");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
if ((attr.cms && attr.cms.description))
{
buf.push("\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-footer\">" + (((jade_interp = attr.cms.description) == null ? '' : jade_interp)) + "</div>");
}
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
};
jade_mixins["checkbox"] = jade_interp = function(name, attr, value){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel panel-default checkbox form-group\">\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-body\">\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<label" + (jade.attr("for", name, true, false)) + " class=\"control-label\">\n      ");
buf.push.apply(buf, jade_indent);
buf.push("<input type=\"checkbox\"" + (jade.attr("name", "" + (name) + "", true, false)) + (jade.attr("checked", (value)? "checked" : undefined, true, false)) + " value=\"true\"" + (jade.attr("disabled", (attr.cms && attr.cms.disabled), true, false)) + (jade.attr("id", "" + (name) + "", true, false)) + "/> " + (jade.escape((jade_interp = attr.cms && attr.cms.label || name) == null ? '' : jade_interp)) + "" + (jade.escape((jade_interp = attr.required ? '*' : '') == null ? '' : jade_interp)) + "\n    ");
buf.push.apply(buf, jade_indent);
buf.push("</label>\n  ");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
if ((attr.cms && attr.cms.description))
{
buf.push("\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-footer\">" + (((jade_interp = attr.cms.description) == null ? '' : jade_interp)) + "</div>");
}
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
};
jade_mixins["datetime"] = jade_interp = function(name, attr, value){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel panel-default form-group\">\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-body\">\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<label" + (jade.attr("for", name, true, false)) + " class=\"control-label\">" + (jade.escape((jade_interp = attr.cms && attr.cms.label || name) == null ? '' : jade_interp)) + "" + (jade.escape((jade_interp = attr.required ? '*' : '') == null ? '' : jade_interp)) + ":</label>\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"input-group date\">\n      ");
buf.push.apply(buf, jade_indent);
buf.push("<input type=\"text\" date-time=\"\"" + (jade.attr("name", "" + (name) + "", true, false)) + (jade.attr("value", "" + (value) + "", true, false)) + (jade.attr("disabled", (attr.cms && attr.cms.disabled), true, false)) + (jade.attr("id", "" + (name) + "", true, false)) + " class=\"form-control\"/><span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-calendar\"></span></span>\n    ");
buf.push.apply(buf, jade_indent);
buf.push("</div>\n  ");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
if ((attr.cms && attr.cms.description))
{
buf.push("\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-footer\">" + (((jade_interp = attr.cms.description) == null ? '' : jade_interp)) + "</div>");
}
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
};
jade_mixins["date"] = jade_interp = function(name, attr, value){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel panel-default form-group\">\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-body\">\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<label" + (jade.attr("for", name, true, false)) + " class=\"control-label\">" + (jade.escape((jade_interp = attr.cms && attr.cms.label || name) == null ? '' : jade_interp)) + "" + (jade.escape((jade_interp = attr.required ? '*' : '') == null ? '' : jade_interp)) + ":</label>\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"input-group date\">\n      ");
buf.push.apply(buf, jade_indent);
buf.push("<input type=\"text\" date=\"\"" + (jade.attr("name", "" + (name) + "", true, false)) + (jade.attr("value", "" + (value) + "", true, false)) + (jade.attr("disabled", (attr.cms && attr.cms.disabled), true, false)) + (jade.attr("id", "" + (name) + "", true, false)) + " class=\"form-control\"/><span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-calendar\"></span></span>\n    ");
buf.push.apply(buf, jade_indent);
buf.push("</div>\n  ");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
if ((attr.cms && attr.cms.description))
{
buf.push("\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-footer\">" + (((jade_interp = attr.cms.description) == null ? '' : jade_interp)) + "</div>");
}
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
};
jade_mixins["textarea"] = jade_interp = function(name, attr, value){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel panel-default form-group\">\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-body\">\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<label" + (jade.attr("for", name, true, false)) + " class=\"control-label capitalize\">" + (jade.escape((jade_interp = attr.cms && attr.cms.label || name) == null ? '' : jade_interp)) + "" + (jade.escape((jade_interp = attr.required ? '*' : '') == null ? '' : jade_interp)) + ":\n      ");
buf.push.apply(buf, jade_indent);
buf.push("<textarea" + (jade.attr("name", name, true, false)) + (jade.attr("required", (attr.required ? "required" : undefined), true, false)) + (jade.attr("placeholder", (attr.default || '' ), true, false)) + (jade.attr("disabled", (attr.cms && attr.cms.disabled), true, false)) + (jade.attr("id", "" + (name) + "", true, false)) + " class=\"form-control\">" + (jade.escape(null == (jade_interp = (value ? value : '')) ? "" : jade_interp)) + "\n      ");
buf.push.apply(buf, jade_indent);
buf.push("</textarea>\n    ");
buf.push.apply(buf, jade_indent);
buf.push("</label>\n  ");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
if ((attr.cms && attr.cms.description))
{
buf.push("\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-footer\">" + (((jade_interp = attr.cms.description) == null ? '' : jade_interp)) + "</div>");
}
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
};
jade_mixins["combo"] = jade_interp = function(name, attr, options, value){
var block = (this && this.block), attributes = (this && this.attributes) || {};
var label = attr.cms.label || name
var model_name = attr.model || attr.collection || (attr.type == "json" && attr.cms.collection)
{
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel panel-default form-group\">\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-body\">\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<label" + (jade.attr("for", name, true, false)) + " class=\"control-label capitalize\">" + (jade.escape((jade_interp = attr.cms && attr.cms.label || name) == null ? '' : jade_interp)) + "" + (jade.escape((jade_interp = attr.required ? '*' : '') == null ? '' : jade_interp)) + ":</label>\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<input" + (jade.attr("id", name, true, false)) + (jade.attr("name", name, true, false)) + (jade.attr("data-options", options, true, false)) + (jade.attr("data-data", "" + (value) + "", true, false)) + " multiple=\"multiple\"" + (jade.attr("disabled", (attr.cms && attr.cms.disabled), true, false)) + " class=\"selectize\"/><a href=\"/admin/${model_name}/create\" target=\"_blank\">" + (jade.escape(null == (jade_interp = "New "+label) ? "" : jade_interp)) + "</a>\n  ");
buf.push.apply(buf, jade_indent);
buf.push("</div>\n");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
if ((attr.cms && attr.cms.description))
{
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-footer\">" + (((jade_interp = attr.cms.description) == null ? '' : jade_interp)) + "</div>");
}
}
};
jade_mixins["repeater_row"] = jade_interp = function(parent_field_name, sub_field_name, sub_field, index, value){
var block = (this && this.block), attributes = (this && this.attributes) || {};
var value = value || ''
var name = parent_field_name+"["+index+"]["+sub_field_name+"]"
sub_field.cms = sub_field.cms || {};
sub_field.cms.label = sub_field_name;
var type = sub_field.type
if ( type == 'string' || type == "float" || type == "integer")
{
if ( sub_field.enum)
{
jade_indent.push('');
jade_mixins["select"](name, sub_field, sub_field.options, value);
jade_indent.pop();
}
else
{
var attr_type = (type == "float" || type == "integer") ? 'number' : type
attr_type = (type == "string") ? 'text' : attr_type
attr_type = (sub_field.cms && sub_field.cms.type) ? sub_field.cms.type : attr_type
jade_indent.push('');
jade_mixins["input"](name, sub_field, attr_type, value);
jade_indent.pop();
}
}
if ( type == 'datetime')
{
jade_indent.push('');
jade_mixins["datetime"](name, sub_field, value);
jade_indent.pop();
}
if ( type == 'date')
{
jade_indent.push('');
jade_mixins["date"](name, sub_field, value);
jade_indent.pop();
}
if ( type == 'boolean')
{
jade_indent.push('');
jade_mixins["checkbox"](name, sub_field, value);
jade_indent.pop();
}
if ( (type == 'json' && !(sub_field.cms && sub_field.cms.collection ) && !(sub_field.cms)))
{
jade_indent.push('');
jade_mixins["textarea"](name, sub_field, value);
jade_indent.pop();
}
if ( type == 'text')
{
jade_indent.push('');
jade_mixins["textarea"](name, sub_field, value);
jade_indent.pop();
}
if ( sub_field.model || sub_field.collection || (type == "json" && sub_field.cms.collection))
{
jade_indent.push('');
jade_mixins["combo"](name, sub_field, JSON.stringify(sub_field.options), value);
jade_indent.pop();
}
};
jade_mixins["repeater"] = jade_interp = function(name, attr, sub_fields, values){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel panel-default\">\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-heading\">" + (jade.escape((jade_interp = attr.cms && attr.cms.label || name) == null ? '' : jade_interp)) + " " + (jade.escape((jade_interp = attr.required ? '*' : '') == null ? '' : jade_interp)) + " :</div>\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-body\">");
var repeater_length = values && values.length || 0;
buf.push("\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<table class=\"table repeater table-striped table-hover\">");
var i = 0;
if ( values)
{
// iterate values
;(function(){
  var $$obj = values;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var row = $$obj[$index];

buf.push("\n      ");
buf.push.apply(buf, jade_indent);
buf.push("<tr>\n        ");
buf.push.apply(buf, jade_indent);
buf.push("<td>");
// iterate sub_fields
;(function(){
  var $$obj = sub_fields;
  if ('number' == typeof $$obj.length) {

    for (var sub_field_name = 0, $$l = $$obj.length; sub_field_name < $$l; sub_field_name++) {
      var sub_field = $$obj[sub_field_name];

var value = row && row[sub_field_name] || null;
jade_indent.push('          ');
jade_mixins["repeater_row"](name, sub_field_name, sub_field, i, value);
jade_indent.pop();
    }

  } else {
    var $$l = 0;
    for (var sub_field_name in $$obj) {
      $$l++;      var sub_field = $$obj[sub_field_name];

var value = row && row[sub_field_name] || null;
jade_indent.push('          ');
jade_mixins["repeater_row"](name, sub_field_name, sub_field, i, value);
jade_indent.pop();
    }

  }
}).call(this);

buf.push("\n        ");
buf.push.apply(buf, jade_indent);
buf.push("</td>");
i++;
buf.push("\n        ");
buf.push.apply(buf, jade_indent);
buf.push("<td>\n          ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"btn btn-danger remove-row\">-</div>\n        ");
buf.push.apply(buf, jade_indent);
buf.push("</td>\n      ");
buf.push.apply(buf, jade_indent);
buf.push("</tr>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var row = $$obj[$index];

buf.push("\n      ");
buf.push.apply(buf, jade_indent);
buf.push("<tr>\n        ");
buf.push.apply(buf, jade_indent);
buf.push("<td>");
// iterate sub_fields
;(function(){
  var $$obj = sub_fields;
  if ('number' == typeof $$obj.length) {

    for (var sub_field_name = 0, $$l = $$obj.length; sub_field_name < $$l; sub_field_name++) {
      var sub_field = $$obj[sub_field_name];

var value = row && row[sub_field_name] || null;
jade_indent.push('          ');
jade_mixins["repeater_row"](name, sub_field_name, sub_field, i, value);
jade_indent.pop();
    }

  } else {
    var $$l = 0;
    for (var sub_field_name in $$obj) {
      $$l++;      var sub_field = $$obj[sub_field_name];

var value = row && row[sub_field_name] || null;
jade_indent.push('          ');
jade_mixins["repeater_row"](name, sub_field_name, sub_field, i, value);
jade_indent.pop();
    }

  }
}).call(this);

buf.push("\n        ");
buf.push.apply(buf, jade_indent);
buf.push("</td>");
i++;
buf.push("\n        ");
buf.push.apply(buf, jade_indent);
buf.push("<td>\n          ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"btn btn-danger remove-row\">-</div>\n        ");
buf.push.apply(buf, jade_indent);
buf.push("</td>\n      ");
buf.push.apply(buf, jade_indent);
buf.push("</tr>");
    }

  }
}).call(this);

buf.push("\n      ");
buf.push.apply(buf, jade_indent);
buf.push("<tr>\n        ");
buf.push.apply(buf, jade_indent);
buf.push("<td>");
// iterate sub_fields
;(function(){
  var $$obj = sub_fields;
  if ('number' == typeof $$obj.length) {

    for (var sub_field_name = 0, $$l = $$obj.length; sub_field_name < $$l; sub_field_name++) {
      var sub_field = $$obj[sub_field_name];

jade_indent.push('          ');
jade_mixins["repeater_row"](name, sub_field_name, sub_field, i);
jade_indent.pop();
    }

  } else {
    var $$l = 0;
    for (var sub_field_name in $$obj) {
      $$l++;      var sub_field = $$obj[sub_field_name];

jade_indent.push('          ');
jade_mixins["repeater_row"](name, sub_field_name, sub_field, i);
jade_indent.pop();
    }

  }
}).call(this);

buf.push("\n        ");
buf.push.apply(buf, jade_indent);
buf.push("</td>");
i++;
buf.push("\n        ");
buf.push.apply(buf, jade_indent);
buf.push("<td>\n          ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"btn btn-danger remove-row\">-</div>\n        ");
buf.push.apply(buf, jade_indent);
buf.push("</td>\n      ");
buf.push.apply(buf, jade_indent);
buf.push("</tr>");
}
else
{
buf.push("\n      ");
buf.push.apply(buf, jade_indent);
buf.push("<tr>\n        ");
buf.push.apply(buf, jade_indent);
buf.push("<td>");
// iterate sub_fields
;(function(){
  var $$obj = sub_fields;
  if ('number' == typeof $$obj.length) {

    for (var sub_field_name = 0, $$l = $$obj.length; sub_field_name < $$l; sub_field_name++) {
      var sub_field = $$obj[sub_field_name];

jade_indent.push('          ');
jade_mixins["repeater_row"](name, sub_field_name, sub_field, i);
jade_indent.pop();
    }

  } else {
    var $$l = 0;
    for (var sub_field_name in $$obj) {
      $$l++;      var sub_field = $$obj[sub_field_name];

jade_indent.push('          ');
jade_mixins["repeater_row"](name, sub_field_name, sub_field, i);
jade_indent.pop();
    }

  }
}).call(this);

buf.push("\n        ");
buf.push.apply(buf, jade_indent);
buf.push("</td>\n        ");
buf.push.apply(buf, jade_indent);
buf.push("<td>\n          ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"btn btn-danger remove-row\">-</div>\n        ");
buf.push.apply(buf, jade_indent);
buf.push("</td>\n      ");
buf.push.apply(buf, jade_indent);
buf.push("</tr>");
}
buf.push("\n    ");
buf.push.apply(buf, jade_indent);
buf.push("</table>\n  ");
buf.push.apply(buf, jade_indent);
buf.push("</div>\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-footer overflow-hidden\">\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"col-xs-1 pull-right\">\n      ");
buf.push.apply(buf, jade_indent);
buf.push("<div id=\"add-row\"" + (jade.attr("data-last-index", "" + (repeater_length) + "", true, false)) + " class=\"btn btn-success\">+</div>\n    ");
buf.push.apply(buf, jade_indent);
buf.push("</div>\n  ");
buf.push.apply(buf, jade_indent);
buf.push("</div>\n");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
};
jade_mixins["dynamic_content"] = jade_interp = function(name, attr, value, sub_fields){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("\n");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel panel-default\">\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-heading\">" + (jade.escape((jade_interp = attr.cms && attr.cms.label || name) == null ? '' : jade_interp)) + " " + (jade.escape((jade_interp = attr.required ? '*' : '') == null ? '' : jade_interp)) + " :</div>\n  ");
buf.push.apply(buf, jade_indent);
buf.push("<div class=\"panel-body\">\n    ");
buf.push.apply(buf, jade_indent);
buf.push("<div" + (jade.attr("data-model-attr", "" + (JSON.stringify(attr)) + "", true, false)) + (jade.attr("data-sub-fields", sub_fields, true, false)) + (jade.attr("id", name, true, false)) + " class=\"dynamic_content_field\">");
if ( sub_fields)
{
var model = value;
// iterate sub_fields
;(function(){
  var $$obj = sub_fields;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var row = $$obj[$index];

var value = model && model[row.key_id] || null;
jade_indent.push('      ');
jade_mixins["input"](name+"["+row.key_id+"]", {cms: {label: row.label}},"text",value);
jade_indent.pop();
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var row = $$obj[$index];

var value = model && model[row.key_id] || null;
jade_indent.push('      ');
jade_mixins["input"](name+"["+row.key_id+"]", {cms: {label: row.label}},"text",value);
jade_indent.pop();
    }

  }
}).call(this);

}
buf.push("\n    ");
buf.push.apply(buf, jade_indent);
buf.push("</div>\n  ");
buf.push.apply(buf, jade_indent);
buf.push("</div>\n");
buf.push.apply(buf, jade_indent);
buf.push("</div>");
};
switch (element){
case 'input':
jade_indent.push('');
jade_mixins["input"](name, attr, type, value);
jade_indent.pop();
  break;
case 'datetime':
jade_indent.push('');
jade_mixins["datetime"](name, attr, value);
jade_indent.pop();
  break;
case 'date':
jade_indent.push('');
jade_mixins["date"](name, attr, value);
jade_indent.pop();
  break;
case 'select':
jade_indent.push('');
jade_mixins["select"](name, attr, options, value);
jade_indent.pop();
  break;
case 'checkbox':
jade_indent.push('');
jade_mixins["checkbox"](name, attr, value);
jade_indent.pop();
  break;
case 'textarea':
jade_indent.push('');
jade_mixins["textarea"](name, attr, value);
jade_indent.pop();
  break;
case 'combo':
jade_indent.push('');
jade_mixins["combo"](name, attr, options, value);
jade_indent.pop();
  break;
case 'repeater':
jade_indent.push('');
jade_mixins["repeater"](name, attr, sub_fields, value);
jade_indent.pop();
  break;
case 'dynamic_content':
jade_indent.push('');
jade_mixins["dynamic_content"](name, attr, value, sub_fields);
jade_indent.pop();
  break;
}}.call(this,"JSON" in locals_for_with?locals_for_with.JSON:typeof JSON!=="undefined"?JSON:undefined,"attr" in locals_for_with?locals_for_with.attr:typeof attr!=="undefined"?attr:undefined,"element" in locals_for_with?locals_for_with.element:typeof element!=="undefined"?element:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"options" in locals_for_with?locals_for_with.options:typeof options!=="undefined"?options:undefined,"sub_fields" in locals_for_with?locals_for_with.sub_fields:typeof sub_fields!=="undefined"?sub_fields:undefined,"type" in locals_for_with?locals_for_with.type:typeof type!=="undefined"?type:undefined,"value" in locals_for_with?locals_for_with.value:typeof value!=="undefined"?value:undefined));;return buf.join("");
};

function getModelDynamicFields(model) {
    var API_URL = "/admin/get_dynamic_fields/";
    var p = jQuery.Deferred();

    console.log("Querying Model "+model+" in route: "+API_URL+model);
    $.get(API_URL+model).done(function (model) {
        p.resolve(model);
    }).fail(function (err) {
        p.reject(err);
    })
    return p.promise();
}
if(typeof module != "undefined")
    module.exports = getModelDynamicFields;
jQuery(function ($) {
    DynamicFields();
});

function DynamicFields() {
    if($(".dynamic_content_field").length > 0)
    {
        $(".dynamic_content_field").each(function (i, elem) {

            var dynamic_field_id = $(elem).attr("id");
            var attr = JSON.parse($(elem).attr("data-model-attr"));
            var subfields_attr = attr.cms.fields_attr;
            //query.model query.what
            if(typeof SelectizeEvents == "object")
            {
                SelectizeEvents.on(attr.cms.based_on+"_change", function (target) {
                    if($(elem).length > 0)
                        getModelDynamicFields($(target).attr("data-model-name")+"/"+target.value).then(function (model) {
                            var fields = model && model[subfields_attr] || false;
                            if(fields) {
                                $(elem).closest(".panel.panel-default").replaceWith(window.Templates["partials/forms"]({element:'dynamic_content',name: dynamic_field_id,attr:attr,sub_fields: fields}));
                                DynamicFields();
                            }
                            else
                                $(elem).empty();
                        })
                })
            }
        })
    }
}
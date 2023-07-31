$("form").submit(function (e) {
    e.preventDefault();

    var parsed_data = pruneEmpty($(this).serializeObject());

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(parsed_data),
        url: $(this).attr("action"),
        method: $(this).attr("method"),
        beforeSend: function () {
            $("button[type=submit]").button('loading');

            $('.help-block').remove();
            $('.has-error').each(function () {
                $(this).removeClass("has-error");
            })
        },
        success: function () {
            $("button[type=submit]").button("reset");
            if($('form').is("[data-onSuccessRedirectTo]"))
                window.location = $('form').attr('data-onSuccessRedirectTo');
        },
        error: function (xhr, status, err) {
            if(xhr.responseJSON && xhr.responseJSON.message) {
                $("button[type=submit]").button('error');
                $.each(xhr.responseJSON.invalidAttributes, function (attr_name, messages) {
                    $('#'+attr_name).closest(".input-group").after("<div class='help-block'>"+messages.map(function (item) {
                              return item.message;
                            }).join(", ")+"</div>")
                    $('#'+attr_name).closest(".form-group").addClass("has-error")
                })
            }
        },
        complete: function (xhr, status, err) {
          setTimeout(function () {
            $("button[type=submit]").button('reset');
          },1000)
        }
    })

    return false;
})

function pruneEmpty(obj) {
    return function prune(current) {
        _.forOwn(current, function (value, key) {
            if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
                (_.isString(value) && _.isEmpty(value)) ||
                (_.isObject(value) && _.isEmpty(prune(value)))) {

                delete current[key];
            }
        });
        // remove any leftover undefined values from the delete
        // operation on an array
        if (_.isArray(current)) _.pull(current, undefined);

        return current;

    }(_.cloneDeep(obj));  // Do not modify the original object, create a clone instead
}

(function($){
    $.fn.serializeObject = function(){

        var self = this,
            json = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push":     /^$/,
                "fixed":    /^\d+$/,
                "named":    /^[a-zA-Z0-9_]+$/
            };


        this.build = function(base, key, value){
            base[key] = value;
            return base;
        };

        this.push_counter = function(key){
            if(push_counters[key] === undefined){
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), function(){

            // skip invalid keys
            if(!patterns.validate.test(this.name)){
                return;
            }

            var k,
                keys = this.name.match(patterns.key),
                merge = this.value,
                reverse_key = this.name;

            while((k = keys.pop()) !== undefined){

                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                // push
                if(k.match(patterns.push)){
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }

                // fixed
                else if(k.match(patterns.fixed)){
                    merge = self.build([], k, merge);
                }

                // named
                else if(k.match(patterns.named)){
                    merge = self.build({}, k, merge);
                }
            }

            json = $.extend(true, json, merge);
        });

        return json;
    };
})(jQuery);
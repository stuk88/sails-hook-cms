$(document).ready(function(){
    //$('[date-time-picker]').datetimepicker({format:'YYYY-MM-DD hh:mm:ss'});
    //$('[date-time]').datetimepicker({format:'YYYY-MM-DD'});
    $('.selectize').each(function(elem) {

        $(this).selectize({
            labelField: 'name',
            searchField: ['name'],
            options: JSON.parse($(this).attr("data-options"))
        });
    })

});
$(document).ready(function(){
    $('[date-time-picker]').datetimepicker({format:'MM-DD-YYYY hh:mm'});
    $('[date-picker]').datetimepicker({format:'MM-DD-YYYY'});
    $('.selectize').each(function(elem) {

        $(this).selectize({
            labelField: 'title',
            searchField: ['title'],
            options: JSON.parse($(this).attr("data-options")),
            // plugins: ['tree']
        });
    })

    // $('.selectize_select').selectize({
    //   plugins: ['tree']
    // });

});

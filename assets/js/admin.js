$(document).ready(function(){
    $('[date-time-picker]').datetimepicker({format:'YYYY-MM-DD hh:mm:ss'});
    $('[date-time]').datetimepicker({format:'YYYY-MM-DD'});
    $('.selectize').each(function(elem) {

        $(this).selectize({
            labelField: 'title',
            searchField: ['title'],
            options: JSON.parse($(this).attr("data-options")),
            plugins: ['tree']
        });
    })

    $('.selectize_select').selectize({
      plugins: ['tree']
    });

});
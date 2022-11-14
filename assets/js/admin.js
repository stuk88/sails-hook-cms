$(document).ready(function(){
    $('[date-time-picker]').datetimepicker({format:'MM-DD-YYYY hh:mm'});
    $('[date-picker]').datetimepicker({format:'MM-DD-YYYY'});
    $('.selectize').each(function(elem) {

        let value = JSON.parse($(this).attr('value'));

        let $selectized = $(this).selectize({
            labelField: 'title',
            searchField: ['title'],
            options: JSON.parse($(this).attr("data-options")),
            plugins: ['tree']
        });

        $selectized[0].selectize.setValue(value);
    })

    $('.selectize_select').selectize({
      plugins: ['tree']
    });

});

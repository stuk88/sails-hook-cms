if(typeof Evemit === 'function') {
    window.SelectizeEvents = new Evemit();
}

$(document).ready(function(){
    // Sidebar drawer toggle (uses Bootstrap modal-backdrop)
    var $sidebar = $('#sidebarDrawer');
    var $backdrop = null;

    function openSidebar() {
        $sidebar.addClass('open');
        $backdrop = $('<div class="modal-backdrop fade in sidebar-backdrop"></div>').appendTo('body');
        $backdrop.on('click', closeSidebar);
    }

    function closeSidebar() {
        $sidebar.removeClass('open');
        if ($backdrop) {
            $backdrop.remove();
            $backdrop = null;
        }
    }

    $('#sidebarToggleBtn').on('click', openSidebar);
    $('#sidebarCloseBtn').on('click', closeSidebar);

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') closeSidebar();
    });
    $('[date-time]').datetimepicker({format:'YYYY-MM-DD hh:mm:ss'});
    $('[date]').datetimepicker({
        format:'YYYY-MM-DD'
    }).on('dp.change',function(e) {
        if( $('input[name="start_date"]').val() != "" &&  $('input[name="end_date"]').val() != "" ) {
            var start_date = moment($('input[name="start_date"]').val());
            var end_date = moment($('input[name="end_date"]').val());
            var calculated_days = end_date.diff(start_date, "days");
            if($(".calculated_days:not(:empty)").length > 0)
            {
                $(".calculated_days:not(:empty)").empty();
            }
            if($(".calculated_days").length == 0) {
                $('input[name="billed_days"]').after("<div class='calculated_days'></div>")
            }
            $('.calculated_days').text(" Calculated Days: "+ calculated_days);
        }
    })
    ;
    $('.selectize').each(function(elem) {

        var selectize = $(this).selectize({
            labelField: 'name',
            searchField: ['name'],
            options: JSON.parse($(this).attr("data-options"))
        })
        selectize.on("change", function(e) {
            if(typeof SelectizeEvents === 'object'){
                SelectizeEvents.emit($(e.target).attr("id")+"_change", e.target)
            }
        });
    })

    var selectize_select = $('.selectize_select').selectize();
    selectize_select.on("change", function(e) {
        if(typeof SelectizeEvents === 'object'){
            SelectizeEvents.emit($(e.target).attr("id")+"_change", e.target)
        }
    });

});

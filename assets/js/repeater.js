(function ($) {

    $.fn.repeater = function(options) {

        this.config = $.extend({
            addRowBtnSelector: '#add-row',
            removeRowBtnSelector: '.remove-row',
            last_row_index: 0
        }, options);

        this.RowTemplate = "";

        this.init = function() {
            if($(this).length == 0)
                return;
            this.getLastIndex();
            this.saveLastRowAsTemplate();
            this.activeEventListeners();
        }

        this.activeEventListeners = function() {
            var self = this;
            $(this.config.addRowBtnSelector).on("click", function (e) {
                e.preventDefault();
                self.addRow();
            });

            $("body").on("click", this.config.removeRowBtnSelector, function (e) {
                e.preventDefault();
                self.removeRow(this);
            })
        }

        this.addRow = function() {
            this.config.last_row_index++;
            $(this).append(this.RowTemplate.replace(new RegExp("{rowIndex}","g"),this.config.last_row_index));
        }

        this.removeRow = function(elem) {
            $(elem).parents("tr").remove();
        }

        this.getLastIndex = function() {
            if(this.config.last_row_index == 0) {
                this.config.last_row_index = $(this.config.addRowBtnSelector).attr('data-last-index');
            }
            return this.config.last_row_index;
        }

        this.saveLastRowAsTemplate = function() {
            var row_html = $("tr:last-of-type",this).clone().prop('outerHTML');
            row_html = row_html.replace(new RegExp(`\[${this.getLastIndex()}\]`,"g"),"{rowIndex}");
            this.RowTemplate = row_html;
        }

        this.init();

        return this;
    }

    $(".repeater ").repeater();
}(jQuery))

//selectize-tree.js
//edward kim
//eddy.kim@dollarshaveclub.com
//dollar shave club
//select an item from from array of json that represents an n-tree data structure
// Sample data:
// [
//  { "id": 1, "name": "Support", "parent_id": null },
//  { "id": 2, "name": "Sales", "parent_id": null },
//  { "id": 3, "name": "Operator", "parent_id": null },
//  { "id": 4, "name": "New Issue", "parent_id": 1 },
//  { "id": 5, "name": "Existing Issue", "parent_id": 1 },
//  { "id": 6, "name": "Billing Issue", "parent_id": 4 },
//  { "id": 7, "name": "Product Issue", "parent_id": 4 },
//  { "id": 8, "name": "Other Issue", "parent_id": 4 },
//  { "id": 9, "name": "New Customer", "parent_id": 2 },
//  { "id": 10, "name": "Existing Customer", "parent_id": 2 },
// ]
//


(function() {
  Selectize.define('tree', function(options) {
    var self = this;
    if (this.settings.mode !== 'single') return;


    self.collection = $.extend({}, self.options)


    var defaultSettings = {
      parentField: 'parent_id',
      sortField: [{
        field: 'order',
        direction: 'desc'
      }, {
        field: self.settings.valueField,
        direction: 'asc'
      }],
      onType: function(string) {
        console.log(string)
        self.setAllOptions();
      },
      labelSerializer: function(string) {
        return string;
      },
      render: {
        backOptionLabel: '<- Back',
        parentOption: function(item, escape) {
          return '<div>' + self.settings.labelSerializer(item[self.settings.labelField]) + ' -></div>'
        },
        childOption: function(item, escape) {
          return '<div>' + self.settings.labelSerializer(item[self.settings.labelField]) + '</div>'
        },
        option: function(item, escape) {
          var childRecordExists = self.findItem(self.collection, settings.parentField, item[self.settings.valueField]);
          if (childRecordExists) {
            return self.settings.render.parentOption(item, escape);
          } else {
            return self.settings.render.childOption(item, escape);
          }
        },
        item: function(item, escape) {
          return '<div>' + self.settings.labelSerializer(item[self.settings.labelField]) + '</div>'
        }
      }

    }


    var settings = self.settings = $.extend(true, self.settings, defaultSettings, options);



    //Return an element from an array value of associated key matches
    self.findItem = function(array, key, value) {
      var result = null;
      $.each(array, function(index, element) {
        if ('' + element[key] === '' + value) {
          result = element;
          return false;
        }
      })
      return result;
    }

    //set the options menu filtered by common parent id, which gives all items in current node
    self.setAllOptions = function() {
      self.clearOptions();
      $.each(self.collection, function(index, element) {
        self.addOption(element);
      })
    }


    //set the options menu filtered by common parent id, which gives all items in current node
    self.setOptionsByParentValue = function(parentId) {
      self.clearOptions();
      var backOption = {};
      var parentRecord = self.findItem(self.collection, settings.valueField, parentId);

      backOption[settings.labelField] = settings.render.backOptionLabel;
      if (parentRecord) {
        backOption[settings.valueField] = 'back-' + parentId;
        backOption['back'] = true;
        self.addOption(backOption);
      }
      $.each(self.collection, function(index, element) {
        if ('' + element[settings.parentField] === '' + parentId) {
          self.addOption(element);
        }
      })
    }

    self.on('change', function(selectedValue) {
      if (selectedValue.indexOf('back') > -1) {
        //traverse to parent heiarchy
        var actualSelectedValue = selectedValue.split('-')[1];
        var selectedRecord = self.findItem(self.collection, settings.valueField, actualSelectedValue);

        self.setOptionsByParentValue(selectedRecord[settings.parentField]);
        self.refreshOptions();
      } else {

        var selectedRecord = self.findItem(self.collection, settings.valueField, selectedValue);
        var childRecordExists = self.findItem(self.collection, settings.parentField, selectedValue);

        //self.currentSelectionRecord = selectedRecord;

        if (childRecordExists) {
          //if child records exists, traverse to child
          self.setOptionsByParentValue(selectedValue);
          self.refreshOptions();
        }
      }


    })




    this.setup = (function() {
      var original = self.setup;
      return function() {
        original.apply(this, arguments);
      };
    })();



  });
})()
module.exports = {
    hasJsonEditor: function(attributes) {
        return attributes.some(function(attribute) {
            return attribute.attrName === 'jsonEditor';
        });
    }
}
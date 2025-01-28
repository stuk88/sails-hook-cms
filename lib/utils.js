module.exports = {
    hasJsonEditor: function(attributes) {
        return Object.values(attributes).some(function(attribute) {
            return attribute.type === 'json';
        });
    }
}

module.exports = function(app) {
    app.get('/', require('./main/index').get);

};

exports.get = function(req, res) {
    res.render('index', { what: 'best', who: 'me' });
};
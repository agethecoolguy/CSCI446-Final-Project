/* GET 'about us' page */
module.exports.home = function(req, res) {
    res.render('generic-text', {
        title: 'Barter',
        content: 'Barter some cards, yo.'
    });
};
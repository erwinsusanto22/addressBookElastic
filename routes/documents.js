var express = require('express');
var router = express.Router();

var elastic = require('../elasticsearch');

// GET all contacts
// NOT: defined pageSize and offset by page number; implement query search?
router.get('/', function(req, res){
  elastic.getAll().then(function (result) { res.json(result); });
});

// GET a unique name
router.get('/:input', function (req, res) {
  elastic.getContact(req.params.input).then(function (result) { res.json(result); });
    //res.render('index', { title: req.params.input });
});

//POST document : create a new contact with the name and default phone number and homeAddress IF user does not input their phoneNumber and homeAddress as key value parameters
// NOT: check unique name and upper bound phoneNumber
router.post('/:input', function (req, res) {
  let phoneNumber = '000-000-0000';
  let homeAddress = 'undefined';
  phoneNumber = req.query.phoneNumber;
  homeAddress = req.query.homeAddress;
  var body = {
    title: req.params.input,
    phoneNumber: phoneNumber,
    homeAddress: homeAddress
  }
  elastic.addContact(body).then(function (result) { res.json(result); });
});

// DELETE document
router.delete('/:input', function(req,res){
    elastic.deleteContact(req.params.input).then(function(){res.send('DELETE SUCCEEED')});
});

//UPDATE contact
// NOT: not able to update the parameters
router.put('/:input', function (req, res) {
  let phoneNumber = req.query.phoneNumber;
  let homeAddress = req.query.homeAddress;
  var body = {
    title: req.params.input,
    phoneNumber: phoneNumber,
    homeAddress: homeAddress
  }
  elastic.updateContact(req.params.input).then(function (result) { res.json(result); });
});

module.exports = router;

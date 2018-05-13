var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
});

var indexName = 'randomindex';

// delete an index
function deleteIndex() {
  return elasticClient.indices.delete({
    index: indexName
  });
}
exports.deleteIndex = deleteIndex;

// initialize new index
function initIndex() {
  return elasticClient.indices.create({
    index: indexName
  });
}
exports.initIndex = initIndex;

// check if the index already exists
function indexExists() {
  return elasticClient.indices.exists({
    index: indexName
  });
}
exports.indexExists = indexExists;

// create mapping
function initMapping() {
  return elasticClient.indices.putMapping({
    index: indexName,
    type: 'contact',
    body: {
      properties: {
        title: { type: 'text' },
        phoneNumber: { type: 'text' },
        homeAddress: { type: 'text' }
      }
    }
  });
}
exports.initMapping = initMapping;

// add contact
// PUT UNIQUE RESTRICTION FOR NAME
function addContact(contact) {
  return elasticClient.index({
    index: indexName,
    type: 'contact',
    body: {
      title: contact.title,
      phoneNumber: contact.phoneNumber,
      homeAddress: contact.homeAddress
    }
  });
}
exports.addContact = addContact;

// return contact by a unique name (input)
function getContact(input) {
  return elasticClient.search({
    index: indexName,
    type: 'contact',
    body: {
      query: {
        match: {
          title: input
        }
      }
    }
  });
}
exports.getContact = getContact;

//return list of all contact
function getAll(input) {
  return elasticClient.search({
    index: indexName,
    type: 'contact',
    body: {
      query: {
        match_all: {}
      }
    }
  });
}
exports.getAll = getAll;

//delete contact by a unique name (input)
// if not found return error
function deleteContact(input){
  return elasticClient.deleteByQuery({
    index: indexName,
    body: {
      query: {
        term: {
          title: input
        }
      }
    }
  });
}
exports.deleteContact = deleteContact;

//update the contact by a unique name
// still not working; the script does not works
//https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-scripting-using.html
function updateContact(input){
  return elasticClient.updateByQuery({
    index: indexName,
    body: {
      query: {
        match: {
          title: input
        }/*,
        script: {
          lang: "painless",
          //source: "phoneNumber= '1111111111'"
        }*/
      },
      phoneNumber: input.phoneNumber,
      homeAddress: input.homeAddress
    }
  });
}
exports.updateContact = updateContact;

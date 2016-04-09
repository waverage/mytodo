( function() {
'use strict';
var express = require('express');
var tasks = require('../models/tasks');
var router = express.Router();

/* GET home page. */
router.get( '/', function(req, res, next) {
    tasks.list( function(data) {
        res.render( 'index', { data: data } );
    } );
} );

router.post( '/add', function(req, res) {
    tasks.add( {
        id: req.body.id,
        text: req.body.text,
        date: req.body.date,
        type: 'task'
    },
    function() {
        res.end();
    } );
} );

router.post( '/del', function(req, res) {
    tasks.del( req.body.id, function() {
        res.end();
    } );
} );

router.post( '/update', function(req, res) {
    tasks.update( {
        id: req.body.id,
        text: req.body.text,
        date: req.body.date,
        type: 'task'
    },
    function() {
        res.end();
    } );
} );

module.exports = router;
} )();
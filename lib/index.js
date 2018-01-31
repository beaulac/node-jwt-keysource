'use strict';

exports.BasicKeySource = require('./BasicKeySource').BasicKeySource;
exports.MultiKeySource = require('./MultiKeySource').MultiKeySource;
exports.UriKeySource = require('./UriKeySource').UriKeySource;

exports.buildKeyProvider = require('./middleware').buildKeyProvider;

'use strict'

const queryStirng = require("querystring");
const got = require("got");
const baseUrl = 'https://www.googleapis.com/';

require("setimmediate");

module.exports = class ImageSearch {

    constructor(cseId, apiKey) {
        this.cseId = cseId;
        this.apiKey = apiKey;
    }

    search(query, options) {
        if (!this.cseId || !this.apiKey) {
            throw new Error('Key is required.');
        }
        if (!query) {
            throw new Error('Expected a query');
        }
        var keys = {
            cseId: this.cseId,
            apiKey: this.apiKey
        };
        return got(baseUrl + 'customsearch/v1?' + getOptions(query, options, keys), {
                json: true
            })
            .then(buildResult)
            .catch((err) => {
                console.log('ERR: ', err);
                return err;
            });
    }
};

/* private helper function */
function getOptions(query, options, keys) {
    if (!options) {
        options = {};
    }
    let result = {
        q: query.replace(/\s/g, '+'),
        searchType: 'image',
        cx: keys.cseId,
        key: keys.apiKey
    };
    if (options.page) {
        result.start = options.page;
    }
    return queryStirng.stringify(result);
}

function buildResult(res) {
    return (res.body.items || []).map((item) => {
        return {
            'url': item.link,
            'thumbnail': item.image.thumbnailLink,
            'snippet': item.title,
            'context': item.image.contextLink
        };
    });
}

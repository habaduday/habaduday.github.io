---
layout: null
sitemap:
exclude: 'yes'
---

class API {
    constructor(appId) {
        this.appId = appId;
        this.cachedSuggestionsKey = 'cached_suggestions';

        const data = localStorage.getItem(this.cachedSuggestionsKey);
        if (data === null) {
            let stubData = {
                'bird': Math.floor(Math.random() * 50) + 10,
                'human': Math.floor(Math.random() * 40) + 5,
                'game': Math.floor(Math.random() * 30) + 1,
                'just a random letters': Math.floor(Math.random() * 20) + 1,
            };
            localStorage.setItem(this.cachedSuggestionsKey, JSON.stringify(stubData));
        }

        this.logPrefix = '[API Stub ' + this.appId +']';
    }

    async postSuggestions(suggestionsArray) {
        console.log(this.logPrefix, 'POST /suggestions', { suggestions: suggestionsArray });

        // Simulate random success/failure
        await this._delay(300);
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
            const data = localStorage.getItem(this.cachedSuggestionsKey);
            let parsedData = JSON.parse(data);
            Object.keys(suggestionsArray).forEach(el => parsedData[el] = (parsedData[el] ?? 0) + 1);
            localStorage.setItem(this.cachedSuggestionsKey, JSON.stringify(parsedData));
            return {
                status: 204,
                ok: true
            };
        } else {
            return {
                status: 500,
                ok: false,
                error: 'Simulated server error'
            };
        }
    }

    async fetchSuggestions(limit = 100) {
        console.log(this.logPrefix, 'GET /suggestions?limit=' + limit);

        // Simulate random success/failure
        await this._delay(300);
        const isSuccess = Math.random() > 0.05;

        if (isSuccess) {
            const data = localStorage.getItem(this.cachedSuggestionsKey);
            const stubData = JSON.parse(data);
            return {
                status: 200,
                ok: true,
                data: stubData
            };
        } else {
            return {
                status: 500,
                ok: false,
                error: 'Simulated fetch error'
            };
        }
    }

    async _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
---
layout: null
sitemap:
exclude: 'yes'
---

class Storage {
    static KEYS = {
        APP_ID: 'app_id',
        USER_SUGGESTIONS: 'user_suggestions',
        MAPPING: 'mapping'
    };

    // ========== APP ID ==========

    static keyAppId() {
        return this.KEYS.APP_ID;
    }

    static getAppId() {
        return localStorage.getItem(this.KEYS.APP_ID)
    }

    static setAppId(value) {
        try {
            localStorage.setItem(this.KEYS.APP_ID, value);
            return true;
        } catch (e) {
            console.error('Failed to save app id:', e);
            return false;
        }
    }

    // ========== USER_SUGGESTIONS ==========

    static getUserSuggestions() {
        const data = localStorage.getItem(this.KEYS.USER_SUGGESTIONS);
        if (!data) {
            return {};
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Failed to parse user suggestions:', e);
            return {};
        }
    }

    static setUserSuggestions(suggestionsSet) {
        try {
            localStorage.setItem(this.KEYS.USER_SUGGESTIONS, JSON.stringify(suggestionsSet));
            return true;
        } catch (e) {
            console.error('Failed to save user suggestions:', e);
            return false;
        }
    }

    static addUserSuggestion(suggestion) {
        const current = this.getUserSuggestions();
        current[suggestion] = true;
        return this.setUserSuggestions(current);
    }

    static clearUserSuggestions() {
        if (!this.hasSuggestions()) {
            return true
        }
        return this.setUserSuggestions({});
    }

    static swapAndClearUserSuggestions() {
        const current = this.getUserSuggestions();
        this.clearUserSuggestions();
        return current;
    }

    static mergeUserSuggestions(suggestionsArray) {
        const current = this.getUserSuggestions();
        const merged = {};
        current.forEach(key => merged[key] = true);
        suggestionsArray.forEach(el => merged[el] = true);
        return this.setUserSuggestions(merged);
    }

    static hasSuggestions() {
        return localStorage.getItem(this.KEYS.USER_SUGGESTIONS) !== null
    }

    // ========== MAPPING ==========

    static getMapping() {
        const data = localStorage.getItem(this.KEYS.MAPPING);
        if (!data) {
            return null;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Failed to parse mapping:', e);
            return null;
        }
    }

    static setMapping(mappingObject) {
        try {
            localStorage.setItem(this.KEYS.MAPPING, JSON.stringify(mappingObject));
            return true;
        } catch (e) {
            console.error('Failed to save mapping:', e);
            return false;
        }
    }

    static clearMapping() {
        localStorage.removeItem(this.KEYS.MAPPING);
    }

    static hasMapping() {
        return this.getMapping() !== null;
    }
}
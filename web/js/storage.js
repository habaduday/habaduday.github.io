---
layout: null
sitemap:
exclude: 'yes'
---

class Storage {
    static KEYS = {
        USER_SUGGESTIONS: 'user_suggestions',
        MAPPING: 'mapping'
    };

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

    static setUserSuggestions(suggestionsArray) {
        try {
            localStorage.setItem(this.KEYS.USER_SUGGESTIONS, JSON.stringify(suggestionsArray));
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
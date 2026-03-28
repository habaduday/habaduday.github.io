---
layout: null
sitemap:
exclude: 'yes'
---

class Intervals {
    constructor() {
        this.sendInterval = null;
        this.fetchInterval = null;
        this.isSending = false;
        this.api = new API();
    }

    start(intervalMs = 30000) {
        this.stop();

        this.sendInterval = setInterval(() => {
            this._handleSend();
        }, intervalMs);

        this.fetchInterval = setInterval(() => {
            this._handleFetch();
        }, intervalMs);

        console.info('Intervals started:', intervalMs);
        this._handleSend();
        this._handleFetch();
    }

    stop() {
        if (this.sendInterval) {
            clearInterval(this.sendInterval);
            this.sendInterval = null;
        }
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval);
            this.fetchInterval = null;
        }
        console.info('Intervals stopped');
    }

    async _handleSend() {
        if (this.isSending) {
            console.log('Send already in progress, skipping...');
            return;
        }

        this.isSending = true;
        try {
            const toSend = Storage.swapAndClearUserSuggestions();
            if (Object.keys(toSend).length === 0) {
                this.isSending = false;
                return;
            }

            console.log(`Sending suggestions:`, toSend);
            const response = await this.api.postSuggestions(toSend);
            if (response.ok) {
                console.log('Send successful');
            } else {
                Storage.mergeUserSuggestions(toSend);
                console.error('Send failed:', response.error);
            }
        } catch (error) {
            console.error('Error during send:', error);
        } finally {
            this.isSending = false;
        }
    }

    async _handleFetch() {
        try {
            const response = await this.api.fetchSuggestions(100);
            if (response.ok && response.data) {
                Storage.setMapping(response.data);
                console.log('Mapping fetched successfully:', response.data);
            } else {
                console.error('Fetch failed:', response.error);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }
}
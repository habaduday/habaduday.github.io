---
layout: null
sitemap:
exclude: 'yes'
---

class TagCloud {
    static render(mapping, containerElement) {
        if (!containerElement) {
            console.error('Container element not found');
            return;
        }

        containerElement.innerHTML = '';

        if (!mapping || Object.keys(mapping).length === 0) {
            this._showEmptyState(containerElement);
            return;
        }

        const words = Object.entries(mapping).map(([word, count]) => ({
            word,
            count: count || 1
        }));

        const maxCount = Math.max(...words.map(w => w.count));
        const minCount = Math.min(...words.map(w => w.count));

        words.forEach(({ word, count }) => {
            const tag = this._createTagElement(word, count, maxCount, minCount);
            containerElement.appendChild(tag);
        });
    }

    static _createTagElement(word, count, maxCount, minCount) {
        const span = document.createElement('span');
        span.textContent = word;

        const fontSize = this._calculateFontSize(count, maxCount, minCount);
        const hue = (count / maxCount) * 360;
        // const rotation = Math.random() * 30 - 15;
        // const rotation = Math.random() < 0.5? 0 : 90;
        const rotation = 0;

        span.style.fontSize = `${fontSize}px`;
        span.style.color = `hsl(${hue}, 70%, 50%)`;
        span.style.transform = `rotate(${rotation}deg)`;
        span.style.display = 'inline-block';
        span.style.margin = '8px';
        span.style.padding = '4px 8px';
        span.style.cursor = 'default';
        span.style.transition = 'all 0.2s';
        span.style.fontWeight = '500';

        span.title = `Count: ${count}`;

        return span;
    }

    static _calculateFontSize(count, maxCount, minCount) {
        const MIN_SIZE = 16;
        const MAX_SIZE = 56;

        if (maxCount === minCount) {
            return MIN_SIZE + (MAX_SIZE - MIN_SIZE) / 2;
        }

        const ratio = (count - minCount) / (maxCount - minCount);
        return MIN_SIZE + ratio * (MAX_SIZE - MIN_SIZE);
    }

    static _showEmptyState(containerElement) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = 'No mapping data available. Waiting for fetch...';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = '#999';
        emptyMessage.style.padding = '40px';
        emptyMessage.style.fontSize = '14px';
        containerElement.appendChild(emptyMessage);
    }
}
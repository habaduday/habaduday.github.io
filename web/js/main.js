---
layout: null
sitemap:
exclude: 'yes'
---

document.addEventListener('DOMContentLoaded', () => {
    const intervalMs = 10000;  // 30 sec

    const mobileMenuButton = document.querySelector('.btn-mobile-menu');
    const mobileMenuIcon = document.querySelector('.btn-mobile-menu__icon');
    const landing = document.querySelector('.landing');
    const suggestionInput = document.querySelector('input.panel-cover__description');
    const suggestionButtons = document.querySelectorAll('.suggestion-button');
    const suggestionSendButtons = document.querySelectorAll('.suggestion-send-button');
    const panelCover = document.querySelector('.panel-cover');
    const panelCoverDescr = document.querySelector('p.panel-cover__description');
    const userImage = document.querySelector('.user-image');
    const navigationWrapper = document.querySelector('.navigation-wrapper');
    const contentWrapper = document.querySelector('.content-wrapper');
    const blogButton = document.querySelector('a.blog-button');

    const toggleSuggestion = (e) => {
        const elements = [panelCoverDescr, suggestionInput].concat(
            Array.from(suggestionButtons),
            Array.from(suggestionSendButtons),
        );
        elements.forEach(el => el.classList.toggle('hidden'));
    }

    const sendSuggestion = () => {
        if (suggestionInput.value !== '' && suggestionInput.value !== undefined) {
            Storage.addUserSuggestion(suggestionInput.value);
            console.info('Added suggestion:', suggestionInput.value);
            suggestionInput.value = '';
            return true
        }
        return false
    }

    suggestionButtons.forEach(
        btn => btn.addEventListener('click', (e) => {
            toggleSuggestion(e);
            suggestionInput.focus();
        })
    )

    suggestionSendButtons.forEach(
        btn => btn.addEventListener('click', (e) => {
            if (sendSuggestion()) {
                toggleSuggestion(e);
            }
        })
    )

    suggestionInput?.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            if (sendSuggestion()) {
                toggleSuggestion(e);
            }
        } else if (e.key === 'Escape') {
            toggleSuggestion(e);
        }
    })

    blogButton?.addEventListener('click', (e) => {
        if (panelCover.classList.contains('panel-cover--collapsed')) return

        const currentWidth = panelCover.offsetWidth
        if (currentWidth < 960) {
            panelCover.classList.add('panel-cover--collapsed');
            userImage.classList.add('user-image--collapsed');
            contentWrapper.classList.add('animated', 'slideInRight');
        } else {
            panelCover.style.maxWidth = `${currentWidth}px`;
            panelCover.animate(
                { maxWidth: '530px', width: '40%' },
                { duration: 400, easing: 'ease-out', fill: 'forwards' }
            );
        }
    })

    blogButton?.addEventListener('click', () => {
        landing.classList.add('hidden');
        navigationWrapper.classList.toggle('visible');
        mobileMenuIcon.classList.toggle('icon-list');
        mobileMenuIcon.classList.toggle('icon-x-circle');
        mobileMenuIcon.classList.toggle('animated');
        mobileMenuIcon.classList.toggle('fadeIn');
    })

    mobileMenuButton?.addEventListener('click', () => {
        navigationWrapper.classList.toggle('visible');
        navigationWrapper.classList.toggle('animated');
        navigationWrapper.classList.toggle('bounceInDown');
        mobileMenuIcon.classList.toggle('icon-list');
        mobileMenuIcon.classList.toggle('icon-x-circle');
        mobileMenuIcon.classList.toggle('animated');
        mobileMenuIcon.classList.toggle('fadeIn');
    })

    if (window.location.hash && window.location.hash === '#blog') {
        landing.classList.add('hidden');
        panelCover.classList.add('panel-cover--collapsed');
        userImage.classList.add('user-image--collapsed');
    }

    if (window.location.pathname !== '{{ site.baseurl }}/' && window.location.pathname !== '{{ site.baseurl }}/index.html') {
        landing.classList.add('hidden');
        panelCover.classList.add('panel-cover--collapsed');
        userImage.classList.add('user-image--collapsed');
    }

    const intervals = new Intervals();
    intervals.start(intervalMs);
    console.info('App initialized');
})
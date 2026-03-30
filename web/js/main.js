---
layout: null
sitemap:
exclude: 'yes'
---

document.addEventListener('DOMContentLoaded', () => {
    const intervalMs = 10000;

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
    const answersButtons = document.querySelectorAll('a.answers-button');
    const navigateButtons = document.querySelectorAll('a.navigate-button');

    const collapseButtons = [...navigateButtons, ...answersButtons];

    const collapsePanel = () => {
        panelCover.classList.add('panel-cover--collapsed');
        userImage.classList.add('user-image--collapsed');
    }

    const showContentItem = (selector) => {
        document.querySelectorAll('.content-item').forEach(el => el.classList.add('hidden'));
        const element = document.querySelector(selector);
        element.classList.remove('hidden');
        return element;
    }

    const toggleSuggestion = (e) => {
        const elements = [
            panelCoverDescr,
            suggestionInput,
            ...Array.from(suggestionButtons),
            ...Array.from(suggestionSendButtons),
        ];
        elements.forEach(el => el.classList.toggle('hidden'));
    }

    const enableAnswerButtons = () => {
        answersButtons.forEach(btn => btn.classList.remove('hidden'));
    }

    const sendSuggestion = () => {
        if (suggestionInput.value !== '' && suggestionInput.value !== undefined) {
            Storage.addUserSuggestion(suggestionInput.value);
            console.info('Added suggestion:', suggestionInput.value);
            suggestionInput.value = '';
            enableAnswerButtons();
            return true
        }
        return false
    }

    const renderAnswers = (container) => {
        const mapping = Storage.getMapping();
        TagCloud.render(mapping, container);
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
        showContentItem('.main-post-list');
    })

    answersButtons.forEach(
        btn => {
            btn?.addEventListener('click', (e) => {
                renderAnswers(showContentItem('.suggestions-tag-cloud'));
            })
        }
    )

    collapseButtons.forEach(btn => {
        btn?.addEventListener('click', (e) => {
            if (panelCover.classList.contains('panel-cover--collapsed')) return

            landing.classList.add('hidden');

            const currentWidth = panelCover.offsetWidth
            if (currentWidth < 960) {
                collapsePanel();
                contentWrapper.classList.add('animated', 'slideInRight');
            } else {
                panelCover.style.maxWidth = `${currentWidth}px`;
                panelCover.animate(
                    { maxWidth: '530px', width: '40%' },
                    { duration: 400, easing: 'ease-out', fill: 'forwards' }
                );
            }
        })
    })

    navigateButtons.forEach(btn => {
        btn?.addEventListener('click', () => {
            navigationWrapper.classList.toggle('visible');
            mobileMenuIcon.classList.toggle('icon-list');
            mobileMenuIcon.classList.toggle('icon-x-circle');
            mobileMenuIcon.classList.toggle('animated');
            mobileMenuIcon.classList.toggle('fadeIn');
        })
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
        collapsePanel();
        showContentItem('.main-post-list');
    }

    if (window.location.hash && window.location.hash === '#suggestions') {
        landing.classList.add('hidden');
        collapsePanel();
        renderAnswers(showContentItem('.suggestions-tag-cloud'));
    }

    if (
        window.location.pathname !== '{{ site.baseurl }}/'
        && window.location.pathname !== '{{ site.baseurl }}/index.html'
    ) {
        landing.classList.add('hidden');
        collapsePanel();
    }

    if (Storage.hasSuggestions()) {
        enableAnswerButtons();
    }

    let intervals = null;

    window.addEventListener('storage', (e) => {
        if (e.key === Storage.keyAppId()) {
            intervals?.stop();
            const api = new API(e.newValue);
            intervals = new Intervals(api);
            intervals.start(intervalMs);
            console.info('App reloaded');
        }
    })

    let appId = Storage.getAppId();
    if (appId === null) {
        appId = crypto.randomUUID().toString();
        Storage.setAppId(appId);
    }
    const api = new API(appId);
    intervals = new Intervals(api);
    intervals.start(intervalMs);

    console.info('App initialized');
})
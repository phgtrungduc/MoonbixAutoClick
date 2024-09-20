// ==UserScript==
// @name         PT Duc Moonbix
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Auto chơi game
// @match        https://www.binance.com/*
// @grant        GM_log
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    function log(message) {
        GM_log(`[Game Automation]: ${message}`);
        console.log(`[Game Automation]: ${message}`);
    }

    log('Bot starting...');

    function Clickxy(element) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            const clickEvent = new MouseEvent(eventType, {
                view: unsafeWindow,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
            });
            element.dispatchEvent(clickEvent);
        });
    }

    function startGame() {
        log('Attempting to start the game');
        const startButton = document.querySelector('.Game_entry__playBtn__1Gi2c');
        if (startButton) {
            log('Đã tìm thấy nút bắt đầu, nhấp để bắt đầu trò chơi...');
            Clickxy(startButton);
            setTimeout(playGame, 5000);
        } else {
            log('Không tìm thấy nút bắt đầu trò chơi');
        }
    }

    let playInterval;

    function playGame() {
        const canvas = document.querySelector('.canvas-wrapper canvas');
        if (canvas) {
            if (!playInterval) {
                playInterval = setInterval(() => {
                    if (document.querySelector('.canvas-wrapper canvas')) {
                        Clickxy(canvas);
                    } else {
                        clearInterval(playInterval);
                        playInterval = null;
                    }
                }, 1000);
            }
        } else {
            log('Canvas not found. Selector: .canvas-wrapper canvas');
        }
    }

    function findButtonByText(textArray) {
        const buttons = document.querySelectorAll('button');
        for (let button of buttons) {
            const buttonText = button.textContent.trim();
            if (textArray.some(text => buttonText.startsWith(text))) {
                return button;
            }
        }
        return null;
    }

    function checkScoreAndContinue() {
        const scoreElement = document.querySelector('.bn-flex.relative.flex-col.items-center');
        if (scoreElement) {
            const scoreText = scoreElement.querySelector('.text-5xl.font-semibold.text-white');
            if (scoreText) {
                const score = scoreText.textContent;
                log(`Bạn kiếm được ${score} điểm`);

                setTimeout(() => {
                    let continueButton = findButtonByText(['Chơi lại', 'Play Again']);
                    if (continueButton) {
                        log('Tìm thấy nút "Chơi lại", nhấp để tiếp tục...');
                        Clickxy(continueButton);
                    } else {
                        continueButton = findButtonByText(['Tiếp tục', 'Continue']);
                        if (continueButton) {
                            log('Tìm thấy nút "Tiếp tục", nhấp để tiếp tục...');
                            Clickxy(continueButton);
                        } else {
                            log('Không tìm thấy nút để tiếp tục chơi');
                        }
                    }
                }, 3000);
            }
        }
    }

    function monitorDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'subtree') {
                    const startButton = document.querySelector('.Game_entry__playBtn__1Gi2c');
                    if (startButton) {
                        log('Bắt đầu bắt đầu trò chơi...');
                        startGame();
                    }
                    const canvas = document.querySelector('.canvas-wrapper canvas');
                    if (canvas) {
                        log('Đang chuẩn bị chơi...');
                        playGame();
                    }
                    checkScoreAndContinue();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        log('DOM monitoring started');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', monitorDOM);
    } else {
        monitorDOM();
    }
})();
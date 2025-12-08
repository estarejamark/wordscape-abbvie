class WordscapeGame {
    constructor() {
        this.puzzles = [
            {
                word: "OPTIVE FUSION",
                description: "Artificial tears that contains the synergy CMC, HA and Osmoprotectants for mild to moderate type of Dry Eyes.",
                reference: "Optive Fusion MD Product Insert CCDS version 5.0 Date of Revision: October 2017."
            },
            {
                word: "PURITE",
                description: "A disappearing preservative. It converts into natural tear components (sodium chloride, oxygen, water) when exposed to light.",
                reference: "Freeman PD, Kahook MY. Expert Rev Ophthalmol 2009;4(1):59-64; Jones L, et al. The Ocular Surface 15 (2017) 575-628; Noecker R. Adv Ther. 2001."
            },
            {
                word: "OZURDEX",
                description: "A Dexamethasone Implant with 700 mcg sustained-release sterile rod for ophthalmic intravitreal injection.",
                reference: "Ozurdex Product Insert CCDS 9.0 Date of Revision: June 2020."
            },
            {
                word: "ALPHAGAN P",
                description: "Brimonidine Tartrate 1.5 mg/mL ophthalmic solution preserved with Purite. Lowers intraocular pressure in patients with open-angle glaucoma or ocular hypertension.",
                reference: "Alphagan P 0.15% Product Insert CCDS 2.1 Date of Revision: April 2019."
            },
            {
                word: "COMBIGAN",
                description: "Combination of Brimonidine Tartrate + Timolol Maleate. Indicated to reduce IOP in chronic open-angle glaucoma or ocular hypertension patients insufficiently responsive to beta-blockers.",
                reference: "Combigan Product Insert CCDS v3, Date of First Authorization March 2008."
            },
            {
                word: "OPTIVE ADVANCED",
                description: "Eye drop containing castor oil & Polysorbate 80, acting as emulsifiers to stabilize the lipid layer upon instillation.",
                reference: "Benelli U. Clin Ophthalmol 2011;5:783-90; Korb DR et al.; Scaffidi RC et al.; Simmons PA et al. Clin Ther 2015; Kathuria A et al. J Clin Med 2021."
            },
            {
                word: "RESTASIS",
                description: "Indicated to increase tear production in patients whose tear production is suppressed due to ocular inflammation from keratoconjunctivitis sicca.",
                reference: "Restasis Product Insert CCDS v4.0, January 2022; TFOS DEWS II Pathophysiology Report (2017)."
            },
            {
                word: "LUMIGAN",
                description: "A prostamide (Bimatoprost) that lowers IOP by increasing aqueous humor outflow through uveoscleral and trabecular pathways.",
                reference: "Pfennigsdorf S et al. Clin Ophthalmol 2012; BMC Ophthalmology 2016; Bimatoprost PI CCDS v13, June 2021; NLM PubChem Data."
            },
            {
                word: "GANFORT",
                description: "Contains 0.3 mg bimatoprost + 5 mg timolol maleate. Reduces IOP in open-angle glaucoma or ocular hypertension insufficiently responsive to monotherapy.",
                reference: "Philippines API based on Ganfort Full PI dated June 2021."
            },
            {
                word: "OPTIVE GEL",
                description: "A gel-drop formula for instant relief with CMC 1% and Osmoprotectants, giving long-lasting comfort day and night.",
                reference: "Optive Gel Drops Product Insert (Philippines, 2021)."
            }
        ];

        this.currentPuzzleIndex = 0;
        this.score = 0;
        this.startTime = null;
        this.correctWords = 0;
        this.selectedLetters = [];
        this.currentWord = [];
        this.attractModeTimeout = null;

        this.initializeElements();
        this.setupEventListeners();
        this.startAttractMode();
    }

    initializeElements() {
        this.attractMode = document.getElementById('attractMode');
        this.gameScreen = document.getElementById('gameScreen');
        this.resultsScreen = document.getElementById('resultsScreen');
        this.referenceModal = document.getElementById('referenceModal');
        
        this.currentPuzzleEl = document.getElementById('currentPuzzle');
        this.timerEl = document.getElementById('timer');
        this.scoreEl = document.getElementById('score');
        this.descriptionEl = document.getElementById('description');
        this.referenceBtn = document.getElementById('referenceBtn');
        this.referenceText = document.getElementById('referenceText');
        this.answerSlots = document.getElementById('answerSlots');
        this.letterCircle = document.getElementById('letterCircle');
        this.deleteBtn = document.getElementById('deleteBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.confetti = document.getElementById('confetti');
        this.wrongMark = document.getElementById('wrongMark');
        
        this.finalScore = document.getElementById('finalScore');
        this.finalTime = document.getElementById('finalTime');
        this.correctWordsEl = document.getElementById('correctWords');
        this.playAgainBtn = document.getElementById('playAgainBtn');
    }

    setupEventListeners() {
        this.attractMode.addEventListener('click', () => this.startGame());
        this.attractMode.addEventListener('touchstart', () => this.startGame());
        
        this.referenceBtn.addEventListener('click', () => this.showReference());
        
        document.querySelector('.close').addEventListener('click', () => this.hideReference());
        this.referenceModal.addEventListener('click', (e) => {
            if (e.target === this.referenceModal) this.hideReference();
        });
        
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        
        this.deleteBtn.addEventListener('click', () => this.deleteLetter());
        this.submitBtn.addEventListener('click', () => this.submitWord());
        
        // Click events for letter selection
        this.letterCircle.addEventListener('click', (e) => this.selectLetter(e));
    }

    startAttractMode() {
        this.attractMode.classList.add('active');
        this.gameScreen.classList.remove('active');
        this.resultsScreen.classList.remove('active');
        
        // Auto-restart attract mode after 30 seconds of inactivity
        this.attractModeTimeout = setTimeout(() => {
            this.startAttractMode();
        }, 30000);
    }

    startGame() {
        clearTimeout(this.attractModeTimeout);
        this.attractMode.classList.remove('active');
        this.gameScreen.classList.add('active');
        
        // Select 3 random puzzles
        this.selectedPuzzles = this.getRandomPuzzles(3);
        this.currentPuzzleIndex = 0;
        this.score = 0;
        this.correctWords = 0;
        this.startTime = Date.now();
        
        this.updateTimer();
        this.loadPuzzle();
    }

    getRandomPuzzles(count) {
        const shuffled = [...this.puzzles].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    loadPuzzle() {
        const puzzle = this.selectedPuzzles[this.currentPuzzleIndex];
        
        document.querySelector('.puzzle-counter').innerHTML = `Puzzle <span id="currentPuzzle">${this.currentPuzzleIndex + 1}</span> of 3`;
        this.descriptionEl.textContent = puzzle.description;
        this.referenceText.textContent = puzzle.reference;
        
        this.createAnswerSlots(puzzle.word);
        this.createLetterCircle(puzzle.word);
        this.selectedLetters = [];
        this.currentWord = [];
        this.updateAnswerSlots();
        
        this.playSound('newPuzzle');
    }

    createAnswerSlots(word) {
        this.answerSlots.innerHTML = '';
        const letters = word.replace(/\s/g, '');
        
        for (let i = 0; i < word.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'answer-slot';
            if (word[i] === ' ') {
                slot.style.visibility = 'hidden';
                slot.style.width = '20px';
            }
            slot.dataset.index = i;
            this.answerSlots.appendChild(slot);
        }
    }

    createLetterCircle(word) {
        this.letterCircle.innerHTML = '';
        const letters = [...new Set(word.replace(/\s/g, '').split(''))];
        const shuffled = this.shuffleArray([...letters]);
        
        const radius = 100;
        const centerX = 150;
        const centerY = 150;
        
        shuffled.forEach((letter, index) => {
            const angle = (index / shuffled.length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle) - 30;
            const y = centerY + radius * Math.sin(angle) - 30;
            
            const btn = document.createElement('button');
            btn.className = 'letter-btn';
            btn.textContent = letter;
            btn.style.left = x + 'px';
            btn.style.top = y + 'px';
            btn.dataset.letter = letter;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clickLetter(btn);
            });
            
            this.letterCircle.appendChild(btn);
        });
        
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    clickLetter(btn) {
        if (btn.classList.contains('used')) return;
        
        const letter = btn.dataset.letter;
        this.currentWord.push(letter);
        btn.classList.add('selected');
        
        this.updateAnswerSlots();
        this.playSound('letterSelect');
    }

    deleteLetter() {
        if (this.currentWord.length === 0) return;
        
        this.currentWord.pop();
        
        // Remove selected class from last selected letter
        const selectedBtns = this.letterCircle.querySelectorAll('.letter-btn.selected');
        if (selectedBtns.length > 0) {
            selectedBtns[selectedBtns.length - 1].classList.remove('selected');
        }
        
        this.updateAnswerSlots();
        this.playSound('letterSelect');
    }

    submitWord() {
        const word = this.currentWord.join('');
        this.checkWord(word);
    }

    updateAnswerSlots() {
        const slots = this.answerSlots.querySelectorAll('.answer-slot');
        const puzzle = this.selectedPuzzles[this.currentPuzzleIndex];
        const targetWord = puzzle.word;
        
        let wordIndex = 0;
        for (let i = 0; i < targetWord.length; i++) {
            if (targetWord[i] === ' ') {
                continue;
            }
            
            if (wordIndex < this.currentWord.length) {
                slots[i].textContent = this.currentWord[wordIndex];
                slots[i].classList.add('filled');
            } else {
                slots[i].textContent = '';
                slots[i].classList.remove('filled');
            }
            wordIndex++;
        }
    }

    checkWord(word) {
        const puzzle = this.selectedPuzzles[this.currentPuzzleIndex];
        const targetWord = puzzle.word.replace(/\s/g, '');
        
        if (word === targetWord) {
            this.correctWord();
        } else {
            this.showWrongMark();
            this.playSound('incorrect');
            // Clear the word after incorrect attempt
            setTimeout(() => {
                this.currentWord = [];
                this.letterCircle.querySelectorAll('.letter-btn.selected').forEach(btn => {
                    btn.classList.remove('selected');
                });
                this.updateAnswerSlots();
            }, 1000);
        }
    }

    correctWord() {
        const puzzle = this.selectedPuzzles[this.currentPuzzleIndex];
        this.markLettersUsed();
        
        this.score += 100;
        this.correctWords++;
        this.scoreEl.textContent = this.score;
        
        this.playSound('correct');
        this.showConfetti();
        
        this.answerSlots.classList.add('correct-animation');
        setTimeout(() => {
            this.answerSlots.classList.remove('correct-animation');
        }, 600);
        
        setTimeout(() => {
            if (this.currentPuzzleIndex < this.selectedPuzzles.length - 1) {
                this.currentPuzzleIndex++;
                this.loadPuzzle();
            } else {
                this.showResults();
            }
        }, 2000);
    }



    markLettersUsed() {
        this.letterCircle.querySelectorAll('.letter-btn.selected').forEach(btn => {
            btn.classList.remove('selected');
            btn.classList.add('used');
        });
    }

    showReference() {
        this.referenceModal.style.display = 'block';
    }

    hideReference() {
        this.referenceModal.style.display = 'none';
    }

    updateTimer() {
        if (!this.startTime) return;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        this.timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.gameScreen.classList.contains('active')) {
            setTimeout(() => this.updateTimer(), 1000);
        }
    }

    showResults() {
        this.gameScreen.classList.remove('active');
        this.resultsScreen.classList.add('active');
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        this.finalScore.textContent = this.score;
        this.finalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.correctWordsEl.textContent = `${this.correctWords}/3`;
        
        this.playSound('gameComplete');
    }

    resetGame() {
        this.resultsScreen.classList.remove('active');
        this.startAttractMode();
    }

    playSound(type) {
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const frequencies = {
            letterSelect: 800,
            correct: 1200,
            incorrect: 300,
            newPuzzle: 600,
            gameComplete: 1000
        };
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    showConfetti() {
        this.confetti.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.animationDelay = Math.random() * 2 + 's';
            piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
            this.confetti.appendChild(piece);
        }
        
        setTimeout(() => {
            this.confetti.innerHTML = '';
        }, 4000);
    }

    showWrongMark() {
        this.wrongMark.classList.add('show');
        
        setTimeout(() => {
            this.wrongMark.classList.remove('show');
        }, 1000);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WordscapeGame();
});

// Handle window resize
window.addEventListener('resize', () => {
    const game = window.game;
    if (game && game.resizeCanvas) {
        game.resizeCanvas();
    }
});
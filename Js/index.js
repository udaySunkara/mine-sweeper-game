(function () {
    const gameLevelElmnt = document.querySelector("#game-level");
    const gameBoard = document.querySelector(".game-board-js");
    const btnContainer = document.querySelector(".btn-conatiner-js");
    const timer = document.querySelector(".timer-js");
    const highScoreElmnt = document.querySelector(".high-score-js");
    const scoreElmnt = document.querySelector(".score-js");
    const highScore = localStorage.getItem("high-score") || 0;
    highScoreElmnt.innerHTML = highScore;

    function MineSweeper(levelSelected, highScore, gameStarted) {
        this.levelSelected = levelSelected;
        this.highScore = highScore;
        this.score = 0;
        this.gameStarted = gameStarted;
    }

    MineSweeper.prototype.init = function () {
        const levelMapping = { easy: 3, medium: 4, hard: 6 };
        gameBoard.innerHTML = "";
        btnContainer.innerHTML = "";
        this.createBoard(levelMapping[this.levelSelected]);
        return this;
    };

    MineSweeper.prototype.createBoard = function (boardSize) {
        if (!boardSize) return;
        this.boardSize = boardSize;
        var tile = null,
            row = null,
            counter = 1;
        var _that = this;
        for (var i = 0; i < boardSize; i++) {
            row = document.createElement("div");
            for (var j = 0; j < boardSize; j++) {
                tile = document.createElement("div");
                tile.addEventListener("click", function (event) {
                    _that.updateScoreCard(event);
                });
                tile.classList.add("tile");
                tile.classList.add("tile-" + counter);
                row.appendChild(tile);
                counter++;
            }
            gameBoard.appendChild(row);
        }

        const startBtn = document.createElement("button");
        const restartBtn = document.createElement("button");
        startBtn.classList.add("btn-start");
        startBtn.innerHTML = "Start";
        restartBtn.innerHTML = "Restart";
        restartBtn.classList.add("btn-restart");
        startBtn.addEventListener("click", function () {
            _that.start();
        });
        restartBtn.addEventListener("click", function () {
            _that.restart();
        });
        btnContainer.appendChild(startBtn);
        btnContainer.appendChild(restartBtn);
    };

    MineSweeper.prototype.start = function () {
        var _that = this;
        this.timerValue = 120;
        this.gameStarted = true;
        gameLevelElmnt.disabled = true;
        this.intervalObj = setInterval(function () {
            if (!_that.timerValue) {
                clearInterval(_that.intervalObj);
                _that.restart("Game over!!!");
                return;
            }
            if (_that.activeTileRef) {
                _that.activeTileRef.classList.remove("active");
            }
            var activeTile = -1,
                max = _that.boardSize * _that.boardSize,
                min = 1;
            activeTile = Math.round(Math.random() * (max * min) + min);
            activeTile = activeTile > max || activeTile < min ? 1 : activeTile;
            _that.activeTileRef = document.querySelector(".tile-" + activeTile);
            if (_that.activeTileRef) {
                _that.activeTileRef.classList.add("active");
            }
            timer.innerHTML = --_that.timerValue;
        }, 1000);
    };

    MineSweeper.prototype.updateScoreCard = function (event) {
        if (!event || !event.target || !this.gameStarted) {
            return;
        }
        if (
            Array.prototype.slice
                .call(event.target.classList)
                .indexOf("active") > -1
        ) {
            ++this.score;
        } else {
            --this.score;
        }
        scoreElmnt.innerHTML = this.score;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            highScoreElmnt.innerHTML = this.score;
            localStorage.setItem("high-score", this.score);
        }
    };

    MineSweeper.prototype.restart = function (msg) {
        if (msg) {
            alert(msg);
        }
        this.score = 0;
        this.gameStarted = false;
        gameLevelElmnt.disabled = false;
        gameLevelElmnt.selectedIndex = 0;
        if (this.intervalObj) {
            clearInterval(this.intervalObj);
        }
        if (this.activeTileRef) {
            this.activeTileRef.classList.remove("active");
        }
        timer.innerHTML = 120;
        scoreElmnt.innerHTML = 0;
        gameBoard.innerHTML = "";
        btnContainer.innerHTML = "";
    };

    function init() {
        gameLevelElmnt.addEventListener("change", function (event) {
            new MineSweeper(event.target.value, highScore, false).init();
        });
    }

    init();
})();

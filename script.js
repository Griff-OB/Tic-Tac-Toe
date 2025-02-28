document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    const cells = document.querySelectorAll('.cell');
    const message = document.querySelector('.message');
    const resetButton = document.querySelector('.reset-button');
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    const checkWinner = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return gameBoard[a];
            }
        }

        if (!gameBoard.includes('')) {
            return 'tie';
        }

        return null;
    };

    const minimax = (board, depth, isMaximizing) => {
        const winner = checkWinner();
    
        if (winner === 'X') {
            return -10 + depth;
        } else if (winner === 'O') {
            return 10 - depth;
        } else if (winner === 'tie') {
            return 0;
        }
    
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };
    

    const aiMove = () => {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = 'O';
                let score = minimax(gameBoard, 0, false);
                gameBoard[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        gameBoard[move] = 'O';
        cells[move].textContent = 'O';
    };

    const handleCellClick = (index) => {
        if (!gameBoard[index] && gameActive) {
            gameBoard[index] = currentPlayer;
            cells[index].textContent = currentPlayer;

            const winner = checkWinner();
            if (winner) {
                gameActive = false;
                if (winner === 'tie') {
                    message.textContent = "It's a tie!";
                } else {
                    message.textContent = `${winner} wins!`;
                }
                return;
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O' && gameActive) {
                aiMove();
                const winnerAfterAI = checkWinner();
                if(winnerAfterAI){
                    gameActive = false;
                    if (winnerAfterAI === 'tie') {
                        message.textContent = "It's a tie!";
                    } else {
                        message.textContent = `${winnerAfterAI} wins!`;
                    }
                }
                currentPlayer = 'X';
                
            }
        }
    };

    const resetGame = () => {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        message.textContent = '';
        cells.forEach(cell => cell.textContent = '');
    };

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });

    resetButton.addEventListener('click', resetGame);
});

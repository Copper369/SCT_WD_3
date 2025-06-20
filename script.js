 const board = Array(9).fill(null);
    let currentPlayer = 'X';
    let gameOver = false;
    let vsComputer = false;

    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('resetBtn');
    const twoPlayerBtn = document.getElementById('twoPlayerBtn');
    const vsComputerBtn = document.getElementById('vsComputerBtn');

    const winCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    function checkWinner() {
      for (const combo of winCombos) {
        const [a,b,c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
      return null;
    }

    function checkTie() {
      return board.every(cell => cell !== null);
    }

    function updateStatus(message) {
      status.textContent = message;
    }

    function disableAll() {
      cells.forEach(cell => cell.disabled = true);
    }

    function enableEmptyCells() {
      cells.forEach((cell, idx) => {
        cell.disabled = board[idx] !== null || gameOver;
      });
    }

    function makeMove(index) {
      if (gameOver || board[index]) return false;
      board[index] = currentPlayer;
      cells[index].textContent = currentPlayer;
      cells[index].disabled = true;

      const winner = checkWinner();
      if (winner) {
        updateStatus(`${winner} wins!`);
        gameOver = true;
        disableAll();
        return true;
      }
      if (checkTie()) {
        updateStatus("It's a tie!");
        gameOver = true;
        disableAll();
        return true;
      }
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateStatus(`${currentPlayer}'s turn`);
      return true;
    }

    function computerMove() {
      if (gameOver) return;
  
      const emptyIndices = board.map((v,i) => v === null ? i : null).filter(i => i !== null);
      if (emptyIndices.length === 0) return;
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      makeMove(randomIndex);
    }

    cells.forEach(cell => {
      cell.addEventListener('click', e => {
        const idx = +e.target.dataset.index;
        if (makeMove(idx) && vsComputer && !gameOver && currentPlayer === 'O') {
          setTimeout(computerMove, 300);
        }
      });
    });

    resetBtn.addEventListener('click', () => {
      board.fill(null);
      currentPlayer = 'X';
      gameOver = false;
      cells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
      });
      updateStatus(`${currentPlayer}'s turn`);
    });

    twoPlayerBtn.addEventListener('click', () => {
      vsComputer = false;
      twoPlayerBtn.classList.add('selected');
      vsComputerBtn.classList.remove('selected');
      resetBtn.click();
    });

    vsComputerBtn.addEventListener('click', () => {
      vsComputer = true;
      twoPlayerBtn.classList.remove('selected');
      vsComputerBtn.classList.add('selected');
      resetBtn.click();
    });
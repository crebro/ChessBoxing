const chess = new Chess();
const pieces = ['p', 'r', 'n', 'b', 'k', 'q' ];
let squareSize = 50;
let boardSize = 8 * squareSize;
let padding = 0;
let boardImg;
let piecesImages = {};
let selection = {row: -1, col: -1};
let playingAsWhite = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  boardImg = loadImage('/assets/images/board.png', (image) => image.resize(boardSize, boardSize));
  for (let x = 0; x < 2; x++) {
    for (let i = 0; i < pieces.length; i++ ) {
      let pieceIdentifier = `${x ? 'w' : 'b'}${pieces[i]}`;
      piecesImages[pieceIdentifier] = loadImage(`/assets/images/${pieceIdentifier}.png`, (image) => image.resize(squareSize, squareSize));
    }
  }
}

function isInBoard(x, y) {
  return ( x > windowWidth / 2 - boardSize / 2 && x < windowWidth / 2 + boardSize / 2 && y > windowHeight / 2 - boardSize / 2 && y < windowHeight / 2 + boardSize / 2 )
}

function draw() {
  background(220);
  
  translate(windowWidth / 2 - boardSize / 2, windowHeight / 2 - boardSize / 2);
  image(boardImg, 0, 0);
  let board = chess.board();
  for (row = 0; row < 8; row++) { 
    for (col = 0; col < 8; col++) {
      let item = board[row][col];
      if (item) {
        if (selection.row === row && selection.col === col) {
          fill(186,203,43);
          rect(col * squareSize, row * squareSize, squareSize, squareSize);
        }
        image(piecesImages[`${item.color}${item.type}`], col * squareSize, row * squareSize);
      }
    }
  }
}

function mouseClicked() {
  if (isInBoard(mouseX, mouseY)) {
    let clickLocation = { row: Math.floor((mouseY - (windowHeight / 2 - boardSize / 2)) / squareSize ), col: Math.floor((mouseX - (windowWidth / 2 - boardSize / 2)) / squareSize)  } ;
    let board = chess.board();
    if (selection === clickLocation) {
      selection = {row: -1, col: -1};
      return;
    }

    let item = board[clickLocation.row][clickLocation.col];
    if (item && (item.color === (playingAsWhite ? 'w' : 'b'))) {
      selection = clickLocation;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

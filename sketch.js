const chess = new Chess();
const pieces = ['p', 'r', 'n', 'b', 'k', 'q' ];
let squareSize = 50;
let boardSize = 8 * squareSize;
let padding = 0;
let boardImg;
let piecesImages = {};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  boardImg = loadImage('/assets/images/board.png', (image) => image.resize(boardSize, boardSize));
  for (let x = 0; x < 2; x++) {
    for (let i = 0; i < pieces.length; i++ ) {
      let pieceIdentifier = `${x ? 'w' : 'b'}${pieces[i]}`;
      piecesImages[pieceIdentifier] = loadImage(`/assets/images/${pieceIdentifier}.png`, (image) => image.resize(squareSize, squareSize));
    }
  }
}

function draw() {
  background(220);
  
  translate(window.innerWidth / 2 - boardSize / 2, window.innerHeight / 2 - boardSize / 2);
  image(boardImg, 0, 0);
  let board = chess.board();
  for (row = 0; row < 8; row++) { 
    for (col = 0; col < 8; col++) {
      let item = board[row][col];
      if (item) {
        image(piecesImages[`${item.color}${item.type}`], col * squareSize, row * squareSize);
      }
    }
  }
}

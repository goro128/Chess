const game = new Chess()
console.log(game.moves(), game.fen())

const board = Chessboard('board1', {
    pieceTheme: (piece) => {
        const color = { 'w': 'l', 'b': 'd' }[piece[0]]
        const figure = piece[1].toLowerCase()
        return `img/Chess_${figure}${color}t45.svg`
    },
    position: game.fen(),
    orientation: 'white',
    draggable: true,
    onDrop: (source, target, piece) => {
        console.log(source, target, piece)
        if (game.move({ from: source, to: target }) == null) {
            return 'snapback'
        }

    }
})
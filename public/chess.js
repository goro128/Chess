// pridobimo shranjene podatke o igri
const gameId = localStorage.getItem("gameId")
const color = localStorage.getItem("color")
// prikažemo shranjen identifikator igre
document.getElementById("gameid").value = gameId

// ustvarimo spletno vtičnico (web socket) preko katere bomo pošiljali posamezne poteze
const socket = io("/", {
    // ob povezavi strežniku posredujemo identifikator trenutno shranjene igre
    query: { gameId }
})

// ustvarimo objekt, ki skrbi za šahovko logiko s knjižnico Chess.js 
const game = new Chess()

// ustvarimo objekt, ki skrbi za prikaz trenutnega stanja šahovnice s knjižnico Chessboard.js 
const board = Chessboard('board1', {
    // določimo izgled posameznih figur. Ime prilagodimo na javno dostopne prenešene slike figur iz Wikipedije
    pieceTheme: (piece) => {
        const color = { 'w': 'l', 'b': 'd' }[piece[0]]
        const figure = piece[1].toLowerCase()
        return `img/Chess_${figure}${color}t45.svg`
    },
    // določimo začetno pozicijo
    position: game.fen(),
    // na podlagi shranjene barve igralca določimo orientacijo šahovnice
    orientation: { 'w': 'white', 'b': 'black' }[color],
    // omogočimo premik figur
    draggable: true,
    // ob premiku
    onDrop: (from, to, piece) => {
        // če igralec ni na potezi se premik razveljavi
        if (game.turn() != color) return 'snapback'
        const move = { from, to }
        // če poteza ni legalna se premik razveljavi
        if (game.move(move) == null) {
            return 'snapback'
            // drugače se poteza posreduje na strežnik preko spletne vtičnice (web socket)
        } else {
            socket.emit("move", { gameId, move })
        }

    }
})

// spletna vtičnica čaka na premik (move), ko se ta zgodi, se posodobi šahovnica
socket.on("move", (move) => {
    game.move(move)
    board.position(game.fen())
})
// knjižnica za generiranje naključnega identifikatorja igre
const { v4: uuidv4 } = require('uuid')

// knjižnice za vzpostavitev strežnika
const express = require('express')
const app = express()
const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer)
const port = process.env.PORT || 3030

// seznam trenutno aktivnih iger 
const activeGames = []

// krajišče (endpoint) za ustvarjanje nove igre
app.get("/new-game", (req, res) => {
    // ustvari se nova igra
    const game = {
        // z naključnim identifikatorjem
        gameId: uuidv4(),
        // in naključno začetno barvo
        color: Math.random() > 0.5 ? 'b' : 'w'
    }
    // igro shranimo med aktivne igre
    activeGames.push(game)
    // na zahtevek (request) odgovrimo (response) z novo ustvarjeno igro
    res.json(game)
})

// krajišče (endpoint) za pridružitev k že obstoječi igri
app.get("/join", (req, res) => {
    // če med aktivnimi igrami NE obstaja igra z zahtevanim identifikatorjem  
    if (!activeGames.map(g => g.gameId).includes(req.query.gameId)) {
        // se zgodi napaka
        res.status(500)
        res.json({ error: 'No game with such id' })
        // igra obstaja 
    } else {
        // najde aktivno igro z zahtevanim identifikatorjem
        const game = activeGames.find(g => g.gameId == req.query.gameId)
        // začetno barvo obrnemo za igralca, ki se prirdužuje
        game.color = game.color == 'w' ? 'b' : 'w'
        // na zahtevek (request) odgovrimo (response) z najdeno igro
        res.send(game)
    }
})

// spletna vtičnica (web socket). Ob povezavi:
io.on("connection", (socket) => {
    // uporabnik se pridruži v sobo z identifikatorjem igre
    socket.join(socket.handshake.query.gameId)
    // ob vsaki potezi se le-ta odda vsem uporabnikom v sobi s tem identifikatorjem igre
    socket.on("move", (data) => {
        socket.to(data.gameId).emit("move", data.move)
    });

    // client.on("status", (data) => io.in(data.room).emit("status", data));
    // client.on("message", (data) => io.in(data.room).emit("message", data));

})

// strežniku naročimo naj javno prikazuje datoteke v mapi "public"
app.use(express.static('public'))

// zaženemo strežnik na izbranih vratih (port) 
httpServer.listen(port, () => console.log(`server is listening on port ${port}`))
// počakamo, da se okno naloži
window.addEventListener("load", () => {
    // ob pritisku na gumb "Play" z identifikatorjem "submit" 
    document.getElementById("submit").addEventListener("click", (event) => {
        // preprečimo navadno delovenje forme, saj za pošiljanje podatkov poskrbimo sami
        event.preventDefault()
        // na strežnik pošljemo zahtevek (request) za novo igro
        fetch("/new-game")
            // potem dobimo odgovor (response)
            .then(async res => {
                // ob uspešno ustvarjeni igri dobimo iz strežnika podatke o tej igri
                const json = await res.json()
                // podatke shranimo v lokalno shrambo (localStorage), ki se ohranja med osveževanjem strani
                localStorage.setItem("gameId", json.gameId)
                localStorage.setItem("color", json.color)
                // preusmerimo se na stran s šahovnico
                window.location = "/chess.html"
            })
    })
})
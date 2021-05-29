// počakamo, da se okno naloži
window.addEventListener("load", () => {
    // ob pritisku na gumb "Play" z identifikatorjem "play" 
    document.getElementById("play").addEventListener("click", () => {
        // pridobimo izbrani identifikator iz html datoteke
        const gameId = document.getElementById("gname").value
        // in ga pošljemo na strežnik. Strežnik nato preveri, če je identifikator (gameId) legalen,
        fetch(`join?gameId=${gameId}`)
            .then(async res => {
                const json = await res.json()
                //  če je identifikator legalen, je odgovor (response) uspešen in se igra shrani v lokalno shrambo (localStorage)
                if (res.ok) {
                    localStorage.setItem("gameId", json.gameId)
                    localStorage.setItem("color", json.color)
                    window.location = "/chess.html"
                    // če identifikator ni legalen se prikaže napaka
                } else {
                    alert(json.error)
                }
            })

    })
})
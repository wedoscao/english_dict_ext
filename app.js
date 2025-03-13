const popup = document.createElement("div");
popup.id = "english_dict_popup";
Object.assign(popup.style, {
    position: "absolute",
    backgroundColor: "#eee",
    border: "1px solid black",
    display: "none",
    width: "320px",
    borderRadius: "2px",
    padding: "8px",
    fontFamily: "sans-serif",
    color: "#222",
    fontSize: "16px"
});
document.body.appendChild(popup);

document.addEventListener("keydown", async (e) => {
    if (e.key !== "Shift") return;

    const selectedText = window.getSelection().toString().trim();
    const popupElement = document.getElementById("english_dict_popup");

    if (!selectedText || !popupElement) {
        popupElement.style.display = "none";
        return;
    }

    const range = window.getSelection().getRangeAt(0).cloneRange();
    range.collapse(false);

    const rect = range.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    Object.assign(popupElement.style, {
        left: rect.left + scrollLeft + "px",
        top: rect.bottom + scrollTop + "px",
        display: "block"
    });

    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`);
        const json = await res.json();

        if (json.title) {
            return;
        }

        const { phonetics, meanings } = json[0];
        const phoneticText = phonetics.find((p) => p.text)?.text || "";

        const meaningsHtml = meanings
            .map(
                (m) => `
            <div style="margin: 4px; background-color: #fff; padding: 8px;">
                <span style="font-weight: bold;">Part-of-speech:</span>
                <span>${m.partOfSpeech}</span><br />
                <span style="font-weight: bold;">Phonetic:</span>
                <span>${phoneticText}</span><br />
                <span style="font-weight: bold;">Definition:</span>
                <span>${m.definitions[0].definition}</span><br />
                ${
                    m.definitions[0].example
                        ? `
                    <span style="font-weight: bold;">Example:</span>
                    <span>${m.definitions[0].example}</span>`
                        : ""
                }
            </div>`
            )
            .join("");

        popupElement.innerHTML = meaningsHtml;
    } catch (error) {
        console.error("Dictionary API error:", error);
        popupElement.innerHTML = `<span style="font-weight:bold">Not Found...</span>`;
    }
});

document.addEventListener("mousedown", (event) => {
    const popupElement = document.getElementById("english_dict_popup");
    const selection = window.getSelection();

    if (
        popupElement?.style.display === "block" &&
        (!event.target.closest("#english_dict_popup") || !selection.toString().trim())
    ) {
        popupElement.innerHTML = "";
        popupElement.style.display = "none";
    }
});

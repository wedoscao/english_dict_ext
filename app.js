const popup = document.createElement("div");
popup.setAttribute("id", "english_dict_popup");
popup.style.position = "absolute";
popup.style.backgroundColor = "#eee";
popup.style.border = "1px solid black";
popup.style.display = "none";
popup.style.width = "320px";
popup.style.borderRadius = "2px";
popup.style.padding = "8px";
popup.style.fontFamily = "san-serif";
popup.style.color = "#222";
popup.style.fontSize = "16px";
document.body.appendChild(popup);

document.addEventListener("keydown", async function (e) {
    if (e.key !== "Shift") {
        return;
    }
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    const popup = document.getElementById("english_dict_popup");

    if (selectedText && popup) {
        const range = selection.getRangeAt(0).cloneRange();
        range.collapse(false); // Collapse to the end of the selection

        const rect = range.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        popup.style.left = rect.left + scrollLeft + "px";
        popup.style.top = rect.bottom + scrollTop + "px";
        popup.style.display = "block";

        const res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + selectedText);
        const json = await res.json();

        if (json.title !== undefined) {
            popup.innerHTML = `<span style="font-weight:bold">Not Found...<span/>`;
            return;
        }

        let wordInfo = {
            phonetic: "",
            meanings: []
        };

        wordInfo.word = json[0].word;

        for (const phonetic of json[0].phonetics) {
            if (phonetic.text) {
                wordInfo.phonetic = phonetic.text;
                break;
            }
        }

        for (const meaning of json[0].meanings) {
            const validMeaning = {
                partOfSpeech: meaning.partOfSpeech,
                definition: meaning.definitions[0].definition
            };
            if (typeof meaning.definitions[0].example !== "undefined") {
                validMeaning.example = meaning.definitions[0].example;
            }
            wordInfo.meanings.push(validMeaning);
        }

        let meanings = "";

        for (const meaning of wordInfo.meanings) {
            const html = `
                                <div style="margin: 4px; background-color: #fff;padding: 8px">
                                    <span style="font-weight: bold">Part-of-speech:</span>
                                    <span>${meaning.partOfSpeech}</span>
                                    <br />
                                    <span style="font-weight: bold">Phonetic:</span>
                                    <span>${wordInfo.phonetic}</span>
                                    <br />
                                    <span style="font-weight: bold">Definition:</span>
                                    <span>${meaning.definition}</span>
                                    <br />
                                    ${
                                        meaning.example
                                            ? `<span style="font-weight: bold">Example:</span>
                                                <span>${meaning.example}</span>`
                                            : ""
                                    }
                                </div>`;
            meanings += html;
        }

        popup.innerHTML = meanings;
    } else if (popup) {
        popup.style.display = "none";
    }
});
document.addEventListener("mousedown", function (event) {
    const popup = document.getElementById("english_dict_popup");
    const selection = window.getSelection();
    if (popup.style.display === "none") {
        return;
    }

    if (!event.target.closest("#english_dict_popup") || selection.toString().trim() === "") {
        popup.innerHTML = "";
        popup.style.display = "none";
    }
});

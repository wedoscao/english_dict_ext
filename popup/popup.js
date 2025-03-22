const handlePhoneticAudio = () => {
    const audioUrl = document.querySelector(".content__speaker_icon")?.getAttribute("audio");
    if (audioUrl) {
        new Audio(audioUrl).play();
    }
};

document.querySelector(".content__speaker_icon")?.addEventListener("click", handlePhoneticAudio);

const createMeanings = async (word) => {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const contentWord = document.querySelector(".content__word");
    const contentMeanings = document.querySelector(".content__meanings");
    const contentPhoneticText = document.querySelector(".content__phonetic_text");
    const contentSpeakerIcon = document.querySelector(".content__speaker_icon");
    try {
        const response = await fetch(url);
        const json = await response.json();

        const wordInfo = {
            word: json[0].word,
            phonetic: { text: "", audio: "" },
            meanings: []
        };

        const phonetic = json[0].phonetics.find((p) => p.audio && p.text);
        if (phonetic) {
            wordInfo.phonetic.text = phonetic.text;
            wordInfo.phonetic.audio = phonetic.audio;
        }

        wordInfo.meanings = json[0].meanings.map((meaning) => {
            const validMeaning = {
                partOfSpeech: meaning.partOfSpeech,
                definition: meaning.definitions[0].definition,
                example: meaning.definitions[0].example
            };
            if (typeof meaning.definitions[0].example === "undefined") {
                delete validMeaning.example;
            }
            return validMeaning;
        });

        const meaningsHtml = wordInfo.meanings
            .map(
                (meaning) => `
            <div class="content__meaning">
                <span class="content__meaning_index">Part-of-speech:</span>
                <span class="content__part_of_speech">${meaning.partOfSpeech}</span><br />
                <span class="content__meaning_index">Definition:</span>
                <span class="content__definition">${meaning.definition}</span><br />
                ${
                    meaning.example
                        ? `
                        <span class="content__meaning_index">Example:</span>
                        <span class="content__example">${meaning.example}</span>`
                        : ""
                }
            </div>
        `
            )
            .join("");

        contentWord.innerHTML = wordInfo.word;
        contentPhoneticText.innerHTML = wordInfo.phonetic.text;
        contentSpeakerIcon.setAttribute("audio", wordInfo.phonetic.audio);
        contentSpeakerIcon.style.display = "block";
        contentMeanings.innerHTML = meaningsHtml;
    } catch (error) {
        console.error("Error fetching or processing data:", error);

        contentWord.innerHTML = "Not found";
        contentMeanings.innerHTML = "";
        contentPhoneticText.innerHTML = "";
        contentSpeakerIcon.setAttribute("audio", "");
        if (contentSpeakerIcon.style.display !== "none") {
            contentSpeakerIcon.style.display = "none";
        }
    }
};

const handleSubmitBtn = async () => {
    const input = document.querySelector(".content__input");
    const word = input?.value;
    if (word) {
        await createMeanings(word);
    }
};

document.querySelector(".content__submit_btn")?.addEventListener("click", handleSubmitBtn);

const focusOnLoaded = () => {
    const input = document.querySelector(".content__input");
    if (input) {
        window.setTimeout(() => input.focus(), 0);
    }
};

focusOnLoaded();

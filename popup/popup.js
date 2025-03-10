const handlePhoneticAudio = () => {
    const audioUrl = document.querySelector(".content__speaker_icon").getAttribute("audio");
    const audio = new Audio(audioUrl);
    audio.play();
};

const speakerBtn = document.querySelector(".content__speaker_icon");
speakerBtn.addEventListener("click", handlePhoneticAudio);

/**
 *
 * @param {string} word
 *
 */
const createMeanings = async (word) => {
    const url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
    const response = await fetch(url);
    const json = await response.json();

    const contentWord = document.querySelector(".content__word");
    const contentMeanings = document.querySelector(".content__meanings");
    const contentPhoneticText = document.querySelector(".content__phonetic_text");
    const contentSpeakerIcon = document.querySelector(".content__speaker_icon");
    if (json.title !== undefined) {
        contentWord.innerHTML = "Not found";
        contentMeanings.innerHTML = json.title;
        contentPhoneticText.innerHTML = "";
        contentSpeakerIcon.setAttribute("audio", "");
        return;
    }

    let wordInfo = {
        word: "",
        phonetic: {
            text: "",
            audio: ""
        },
        meanings: []
    };

    wordInfo.word = json[0].word;

    for (const phonetic of json[0].phonetics) {
        if (phonetic.audio && phonetic.text) {
            wordInfo.phonetic.text = phonetic.text;
            wordInfo.phonetic.audio = phonetic.audio;
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
                <div class="content__meaning">
                    <span class="content__meaning_index">Part-of-speech:</span>
                    <span class="content__part_of_speech">${meaning.partOfSpeech}</span>
                    <br />
                    <span class="content__meaning_index">Definition:</span>
                    <span class="content__definition">${meaning.definition}</span>
                    <br />
                    ${
                        meaning.example
                            ? `<span class="content__meaning_index">Example:</span>
                                <span class="content__example">${meaning.example}</span>`
                            : ""
                    }
                </div>
        `;
        meanings += html;
    }

    contentWord.innerHTML = wordInfo.word;
    contentPhoneticText.innerHTML = wordInfo.phonetic.text;
    contentSpeakerIcon.setAttribute("audio", wordInfo.phonetic.audio);
    contentMeanings.innerHTML = meanings;
};

const handleSubmitBtn = async () => {
    const input = document.querySelector(".content__input");
    const word = input.value;
    await createMeanings(word);
};

document.querySelector(".content__submit_btn").addEventListener("click", handleSubmitBtn);

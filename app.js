document.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
        const selection = document.getSelection();
        if (selection !== null) {
            text = selection.toString();
        }
    }
});

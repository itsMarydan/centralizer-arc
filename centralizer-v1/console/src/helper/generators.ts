export  function randomAlphabets(length: number) {
    let text = "";
    const possible = "abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


export const turkishToLower = (input: string) => {
  if (!input) {
    return "";
  }
  var letters = {
    İ: "I",
    ı: "i",
    Ş: "Ş",
    ş: "s",
    Ğ: "G",
    ğ: "g",
    Ü: "U",
    ü: "u",
    Ö: "O",
    ö: "o",
    Ç: "C",
    ç: "c",
  };
  input = input.replace(/(([İıŞşĞğÜüÇçÖö]))/g, (letter) => {
    return letters[letter];
  });
  return input;
};

export const replaceLinksWithHtmlTags = (input: string) => {
  if (!input) {
    return "";
  }

  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  return input.replace(urlRegex, function (url) {
    return '<a target="_blank" href="' + url + '">' + url + "</a>";
  });
};

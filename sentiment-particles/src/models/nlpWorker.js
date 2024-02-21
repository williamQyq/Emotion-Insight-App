// import natural, { PorterStemmer } from "natural";
import nlp from 'compromise';
import * as stopword from "stopword";

function isAlpha(str) {
  return /^[a-zA-Z()]+$/.test(str);
}
// Function to clean text
export function cleanText(text) {
  // const tokenizer = new natural.WordTokenizer();

  text = text.toLowerCase();
  text = text.replace(/http\S+/g, "");
  text = text.replace(/www.\S+/g, "");

  // Remove punctuation
  const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  text = text.replace(punctuationRegex, '');

  // Tokenize and remove stopwords
  // let tokens = tokenizer.tokenize(text);

  let tokens = nlp(text).out('array');
  
  tokens = stopword.removeStopwords(tokens);

  // Lemmatization is more complex in JS and might not have a direct equivalent in 'natural',
  // but stemming can be used as an alternative.
  tokens = tokens
    .map((token) => (isAlpha(token) ? PorterStemmer.stem(token) : ""))
    .filter((token) => token !== "");

  return tokens.join(" ");
}

// Listen for messages from the parent thread
self.onmessage = (task) => {
  if (task.data.type === "cleanText") {
    const cleanedText = cleanText(task.data.text);
    self.postMessage({ cleanedText });
  }
}


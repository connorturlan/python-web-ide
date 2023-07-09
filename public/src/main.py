#!/usr/bin/python

import random


class Reader:

    def __init__(self):
        self.i = -1
        self.words = []

    def read_passage(self, lines):
        self.words = []
        word = ''
        allowed = "-"

        for char in lines:
            # add the character to the word if it's alphabetical.
            if char.isalnum() or char in allowed:
                word += char
            # otherwise pinch it off.
            else:
                if word != '':
                    self.words.append(word.lower())
                    word = ''

            # add a full stop because please i want to end a sentence...
            if char == '.' and self.words[-1] != '.':
                self.words.append(char)

    def read(self, f):
        self.read_passage(f.read())

    def __str__(self):
        return ', '.join(self.words)

    def __getitem__(self, i):
        return self.words[i]

    def __index__(self, i):
        return self.words[i]


def parse_text(text):
    freq = {}
    last_word = text[0]

    for word in text[1:]:
        # insert the word into the freq list.
        if last_word not in freq:
            freq[last_word] = {}

        # increase the freq.
        if word not in freq[last_word]:
            freq[last_word][word] = 0

        freq[last_word][word] += 1

        # set the new last word.
        last_word = word

    return freq


def expand_word_list(words):
    return [word for word, freq in words.items() for i in range(freq)]


def get_next_word(words):
    # return the next random word given a probability dictionary.
    return random.choice(expand_word_list(words))


def construct_sentence(freq, word_constructor=get_next_word):
    # get the initial word.
    first_words = [i for i in freq]
    word = first_words[random.randrange(0, len(first_words))]
    text = [word]

    # while there isn't a full stop, get the next word.
    while text[-1] != '.':
        word = word_constructor(freq[word])
        text.append(word)

    # return the string, formatting the sentence correctly.
    return ' '.join(text).replace(' .', '.').capitalize()


def construct_text(freq,
                   sentences=1,
                   sentence_constructor=construct_sentence,
                   word_constructor=get_next_word):
    return '\n'.join(
        sentence_constructor(freq, word_constructor) for i in range(sentences))


def generate_text_from_file(filename,
                            parse=parse_text,
                            generate=construct_text,
                            sentence=construct_sentence,
                            word=get_next_word):
    # read in the passage of text.
    print("===== reading the input text =====")
    text = Reader()
    with open(filename, 'r') as file:
        text.read(file)
    # print(text)

    # parse the text and get frequency counts.
    print("===== parsing the input text =====")
    freq = parse(text)
    # print(freq)

    # reconstuct a passage of text.
    print("===== generating the output text =====")
    passage = generate(freq, 10, sentence, word)
    print(passage)

    print("===== done =====")
#!/usr/bin/python

import random

class Reader:
    def __init__(self):
        self.i = -1
        self.words = []

    def read(self, f):
        self.words = []
        word = ''
        allowed = "-"

        for char in f.read():
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



def get_next_word(words):
    # return the next random word given a probability dictionary.
    choices = []
    for word, chance in words.items():
        choices.extend([word for i in range(chance)])
        
    return random.choice(choices)

def construct_sentence(freq):
    # get the initial word.
    first_words = [i for i in freq]
    word = first_words[random.randrange(0, len(first_words))]
    text = [word]

    # while there isn't a full stop, get the next word.
    while text[-1] != '.':
        word = get_next_word(freq[word])
        text.append(word)

    # return the string, formatting the sentence correctly.
    return ' '.join(text).replace(' .', '.').capitalize()

def construct_text(freq, sentences=1):
    return '\n'.join(construct_sentence(freq) for i in range(sentences))



def generate_text_from_file(filename):
    # read in the passage of text.
    print("===== reading the input text =====")
    text = Reader()
    with open(filename, 'r') as file:
        text.read(file)
    # print(text)

    # parse the text and get frequency counts.
    print("===== parsing the input text =====")
    freq = parse_text(text)
    # print(freq)

    # reconstuct a passage of text.
    print("===== generating the output text =====")
    passage = construct_text(freq, 10)
    print(passage)

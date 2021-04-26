import sys

class Node:
    def __init__(self, id, isInitial, isFinal):
        self.id = id
        self.isInitial = isInitial
        self.isFinal = isFinal

class Link:
    def __init__(self, source, target, label):
        self.source = source
        self.target = target
        self.label = label

def separate_words(fileRead):
    words = []
    currentWord = ''
    for character in fileRead:
        if character != " ":
            currentWord = currentWord + character
        else:
            if len(currentWord) != 0:
                words.append(currentWord)
                currentWord = ""
    
    if currentWord != "":
        words.append(currentWord)
    
    return words

def test_word(word, nodes, links):
    initialStates = []
    acceptStates = []

    for node in nodes:
        if node.isInitial:
            initialStates.append(node)
        if node.isFinal:
            acceptStates.append(node)
    
    itBelongs = False

    # recorrer los estados iniciales
    for initialState in initialStates:
        currentState = initialState

        # verificar cada letra de la palabra en el afd
        for iWord in range(len(word)):
            letter = word[iWord]

            currentState = evaluate_character(letter, currentState, nodes, links)

            if (currentState == -1):
                break
            else:
                if iWord == (len(word) - 1):
                    if currentState.isFinal:
                        itBelongs = True
    
    return itBelongs

# Devuelve -1 si no existe transicion desde el nodo hacia otro con la letter, de lo contrario devuelve el nodo target
def evaluate_character(letter, currentState, nodes, links):
    initialState = currentState
    stateId = -1

    for link in links:
        if link.source == initialState.id and link.label == letter:
            stateId = link.target
    
    if stateId != -1:
        for node in nodes:
            if node.id == stateId:
                return node
    return stateId
            
    


# INICIO DE PROGRAMA
testFileName = sys.argv[1]
file = open(testFileName, "r")
words = separate_words(file.read())

# tokens y keywords
tokens = []
keywords = []

# Nodos y Links de Tokens
nodes = []
links = []

# Nodos y Links de Keywords
keywordsNodes = []
keywordsLinks = []



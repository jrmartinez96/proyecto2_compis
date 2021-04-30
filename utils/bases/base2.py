
# Test
currentWord = ""
for i in range(0, len(content)):
    character = content[i]
    currentWord = currentWord + character

    if not link_exists(currentWord, nodes, links):
        if test_word(currentWord[0 : len(currentWord) - 1], keywordsNodes, keywordsLinks):
            keywords.append(currentWord[0 : len(currentWord) - 1])
        elif test_word(currentWord[0 : len(currentWord) - 1], nodes, links):
            tokens.append(currentWord[0 : len(currentWord) - 1])

        currentWord = character
    else:
        if i == len(content) - 1:
            if test_word(currentWord, keywordsNodes, keywordsLinks):
                keywords.append(currentWord)
            elif test_word(currentWord, nodes, links):
                tokens.append(currentWord)


print("TOKENS: ")
print(tokens)
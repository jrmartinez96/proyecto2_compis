
# Test
for word in words:
    # si es keyword
    if test_word(word, keywordsNodes, keywordsLinks):
        keywords.append(word)
    elif test_word(word, nodes, links):
        tokens.append(word)

print("TOKENS: ")
print(tokens)

print("\rKEYWORDS: ")
print(keywords)
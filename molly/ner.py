#Named Entity Recognition Library

def recognize(text):
    #dummy implementation
    recognizedEntity = ''
    if (text == 'Greece'): recognizedEntity = 'Country'
    if (text == '2011'): recognizedEntity = 'Year'
    return recognizedEntity;
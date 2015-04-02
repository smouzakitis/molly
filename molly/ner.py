#Named Entity Recognition Library
import lists

def recognize(text):
    #dummy NER implementation
    text = text.lower()
    recognizedEntity = 'Unknown Type'
    #Check if Country
    if any(text == s for s in lists.countries_list):
        recognizedEntity = 'Country'
        return recognizedEntity;
    #Check if Year
    if lists.is_int(text):
       number = int(text)
       if (number > 1900 and number < 2100): 
           recognizedEntity = 'Year'
           return recognizedEntity;
    #Check if Date
    if (lists.is_date(text)) :
          recognizedEntity = 'Date'
    return recognizedEntity;
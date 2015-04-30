from django.shortcuts import render
from django.http import HttpResponse
from django.utils import simplejson as json
import ner

def index(request):
    params = {'current': 'home'}
    return render(request, 'index.html', params)

def name_entity_recognition(request):
    if request.method == 'GET':
        #Get the array that contains the list of texts to recognize
        input_text_array = request.GET.getlist('text[]')
        data = {}
        i=0
        for text in input_text_array:
            #Recognize all strings / texts contained in the array
            data[i] = ner.recognize(text.strip())
            i+=1
        return HttpResponse(json.dumps(data), content_type = "application/json")
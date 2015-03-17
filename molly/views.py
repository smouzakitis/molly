from django.shortcuts import render

def index(request):
    params = {'current': 'home'}
    return render(request, 'index.html', params)
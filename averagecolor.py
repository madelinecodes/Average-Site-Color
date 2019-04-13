from PIL import Image
import requests
import json
import sys


def image_parse(url):

    try:
        image = Image.open(requests.get(url, stream=True).raw)
    except:
        # ignore malformed URLs
        return None
        
    # .gif images will not return RGB unless converted
    image = image.convert('RGB')

    red = []
    green = []
    blue = []
    pixels = list(image.getdata())

    for idx, pixel in enumerate(pixels):
        red.append(pixel[0])
        green.append(pixel[1])
        blue.append(pixel[2])

    colors = [
        sum(red)/len(red),
        sum(green)/len(green),
        sum(blue)/len(blue)
    ]

    return {'colors': colors, 'pixels': len(pixels)}

import sys
import json
import urllib
from urllib import request, parse
from urllib.parse import urlparse, urljoin
from urllib.request import Request
from html.parser import HTMLParser
from collections import deque
from averagecolor import image_parse

img_attrs = set(['jpeg', 'jpg', 'png', 'gif'])

# disguised ourselves with browser-like user agent
agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'


class LinkParser(HTMLParser):
    def __init__(self, home, page_limit=True):
        super().__init__()
        self.home = home
        self.checked_links = set()
        self.pages_to_check = deque()
        self.pages_to_check.appendleft(home)
        self.images = list()
        self.page_limit = page_limit
        self.scanner()

    def scanner(self):
        while self.pages_to_check and self.page_limit:
            page = self.pages_to_check.pop()
            print(json.dumps({'crawling':page}), flush=True)
            try:
                req = Request(page, headers={'User-Agent': agent})
                res = request.urlopen(req)
            except:
                continue
            if 'html' in res.headers['content-type']:
                with res as f:
                    body = f.read().decode('utf-8', errors='ignore')
                    self.feed(body)
            self.page_limit -= 1
        self.average_color()

    # print the average color of all crawled images
    def average_color(self):
        pixels = sum([image['pixels'] for image in self.images])
        rgb_val = []
        # calculate the weighted average for each RGB value
        for i in range(3):
            color = [image['colors'][i] for image in self.images]
            weighted_nums = list()
            for idx, val in enumerate(color):
                weighted_nums.append(val * self.images[idx]['pixels'] / pixels)
            rgb_val.append(sum(weighted_nums))
        print(json.dumps({'finished':rgb_val}), flush=True)

    def handle_starttag(self, tag, attrs):
        for attr in attrs:
            # crawl unvisited hrefs
            if attr[0] == 'href' and attr[1] not in self.checked_links:
                link = self.fix_relative_url(attr[1])
                self.checked_links.add(attr[1])
                self.handle_link(link)
            # parse and compute all images
            elif attr[0] == 'src' and attr[1].split('.')[-1] in img_attrs:
                src = self.fix_relative_url(attr[1])
                self.handle_img(src)

    def handle_img(self, src):
        # attempt average color of individual img
        print(json.dumps({'scanning':src}), flush=True)
        image = image_parse(src)
        if image:
            self.images.append(image)

    def handle_link(self, link):
        # crawl within our domain
        if self.home in link:
            self.pages_to_check.appendleft(link)

    def fix_relative_url(self, link):
        if not bool(urlparse(link).netloc):
            link = urljoin(self.home, link)
        return link


LinkParser(sys.argv[1], int(sys.argv[2]))

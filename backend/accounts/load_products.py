import json
from django.core.management.base import BaseCommand
from foodapp.models import Product

class Command(BaseCommand):
    help = 'Load products data'

    def handle(self, *args, **kwargs):
        with open('products.json') as f:
            data = json.load(f)

        for item in data:
            Product.objects.create(**item)

        self.stdout.write(self.style.SUCCESS("Products loaded 🔥"))
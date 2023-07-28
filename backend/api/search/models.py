from django.db import models

'''
    e.g.
        type: search
        body: static cloud documentation

        type: click
        body: http://google.com
'''
class Action(models.Model):
    type = models.CharField(max_length = 100)

    body = models.CharField(max_length = 500)


    def __str__(self):
        return f'{self.type}: {self.body}'
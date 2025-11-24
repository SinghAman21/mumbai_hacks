from django.contrib import admin
from APP.models import *

admin.site.register(User)
admin.site.register(Group)
admin.site.register(GroupMember)
admin.site.register(Expense)
admin.site.register(ExpenseSplit)

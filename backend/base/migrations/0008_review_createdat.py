# Generated by Django 3.1.7 on 2021-05-11 02:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_auto_20210503_0640'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='createdAt',
            field=models.DateField(auto_now_add=True, null=True),
        ),
    ]
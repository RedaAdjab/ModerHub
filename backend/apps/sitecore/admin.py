from django.contrib import admin

from .models import Category, Comment, ContactMessage, NewsletterSubscriber, Post


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "category", "is_published", "published_at")
    list_filter = ("is_published", "category")
    search_fields = ("title", "excerpt", "body")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("post", "author", "is_approved", "created_at")
    list_filter = ("is_approved",)
    search_fields = ("body", "author__username", "post__title")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("email", "subject", "is_resolved", "created_at")
    list_filter = ("is_resolved",)
    search_fields = ("email", "subject", "message")


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("email",)

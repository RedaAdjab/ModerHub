from rest_framework import serializers

from .models import Category, Comment, ContactMessage, Post


class CategorySerializer(serializers.ModelSerializer):
    posts_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "description", "posts_count")


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Comment
        fields = ("id", "author", "author_username", "body", "created_at")
        read_only_fields = ("id", "author", "author_username", "created_at")

    def validate_body(self, value):
        body = value.strip()
        if len(body) < 3:
            raise serializers.ValidationError("Comment must contain at least 3 characters.")
        return body


class PostListSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True)
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            "id",
            "title",
            "slug",
            "excerpt",
            "cover_image_url",
            "author_username",
            "category",
            "category_name",
            "category_slug",
            "is_published",
            "published_at",
            "created_at",
            "comments_count",
        )

    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()


class PostDetailSerializer(PostListSerializer):
    body = serializers.CharField()
    comments = serializers.SerializerMethodField()

    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + ("body", "comments")

    def get_comments(self, obj):
        approved_comments = obj.comments.filter(is_approved=True).select_related("author")
        return CommentSerializer(approved_comments, many=True).data


class PostWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = (
            "title",
            "excerpt",
            "body",
            "cover_image_url",
            "category",
            "is_published",
        )

    def validate_excerpt(self, value):
        excerpt = value.strip()
        if len(excerpt) < 10:
            raise serializers.ValidationError("Excerpt must contain at least 10 characters.")
        return excerpt

    def validate_body(self, value):
        body = value.strip()
        if len(body) < 30:
            raise serializers.ValidationError("Body must contain at least 30 characters.")
        return body


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ("id", "name", "email", "subject", "message", "created_at")
        read_only_fields = ("id", "created_at")

    def validate_message(self, value):
        message = value.strip()
        if len(message) < 10:
            raise serializers.ValidationError("Message must contain at least 10 characters.")
        return message


class NewsletterSubscriberSerializer(serializers.Serializer):
    email = serializers.EmailField()

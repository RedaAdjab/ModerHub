from typing import Any, cast

from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import SAFE_METHODS, AllowAny, BasePermission, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Comment, ContactMessage, NewsletterSubscriber, Post
from .serializers import (
    CategorySerializer,
    CommentSerializer,
    ContactMessageSerializer,
    NewsletterSubscriberSerializer,
    PostDetailSerializer,
    PostListSerializer,
    PostWriteSerializer,
)

User = get_user_model()


class IsAuthorOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.none()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):  # pyright: ignore[reportIncompatibleMethodOverride]
        return Category.objects.annotate(
            posts_count=Count("posts", filter=Q(posts__is_published=True))
        )


class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.none()
    serializer_class = PostListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):  # pyright: ignore[reportIncompatibleMethodOverride]
        queryset = Post.objects.select_related("author", "category").prefetch_related("comments")
        user = self.request.user

        if user.is_authenticated:
            queryset = queryset.filter(Q(is_published=True) | Q(author=user)).distinct()
        else:
            queryset = queryset.filter(is_published=True)

        search_query = self.request.GET.get("q", "").strip()
        category_slug = self.request.GET.get("category", "").strip()

        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query)
                | Q(excerpt__icontains=search_query)
                | Q(body__icontains=search_query)
            )

        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        return queryset

    def get_serializer_class(self):  # pyright: ignore[reportIncompatibleMethodOverride]
        if self.request.method == "POST":
            return PostWriteSerializer
        return PostListSerializer

    def create(self, request, *args, **kwargs):
        serializer = PostWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save(author=request.user)
        return Response(PostDetailSerializer(post).data, status=status.HTTP_201_CREATED)


class FeaturedPostsView(generics.ListAPIView):
    queryset = Post.objects.none()
    serializer_class = PostListSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):  # pyright: ignore[reportIncompatibleMethodOverride]
        return (
            Post.objects.filter(is_published=True)
            .select_related("author", "category")
            .prefetch_related("comments")[:3]
        )


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.none()
    serializer_class = PostDetailSerializer
    lookup_field = "slug"
    permission_classes = [IsAuthorOrReadOnly]

    def get_queryset(self):  # pyright: ignore[reportIncompatibleMethodOverride]
        queryset = Post.objects.select_related("author", "category").prefetch_related(
            "comments__author"
        )
        user = self.request.user

        if self.request.method in SAFE_METHODS:
            if user.is_authenticated:
                return queryset.filter(Q(is_published=True) | Q(author=user)).distinct()
            return queryset.filter(is_published=True)

        return queryset.filter(author=user)

    def get_serializer_class(self):  # pyright: ignore[reportIncompatibleMethodOverride]
        if self.request.method in ("PUT", "PATCH"):
            return PostWriteSerializer
        return PostDetailSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        post = self.get_object()
        serializer = PostWriteSerializer(post, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        updated_post = serializer.save()
        return Response(PostDetailSerializer(updated_post).data, status=status.HTTP_200_OK)


class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.none()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_post(self):
        queryset = Post.objects.select_related("author")
        user = self.request.user

        if user.is_authenticated:
            queryset = queryset.filter(Q(is_published=True) | Q(author=user)).distinct()
        else:
            queryset = queryset.filter(is_published=True)

        return get_object_or_404(queryset, slug=self.kwargs["slug"])

    def get_queryset(self):  # pyright: ignore[reportIncompatibleMethodOverride]
        return Comment.objects.filter(post=self.get_post(), is_approved=True).select_related(
            "author"
        )

    def perform_create(self, serializer):
        serializer.save(post=self.get_post(), author=self.request.user)


class ContactMessageCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    queryset = ContactMessage.objects.all()


class NewsletterSubscribeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = NewsletterSubscriberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = cast(dict[str, Any], serializer.validated_data)
        email = validated_data.get("email")
        if not email:
            return Response(
                {"detail": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = email.lower()
        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=email,
            defaults={"is_active": True},
        )

        if not created and not subscriber.is_active:
            subscriber.is_active = True
            subscriber.save(update_fields=["is_active"])

        response_message = "Subscribed to newsletter successfully."
        if not created:
            response_message = "You are already subscribed to the newsletter."

        return Response(
            {"detail": response_message},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class SiteStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, _request):
        return Response(
            {
                "members": User.objects.count(),
                "posts": Post.objects.filter(is_published=True).count(),
                "categories": Category.objects.count(),
                "comments": Comment.objects.filter(is_approved=True).count(),
            }
        )

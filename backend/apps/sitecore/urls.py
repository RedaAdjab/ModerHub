from django.urls import path

from .views import (
    CategoryListView,
    CommentListCreateView,
    ContactMessageCreateView,
    FeaturedPostsView,
    NewsletterSubscribeView,
    PostDetailView,
    PostListCreateView,
    SiteStatsView,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="categories"),
    path("posts/", PostListCreateView.as_view(), name="posts"),
    path("posts/featured/", FeaturedPostsView.as_view(), name="featured-posts"),
    path("posts/<slug:slug>/", PostDetailView.as_view(), name="post-detail"),
    path(
        "posts/<slug:slug>/comments/",
        CommentListCreateView.as_view(),
        name="post-comments",
    ),
    path("contact/", ContactMessageCreateView.as_view(), name="contact"),
    path("newsletter/", NewsletterSubscribeView.as_view(), name="newsletter"),
    path("stats/", SiteStatsView.as_view(), name="stats"),
]

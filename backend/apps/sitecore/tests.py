from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Post

User = get_user_model()


class SiteCoreTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="author", password="AuthorPass123")
        Post.objects.create(
            author=self.user,
            title="First Post",
            excerpt="This is a short excerpt for the first post.",
            body="This is enough body text to satisfy serializer validation rules.",
            is_published=True,
        )

    def test_list_posts(self):
        response = self.client.get(reverse("posts"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_contact_message_submission(self):
        response = self.client.post(
            reverse("contact"),
            {
                "name": "Visitor",
                "email": "visitor@example.com",
                "subject": "Question",
                "message": "I would like to know more about your platform.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

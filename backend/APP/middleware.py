import jwt
from django.http import JsonResponse
from django.conf import settings
from clerk_backend_api import Clerk
from .models import User

class ClerkAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.clerk = Clerk(bearer_auth=settings.CLERK_SECRET_KEY)

    def __call__(self, request):

        # Skip admin & static routes
        if request.path.startswith(("/admin", "/static", "/media")):
            return self.get_response(request)

        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            request.user = None
            return JsonResponse({"error": "Authorization header missing"}, status=401)

        token = auth_header.split(" ")[1]

        # STEP 1 — Verify Clerk session token
        try:
            session = self.clerk.sessions.verify(token)
            clerk_user_id = session["sub"]
        except Exception as e:
            return JsonResponse({"error": f"Invalid or expired token: {str(e)}"}, status=401)

        # STEP 2 — Fetch Clerk user safely
        try:
            clerk_user = self.clerk.users.get(clerk_user_id)
        except Exception:
            return JsonResponse({"error": "Unable to fetch Clerk user"}, status=500)

        # STEP 3 — Extract Clerk name safely
        first_name = clerk_user.first_name or ""
        last_name = clerk_user.last_name or ""
        full_name = f"{first_name} {last_name}".strip() or "User"

        # STEP 4 — Extract Clerk email safely
        email = (
            clerk_user.email_addresses[0].email_address
            if clerk_user.email_addresses
            else None
        )

        # STEP 5 — Sync user into your database
        user, created = User.objects.get_or_create(
            clerk_user_id=clerk_user_id,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "name": full_name,
                "email": email,
                "profile_image_url": clerk_user.profile_image_url,
            }
        )

        # STEP 6 — Update user if data changed (no duplicate saves)
        updated = False

        if not created:
            if user.first_name != first_name:
                user.first_name = first_name
                updated = True

            if user.last_name != last_name:
                user.last_name = last_name
                updated = True

            if user.name != full_name:
                user.name = full_name
                updated = True

            if user.email != email:
                user.email = email
                updated = True

            if user.profile_image_url != clerk_user.profile_image_url:
                user.profile_image_url = clerk_user.profile_image_url
                updated = True

            if updated:
                user.save()

        # STEP 7 — Attach user to request
        request.user = user
        request.clerk_user_id = clerk_user_id

        return self.get_response(request)

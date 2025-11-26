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
        # Skip auth for these paths
        public_paths = ['/admin/', '/api/public/']
        if any(request.path.startswith(path) for path in public_paths):
            return self.get_response(request)

        # Get token from Authorization header
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Missing or invalid authorization header'}, status=401)

        token = auth_header.split(' ')[1]

        try:
            # Verify the token with Clerk
            verified_token = self.clerk.jwt_templates.verify_token(token)
            
            # Get or create user
            clerk_user_id = verified_token.get('sub')  # Clerk user ID
            
            # Get user details from Clerk
            clerk_user = self.clerk.users.get(clerk_user_id)
            
            # Get or create Django user
            user, created = User.objects.get_or_create(
                clerk_user_id=clerk_user_id,
                defaults={
                    'name': f"{clerk_user.first_name} {clerk_user.last_name}",
                    'email': clerk_user.email_addresses[0].email_address if clerk_user.email_addresses else None,
                    'profile_image_url': clerk_user.image_url,
                }
            )
            
            # Update user info if not newly created
            if not created:
                user.name = f"{clerk_user.first_name} {clerk_user.last_name}"
                user.email = clerk_user.email_addresses[0].email_address if clerk_user.email_addresses else user.email
                user.profile_image_url = clerk_user.image_url
                user.save()
            
            # Attach user to request
            request.user = user
            request.clerk_user_id = clerk_user_id
            
        except Exception as e:
            return JsonResponse({'error': f'Invalid token: {str(e)}'}, status=401)

        return self.get_response(request)
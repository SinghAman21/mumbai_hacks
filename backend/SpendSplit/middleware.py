import jwt
import requests
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.http import JsonResponse
from .models import User
import os

class ClerkAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check for Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                # Decode token without verification first to get issuer (if needed)
                # or just verify using the JWKS from the issuer.
                # Ideally, we should cache the JWKS.
                
                # For this hackathon context, we'll fetch JWKS or use a configured key.
                # Assuming CLERK_ISSUER is in env or settings.
                # If not, we can try to decode unverified to find 'iss' claim.
                
                unverified_payload = jwt.decode(token, options={"verify_signature": False})
                issuer = unverified_payload.get('iss')
                
                if issuer:
                    jwks_url = f"{issuer}/.well-known/jwks.json"
                    jwks_client = jwt.PyJWKClient(jwks_url)
                    signing_key = jwks_client.get_signing_key_from_jwt(token)
                    
                    payload = jwt.decode(
                        token,
                        signing_key.key,
                        algorithms=["RS256"],
                        audience=unverified_payload.get('aud'), # Optional: verify audience if needed
                        options={"verify_aud": False} # Clerk tokens might have different aud
                    )
                    
                    print(f"DEBUG: Clerk JWT Payload: {payload}")

                    
                    # Token is valid. Sync user.
                    clerk_user_id = payload.get('sub')
                    email = payload.get('email')
                    first_name = payload.get('given_name')
                    last_name = payload.get('family_name')
                    
                    # If details are missing, fetch from Clerk API
                    if not email or not first_name:
                        try:
                            clerk_secret_key = os.getenv("CLERK_SECRET_KEY")
                            if clerk_secret_key:
                                headers = {'Authorization': f'Bearer {clerk_secret_key}'}
                                response = requests.get(f'https://api.clerk.com/v1/users/{clerk_user_id}', headers=headers)
                                if response.status_code == 200:
                                    clerk_data = response.json()
                                    first_name = clerk_data.get('first_name', '')
                                    last_name = clerk_data.get('last_name', '')
                                    email_addresses = clerk_data.get('email_addresses', [])
                                    if email_addresses:
                                        email = email_addresses[0].get('email_address')
                                        # Prefer primary
                                        for email_obj in email_addresses:
                                            if email_obj.get('id') == clerk_data.get('primary_email_address_id'):
                                                email = email_obj.get('email_address')
                                                break
                        except Exception as e:
                            print(f"Error fetching from Clerk API: {e}")

                    name = payload.get('name')
                    if not name:
                         name = f"{first_name} {last_name}".strip()
                    
                    user, created = User.objects.update_or_create(
                        clerk_user_id=clerk_user_id,
                        defaults={
                            'email': email,
                            'first_name': first_name,
                            'last_name': last_name,
                            'name': name,
                        }
                    )
                    
                    request.user = user
                else:
                    # Invalid token format
                    pass

            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token expired'}, status=401)
            except jwt.InvalidTokenError as e:
                return JsonResponse({'error': f'Invalid token: {str(e)}'}, status=401)
            except Exception as e:
                print(f"Auth Middleware Error: {e}")
                # Don't crash, just let it be anonymous or 401?
                # If we return 401 here, we block public routes if they send a bad token.
                # Better to just not set request.user (leave as Anonymous) unless we are sure.
                pass

        response = self.get_response(request)
        return response

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Property, Enquiry, Testimonial


def home(request):
    properties = Property.objects.filter(is_featured=True)
    testimonials = Testimonial.objects.filter(status='approved', is_active=True)
    context = {
        'properties': properties,
        'testimonials': testimonials,
    }
    return render(request, 'properties/index.html', context)


def property_detail(request, pk):
    prop = get_object_or_404(Property, pk=pk)
    return render(request, 'properties/property_detail.html', {'property': prop})


@require_POST
def submit_enquiry(request):
    try:
        data = json.loads(request.body)
        Enquiry.objects.create(
            full_name=data.get('full_name', ''),
            phone=data.get('phone', ''),
            email=data.get('email', ''),
            interest=data.get('interest', ''),
            budget=data.get('budget', ''),
            message=data.get('message', ''),
        )
        return JsonResponse({'status': 'success', 'message': 'Enquiry submitted successfully.'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@require_POST
def submit_testimonial(request):
    try:
        data = json.loads(request.body)

        name = data.get('name', '').strip()
        role = data.get('role', '').strip()
        text = data.get('text', '').strip()
        rating = int(data.get('rating', 5))

        if not name or not text:
            return JsonResponse({'status': 'error', 'message': 'Name and review are required.'}, status=400)
        if not (1 <= rating <= 5):
            rating = 5

        Testimonial.objects.create(
            name=name,
            role=role if role else 'Client',
            text=text,
            rating=rating,
            status='pending',
            is_active=False,
            is_user_submitted=True,
        )
        return JsonResponse({
            'status': 'success',
            'message': 'Thank you! Your review has been submitted and will appear after approval.'
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
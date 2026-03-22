from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('property/<int:pk>/', views.property_detail, name='property_detail'),
    path('enquiry/submit/', views.submit_enquiry, name='submit_enquiry'),
    path('testimonial/submit/', views.submit_testimonial, name='submit_testimonial'),  # ← ADD THIS
]
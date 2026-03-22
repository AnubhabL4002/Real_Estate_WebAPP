from django.db import models
from django.utils import timezone


class Property(models.Model):
    LISTING_TYPE_CHOICES = [
        ('sale', 'For Sale'),
        ('rent', 'For Rent'),
    ]
    BADGE_CHOICES = [
        ('badge-sale', 'For Sale'),
        ('badge-rent', 'For Rent'),
        ('badge-new', 'New Launch'),
    ]

    name = models.CharField(max_length=200)
    location = models.CharField(max_length=300)
    price = models.CharField(max_length=100)
    listing_type = models.CharField(max_length=10, choices=LISTING_TYPE_CHOICES, default='sale')
    tag = models.CharField(max_length=50, default='For Sale')
    tag_class = models.CharField(max_length=20, choices=BADGE_CHOICES, default='badge-sale')
    beds = models.CharField(max_length=10, default='3')
    baths = models.CharField(max_length=10, default='2')
    area = models.CharField(max_length=50)
    floor = models.CharField(max_length=50)
    contact = models.CharField(max_length=20)
    agent = models.CharField(max_length=100)
    image_url = models.URLField(max_length=500, blank=True, default='')
    description = models.TextField()
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Properties'

    def __str__(self):
        return self.name

    def agent_initials(self):
        return ''.join([word[0].upper() for word in self.agent.split()])


class Enquiry(models.Model):
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    interest = models.CharField(max_length=100)
    budget = models.CharField(max_length=100)
    message = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name_plural = 'Enquiries'

    def __str__(self):
        return f"{self.full_name} — {self.submitted_at.strftime('%d %b %Y')}"


class Testimonial(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    name = models.CharField(max_length=100)
    role = models.CharField(
        max_length=150,
        help_text="E.g. Homeowner, Vasant Kunj  or  Investor, Gurugram"
    )
    text = models.TextField()
    avatar_url = models.URLField(max_length=500, blank=True)
    rating = models.IntegerField(default=5)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    is_active = models.BooleanField(
        default=False,
        help_text="Approved testimonials only appear on site when this is checked."
    )
    order = models.IntegerField(default=0, help_text="Lower number = appears first")
    submitted_at = models.DateTimeField(default=timezone.now)
    is_user_submitted = models.BooleanField(default=False)

    class Meta:
        ordering = ['order', '-submitted_at']
        verbose_name_plural = 'Testimonials'

    def __str__(self):
        return f"{self.name} [{self.get_status_display()}]"

    def stars(self):
        return '★' * self.rating
from django.contrib import admin
from .models import Property, Enquiry, Testimonial


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'price', 'listing_type', 'tag', 'agent', 'is_featured', 'created_at']
    list_filter = ['listing_type', 'is_featured', 'tag_class']
    search_fields = ['name', 'location', 'agent']
    list_editable = ['is_featured']
    ordering = ['-created_at']


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone', 'email', 'interest', 'budget', 'submitted_at', 'is_read']
    list_filter = ['interest', 'is_read', 'submitted_at']
    search_fields = ['full_name', 'phone', 'email']
    list_editable = ['is_read']
    readonly_fields = ['full_name', 'phone', 'email', 'interest', 'budget', 'message', 'submitted_at']
    ordering = ['-submitted_at']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'role', 'rating_stars', 'status', 'is_active',
        'is_user_submitted', 'submitted_at', 'order'
    ]
    list_filter = ['status', 'is_active', 'is_user_submitted', 'rating']
    list_editable = ['status', 'is_active', 'order']
    search_fields = ['name', 'role', 'text']
    ordering = ['-submitted_at']
    readonly_fields = ['submitted_at', 'is_user_submitted']
    actions = ['approve_selected', 'reject_selected']

    def rating_stars(self, obj):
        return '★' * obj.rating + '☆' * (5 - obj.rating)
    rating_stars.short_description = 'Rating'

    def approve_selected(self, request, queryset):
        updated = queryset.update(status='approved', is_active=True)
        self.message_user(request, f'{updated} testimonial(s) approved and published.')
    approve_selected.short_description = '✅ Approve & publish selected testimonials'

    def reject_selected(self, request, queryset):
        updated = queryset.update(status='rejected', is_active=False)
        self.message_user(request, f'{updated} testimonial(s) rejected.')
    reject_selected.short_description = '❌ Reject selected testimonials'

# Capital Consultancy Services — Django Web App

A modern, formal real estate website built with Django.

---

## 🚀 Quick Setup

### 1. Prerequisites
- Python 3.10 or higher
- pip

### 2. Clone / Extract the project
```bash
cd capital_consultancy
```

### 3. Create a virtual environment (recommended)
```bash
python -m venv venv

# Activate it:
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

### 4. Install dependencies
```bash
pip install -r requirements.txt
```

### 5. Run database migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Load sample property data
```bash
python manage.py loaddata properties/fixtures/initial_data.json
```
This loads **6 sample properties** and **4 testimonials** into the database.

### 7. Create an admin superuser
```bash
python manage.py createsuperuser
```
Follow the prompts to set username, email, and password.

### 8. Start the development server
```bash
python manage.py runserver
```

Open your browser and go to:
- 🌐 **Website:** http://127.0.0.1:8000/
- 🔧 **Admin Panel:** http://127.0.0.1:8000/admin/

---

## 📁 Project Structure

```
capital_consultancy/
├── manage.py
├── requirements.txt
├── README.md
├── capital_consultancy/         # Django project config
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── properties/                  # Main app
    ├── models.py                # Property, Enquiry, Testimonial models
    ├── views.py                 # home, property_detail, submit_enquiry
    ├── urls.py                  # URL routing
    ├── admin.py                 # Admin panel config
    ├── fixtures/
    │   └── initial_data.json    # Sample data
    ├── templates/properties/
    │   ├── index.html           # Home page
    │   └── property_detail.html # Property detail page
    └── static/properties/
        ├── css/style.css        # All styles
        └── js/main.js           # Modal, countup, AJAX form
```

---

## 🛠 Features

| Feature | Details |
|---|---|
| Home page | Hero, Stats, About, Listings, Services, Testimonials, Contact |
| Property cards | Image, name, location, beds/baths/area, contact number, modal popup |
| Property detail page | Full page at `/property/<id>/` with specs, amenities, agent sidebar |
| Contact form | AJAX submission — saves to DB, no page reload |
| Admin panel | Add/edit/delete properties, view enquiries, manage testimonials |
| Fixtures | Pre-loaded sample data via `loaddata` |
| Responsive | Mobile-friendly layout |

---

## ⚙️ Admin Panel Guide

Go to `/admin/` and log in with your superuser credentials.

- **Properties** → Add, edit, delete listings. Toggle `is_featured` to show/hide on homepage.
- **Enquiries** → View all contact form submissions. Mark as read.
- **Testimonials** → Manage client reviews. Set `order` to control display sequence.

---

## 🔒 Production Notes

Before deploying to production:

1. Change `SECRET_KEY` in `settings.py` to a strong random value
2. Set `DEBUG = False`
3. Update `ALLOWED_HOSTS` with your domain
4. Configure a proper database (PostgreSQL recommended)
5. Set up WhiteNoise or a CDN for static files
6. Use `python manage.py collectstatic`

---


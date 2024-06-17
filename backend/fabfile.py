from fabric import task

@task
def migrate(c):
    """Run database migrations."""
    print('Running migrations...')
    c.run('python manage.py makemigrations')
    c.run('python manage.py migrate')

@task
def test(c):
    """Run tests."""
    print('Running tests...')
    c.run('python manage.py test')

@task
def start_server(c):
    """Start the Daphne server."""
    print('Starting Daphne server...')
    c.run('gunicorn backend.ecotrack.wsgi:application -w 4 -b 0.0.0.0:8000', pty=True)

@task
def deploy(c):
    """Deploy the application."""
    test(c)
    migrate(c)
    start_server(c)

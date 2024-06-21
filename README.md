# Smart Waste Management System:
<a href="https://main--eco-track-rw.netlify.app/">Eco-track RWANDA </a>

## Project Overview
This project is the final assignment for the Enterprise Web Development course, aimed at developing an innovative web application to solve real-world problems. Our project is a Smart Waste Management System designed to enhance waste collection, recycling, and resource management through intelligent technologies. The system supports three primary user roles: Household Users, Waste Collection Services, and Administrators.

## Technologies Used
- **Frontend**: React vite, HTML, CSS, JavaScript
- **Backend**: Django
- **Database**: SQLite
- **Deployment**: Netlify/Pythonanywhere
- **CI/CD**: GitHub Actions
- **Authentication**: Django-Auth/ JWT

## Features and Functionalities
### 1. User Registration and Login
- Users can register and log in to the system.
- Authentication managed with Django-Auth and JWT.

### 2. Waste Collection Schedule
- Household users can schedule waste collection and receive notifications.

### 3. Recycling Tracker
- Users can track their recycling efforts and view their environmental impact metrics.

### 4. Waste Collection Services Management
- Waste collection services can manage routes and schedules and track performance.

### 5. Admin Dashboard
- Administrators can monitor overall system performance and manage users.

## Project Setup

### Prerequisites
- Python 3.x
- React vite
- SQLite
- Git
- Pythonanywhere
- Netlify

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/amuhirwa/EcoTrack-Rwanda.git
   cd EcoTrack-Rwanda
   ```

2. **Backend Setup:**
   - Create a virtual environment and activate it:
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```
   - Install the required Python packages:
     ```bash
     pip install -r requirements.txt
     ```
   - Configure SQLite database settings in `settings.py`.
   - Run migrations:
     ```bash
     python manage.py migrate
     ```
   - Start the Django server:
     ```bash
     python manage.py runserver
     ```

3. **Frontend Setup:**
   - Navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
   - Install React.js packages:
     ```bash
     pnpm install
     ```
   - Start the React development server:
     ```bash
     pnpm run dev
     ```

### Database
- Configure SQLite database settings in the `settings.py` file.

### Deployment
- Deployed the frontend to netlify.
- Deployed the backend to pythonanywhere. Webhook triggers deployment script which pulls latest code, applied migrations, amd restarts server.
- Set up CI/CD pipeline with GitHub Actions to automatically run tests and deploy the application.

### CI/CD Pipeline
- Configure GitHub Actions to run tests and deploy the application automatically.

## Testing
- Write unit tests using the Unittest module.
- Ensure high code coverage and reliability.

## Contribution Guidelines
1. **Fork the Repository:**
   ```bash
   git fork https://github.com/amuhirwa/EcoTrack-Rwanda.git
   ```

2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Changes:**
   ```bash
   git commit -m "Add your feature"
   ```

4. **Push to the Branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request:**
   - Go to the GitHub repository and click "New Pull Request."

## Team Members
- Alain Muhirwa Michael
- Loue Christian Sauveur 
- Dean Daryl Murenzi
- Reponse Ashimwe
- Patrick Nayituriki 

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements
- Instructor: [Deji Adebayo]
- Course: Enterprise Web Development
- University: African Leadership University

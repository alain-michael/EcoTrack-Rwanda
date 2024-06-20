# Smart Waste Management System:
##<a href="https://main--eco-track-rw.netlify.app/">Eco-track RWANDA </a>

## Project Overview
This project is the final assignment for the Enterprise Web Development course, aimed at developing an innovative web application to solve real-world problems. Our project is a Smart Waste Management System designed to enhance waste collection, recycling, and resource management through intelligent technologies. The system supports three primary user roles: Household Users, Waste Collection Services, and Administrators.

## Technologies Used
- **Frontend**: React, HTML, CSS, JavaScript, Bootstrap
- **Backend**: Django
- **Database**: PostgreSQL
- **Deployment**: Heroku/AWS
- **CI/CD**: GitHub Actions
- **Authentication**: Django-Auth

## Features and Functionalities
### 1. User Registration and Login
- Users can register and log in to the system.
- Authentication managed with Django-Auth.

### 2. Waste Collection Schedule
- Household users can schedule waste collection and receive notifications.

### 3. Recycling Tracker
- Users can track their recycling efforts and view their environmental impact metrics.

### 4. Waste Collection Services Management
- Waste collection services can manage routes, schedules, and track performance.

### 5. Admin Dashboard
- Administrators can monitor overall system performance and manage users.

## Project Setup

### Prerequisites
- Python 3.x
- Node.js
- PostgreSQL
- Git

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
   - Configure PostgreSQL database settings in `settings.py`.
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
   - Install Node.js packages:
     ```bash
     npm install
     ```
   - Start the React development server:
     ```bash
     npm start
     ```

### Database
- Configure PostgreSQL database settings in the `settings.py` file.

### Deployment
- Use Heroku or AWS for deployment.
- Set up CI/CD pipeline with GitHub Actions to automatically run tests and deploy the application.

### CI/CD Pipeline
- Configure GitHub Actions to run tests and deploy the application automatically.

## Data Structures and Algorithms
- Use appropriate data structures such as arrays, linked lists, trees, and graphs.
- Implement algorithms for scheduling, route optimization, and data analytics.

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
   - Go to the repository on GitHub and click on "New Pull Request".

## Team Members
- Alain muhirwa micheal
- Loue christian souver
- Dean daryl murenzi
- Reponse ashimwe
- Patrick nayituriki 

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements
- Instructor: [Deji]
- Course: Enterprise Web Development
- University: [African leadership university]

## Contact
For any inquiries, please contact us at [your-email@example.com].

---

# SensAI - AI-Powered Learning Management System

SensAI is an AI-first Learning Management System (LMS) designed to help educators teach more effectively and reach more students. The platform leverages AI to provide personalized learning experiences, automated assessments, and intelligent tutoring capabilities.

## Project Structure

The project is organized into two main components:

1. **Frontend (`/sensai-frontend`)**
   - Built with Next.js and TypeScript
   - Modern React-based UI with Tailwind CSS
   - Handles user interactions and presentation layer

2. **Backend (`/sensai-ai`)**
   - Python FastAPI application
   - Handles business logic, data processing, and AI integrations
   - RESTful API for frontend communication
   - Database management and data persistence

## Key Features

- **School & Course Management**
  - Create and manage educational institutions
  - Organize courses and learning materials
  - Handle user roles and permissions

- **AI-Powered Learning**
  - Intelligent tutoring system
  - Automated assessment generation
  - Code execution and evaluation (via Judge0 integration)

- **Collaboration Tools**
  - Team member management
  - Cohort-based learning groups
  - Progress tracking and analytics

## Getting Started

### Prerequisites

- Node.js (for frontend)
- Python 3.8+ (for backend)
- PostgreSQL database
- Redis (for caching and task queue)
- Judge0 (for code execution)

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd hyper
   ```

2. **Set up the backend**
   ```bash
   cd sensai-ai
   python -m venv venv
   source venv/bin/activate  # On Windows: .\\venv\\Scripts\\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../sensai-frontend
   npm ci
   cp .env.example .env.local
   # Update environment variables in .env.local
   ```

4. **Configure environment variables**
   - Set up database connection strings
   - Configure authentication providers
   - Add API keys for third-party services

### Running the Application

1. **Start the backend**
   ```bash
   cd sensai-ai
   uvicorn src.main:app --reload
   ```

2. **Start the frontend**
   ```bash
   cd ../sensai-frontend
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

## Development

### Testing

**Frontend Tests**
```bash
cd sensai-frontend
npm test
```

**Backend Tests**
```bash
cd sensai-ai
./run_tests.sh
```

### Code Style

- Frontend: ESLint and Prettier configured
- Backend: Black code formatter and Flake8 linter

## Deployment

Deployment instructions are available in the respective frontend and backend directories.

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://gitlab.com/hvacademy/sensai-ai/-/blob/main/docs/CONTRIBUTING.md) for details on how to get started.

## Support

For support, please:
- Check the [documentation](https://docs.sensai.hyperverge.org)
- Join our [community chat](https://chat.whatsapp.com/LmiulDbWpcXIgqNK6fZyxe)
- Open an issue in the appropriate repository

## License

[Specify License]

## Roadmap

Check out our public roadmap to see what we're working on and what's coming next: [SensAI Roadmap](https://hyperverge.notion.site/fa1dd0cef7194fa9bf95c28820dca57f)

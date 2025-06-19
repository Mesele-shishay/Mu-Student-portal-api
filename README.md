# MU eStudent API

A Node.js service for extracting student data from Mekelle University's eStudent portal.

## Project Structure

```
src/
├── config/           # Configuration and environment variables
├── constants/        # API endpoints and other constants
├── services/         # Core services
│   └── student-data/ # Student data extraction service
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
    ├── errors/      # Error handling classes
    ├── extractors/  # Data extraction modules
    ├── http/        # HTTP client setup
    ├── logger/      # Logging utilities
    └── parsers/     # Data parsing utilities
```

## Features

- 🔒 Secure authentication with CSRF protection
- 📊 Comprehensive student data extraction:
  - Personal information
  - Academic records
  - Course schedules
  - Grades and transcripts
  - Financial information
- 🚀 Modern TypeScript codebase
- 📝 Structured logging
- ⚡ Efficient data parsing
- 🛡️ Error handling

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with required environment variables:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
REQUEST_TIMEOUT=30000
```

## Usage

```typescript
import { StudentDataService } from "./services/student-data/student-data.service";

const studentService = new StudentDataService();

// Get student data
const studentData = await studentService.getStudentData({
  username: "your-username",
  password: "your-password",
});
```

## Error Handling

The service includes custom error classes for different scenarios:

- `UnauthorizedError`: Invalid credentials
- `ServiceUnavailableError`: Portal access issues
- `BadRequestError`: Invalid input data

## Development

- Built with TypeScript for type safety
- Uses Cheerio for HTML parsing
- Axios for HTTP requests
- Structured logging with timestamps and metadata
- Modular architecture for maintainability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this code for your projects.
"# Mu-Student-portal-api" 

# Crontab Expression Generator & Validator

A web-based tool to help you generate, validate and understand crontab expressions. Visit the live site at [https://crontab-e4c5f.web.app/](https://crontab-e4c5f.web.app/)

## Features

- 🎯 Visual crontab expression generator
- ✅ Real-time crontab validation
- 📖 Human-readable explanation of crontab expressions
- 🕒 Next execution time preview
- 💡 Common crontab examples
- 🎨 Clean and intuitive user interface

## Usage Guide

### Basic Syntax

A crontab expression consists of 5 fields:

### How to Use

1. **Visual Generator**:
   - Use the interactive fields to select your desired schedule
   - The expression will be automatically generated
   - View the human-readable explanation below

2. **Manual Input**:
   - Enter your crontab expression directly in the input field
   - The tool will validate it in real-time
   - See the next execution times instantly

3. **Examples**:
   - Click on common examples to understand different patterns
   - Use them as templates for your own schedules

### Common Patterns

- `* * * * *` - Every minute
- `0 * * * *` - Every hour
- `0 0 * * *` - Every day at midnight
- `0 0 * * 0` - Every Sunday at midnight
- `0 0 1 * *` - First day of every month at midnight

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
npm install
```

3. Deploy to Firebase:

```bash
firebase deploy
```


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

## Special Characters in Crontab

- `*` - Any value
- `,` - Value list separator (e.g., "1,3,5")
- `-` - Range of values (e.g., "1-5")
- `/` - Step values (e.g., "*/2")

## Examples with Explanations

1. **Every weekday at 9:30 AM**
   ```
   30 9 * * 1-5
   ```

2. **Every 15 minutes**
   ```
   */15 * * * *
   ```

3. **First Monday of every month at 12:00 PM**
   ```
   0 12 1-7 * 1
   ```

4. **Every Saturday and Sunday at 10:00 PM**
   ```
   0 22 * * 6,0
   ```

---

Made with ❤️ for developers who wrestle with cron expressions
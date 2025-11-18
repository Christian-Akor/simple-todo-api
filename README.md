# Simple TODO API

A minimal TODO REST API built with Node.js and Express. Uses a local JSON file (data.json) for persistence so it's easy to run locally.

## Endpoints

- GET /todos — list all todos
- POST /todos — create a todo (body: { title: string, completed?: boolean })
- PUT /todos/:id — update a todo (body: { title?: string, completed?: boolean })
- DELETE /todos/:id — delete a todo

## Run

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
# or for dev with auto-reload:
npm run dev
```

3. Open http://localhost:3000/todos

## Notes

- The project uses `data.json` at the project root to store todos. It's not suitable for production, but great for learning and prototyping.
- To reset data, delete or edit `data.json`.

## License

MIT

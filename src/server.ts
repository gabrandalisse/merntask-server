import app from './app';

const port: number = Number(process.env.PORT) || 4000;

app.listen(port, "0.0.0.0", () => {
  console.log(`⚡️ [server]: Server is running at https://localhost:${port}`);
});

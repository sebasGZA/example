export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    port: parseInt(process.env.DB_PORT, 10) || 5433,
  },
});

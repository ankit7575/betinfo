module.exports = {
  apps: [
    {
      name: "betinfo-backend",
      script: "./server.js",
      instances: 8,                   // 8 instances for 8 cores
      exec_mode: "cluster",           // Use cluster mode for multi-core
      max_memory_restart: "8G",       // Restart any process >2GB RAM (suitable for 16GB total)
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4000
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
      merge_logs: true,
    },
  ],
};

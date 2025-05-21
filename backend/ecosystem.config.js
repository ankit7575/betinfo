module.exports = {
  apps: [
    {
      name: "betinfo-backend",             // Unique app name
      script: "./server.js",               // Your entry point
      instances: 1,                        // Keep only 1 instance (128MB RAM)
      exec_mode: "fork",                   // Avoid cluster mode (uses more memory)
      max_memory_restart: "100M",          // Restart if memory goes above 100MB
      watch: false,                        // Disable file watching (RAM-saving)
      env: {
        NODE_ENV: "production",
        PORT: 4000
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
      merge_logs: true,                    // Combine logs from all instances
    },
  ],
};

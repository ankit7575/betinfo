module.exports = {
  apps: [
    {
      name: "betinfo-backend",
      script: "./server.js",          // Main entry point for your backend
      instances: "max",               // Use all available CPU cores, or set a fixed number like 8
      exec_mode: "cluster",           // Enables cluster mode for multi-core scaling
      max_memory_restart: "2G",       // Restart a process if it exceeds 2GB RAM (adjust as needed)
      watch: false,                   // Set to true only for development
      env: {
        NODE_ENV: "production",
        PORT: 4000
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
      merge_logs: true,
      out_file: "./logs/out.log",     // Optional: custom path for out logs
      error_file: "./logs/err.log"    // Optional: custom path for error logs
    }
  ]
};

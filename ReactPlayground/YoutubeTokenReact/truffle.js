module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8544,
      network_id: "*" // Match any network id
    }
  }
};

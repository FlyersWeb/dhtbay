module.exports = {
  apps : [{
    name: "loadDHT",
    script: "./loadDHT.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }, {
    name: "loadTorrent",
    script: "./loadTorrent.js",
    args: "--watch",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }, {
    name: "categorize",
    script: "./categorize.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }, {
    name: "crawlDHT",
    script: "./crawlDHT.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
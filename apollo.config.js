module.exports = {
  client: {
    service: {
      name: "result-log",
      localSchemaFile: "./schema.json"
    },
    excludes: ["src/resolvers.ts"]
  }
};

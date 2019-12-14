module.exports = {
  client: {
    service: {
      name: "result-log",
      localSchemaFile: "./graphql_schema.json"
    },
    excludes: ["src/resolvers.ts"]
  }
};

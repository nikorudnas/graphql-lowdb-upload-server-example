const typeDefs = `

scalar Date

type File {
  _id: String!
  filename: String!
  url: String!
  createdAT: Date!
}
type Query {
  getfiles: [File]!
}

type Mutation {
  uploadfiles(files: Upload!): Boolean
  removefile(filename: String!): Boolean
}

`;

export default typeDefs;

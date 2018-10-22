import project from './project';

const rootSchema = `
schema {
  query: Query
  mutation: Mutation
}
`;

const typeDefs = [rootSchema, project];

export default typeDefs;

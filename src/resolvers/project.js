import logic from '../logic/project';

const resolvers = {
  Query: {
    getfiles: (_, args, context) => logic.getfiles(args, context),
  },
  Mutation: {
    uploadfiles: (_, args, context) => logic.uploadfiles(args, context),
    removefile: (_, args, context) => logic.removefile(args, context),
  },
};

export default resolvers;

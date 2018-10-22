import { merge } from 'lodash';
import project from './project';

const rootResolver = {
  // Possible root resolver
};

const resolvers = merge(rootResolver, project);

export default resolvers;

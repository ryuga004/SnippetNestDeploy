import { userResolvers } from "./userResolver";

import { mergeResolvers } from "@graphql-tools/merge";

export const resolvers = mergeResolvers([userResolvers]);

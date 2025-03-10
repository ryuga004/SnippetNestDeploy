import { problemResolvers } from "./problemResolver";
import { snippetResolvers } from "./snippetResolvers";
import { submissionResolvers } from "./submissionResolvers";
import { userResolvers } from "./userResolver";

import { mergeResolvers } from "@graphql-tools/merge";

export const resolvers = mergeResolvers([userResolvers, problemResolvers, snippetResolvers, submissionResolvers]);

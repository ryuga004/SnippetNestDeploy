import { dashboardResolvers } from "./dashboardResolver";
import { problemResolvers } from "./problemResolver";
import { snippetResolvers } from "./snippetResolvers";
import { SolutionResolvers } from "./solutionResovers";
import { submissionResolvers } from "./submissionResolvers";
import { userResolvers } from "./userResolver";

import { mergeResolvers } from "@graphql-tools/merge";

export const resolvers = mergeResolvers([userResolvers, problemResolvers, snippetResolvers, submissionResolvers, SolutionResolvers, dashboardResolvers]);

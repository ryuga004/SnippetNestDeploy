import { dashboardTypeDefs } from "./dashboardSchema";
import { problemtypeDefs } from "./problemSchema";
import { snippetTypeDefs } from "./snippetSchema";
import { solutionTypeDef } from "./solutionSchema";
import { submissionTypeDefs } from "./submissionSchema";
import { userTypeDefs } from "./userSchema";

import { mergeTypeDefs } from "@graphql-tools/merge";

export const typeDefs = mergeTypeDefs([userTypeDefs, problemtypeDefs, snippetTypeDefs, submissionTypeDefs, solutionTypeDef, dashboardTypeDefs]);
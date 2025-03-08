import { userTypeDefs } from "./userSchema";

import { mergeTypeDefs } from "@graphql-tools/merge";

export const typeDefs = mergeTypeDefs([userTypeDefs]);
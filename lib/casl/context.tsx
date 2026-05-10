"use client"

import { createContext } from "react"
import { createContextualCan } from "@casl/react"
import { type AppAbility, defineAbilityFor } from "./ability"

export const AbilityContext = createContext<AppAbility>(defineAbilityFor("NONE"))
export const Can = createContextualCan(AbilityContext.Consumer)

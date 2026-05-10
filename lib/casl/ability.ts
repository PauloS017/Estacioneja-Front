import { AbilityBuilder, createMongoAbility, type MongoAbility } from "@casl/ability"

export type Actions = "manage" | "create" | "read" | "update" | "delete"
export type Subjects = "all" | "Equipamento" | "Usuario" | "Estacionamento" | "Dashboard" | "Configuracoes"

export type AppAbility = MongoAbility<[Actions, Subjects]>

export function defineAbilityFor(tipoAcesso: string): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (tipoAcesso === "MASTER") {
    can("manage", "all")
  } else if (tipoAcesso === "AUDITORIA") {
    can("read", "all")
    cannot("create", "all")
    cannot("update", "all")
    cannot("delete", "all")
  } else if (tipoAcesso === "GUARITA") {
    can("read", "Dashboard")
    can("read", "Estacionamento")
    cannot("manage", "Usuario")
    cannot("manage", "Configuracoes")
    cannot("manage", "Equipamento")
  } else {
    can("read", "Dashboard")
  }

  return build()
}

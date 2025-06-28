import { newEnforcer, Enforcer } from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';
import path from 'path';

let enforcer: Enforcer | null = null;

export async function getEnforcer(): Promise<Enforcer> {
  if (enforcer) return enforcer;
  const adapter = await PrismaAdapter.newAdapter({
    datasourceUrl: process.env.DATABASE_URL!,
  });
  const modelPath = path.join(__dirname, 'rbac_model.conf');
  enforcer = await newEnforcer(modelPath, adapter);
  return enforcer;
}

export async function checkPermission(sub: string, obj: string, act: string): Promise<boolean> {
  const e = await getEnforcer();
  return e.enforce(sub, obj, act);
}

export async function addPolicy(sub: string, obj: string, act: string) {
  const e = await getEnforcer();
  return e.addPolicy(sub, obj, act);
}

export async function addRoleForUser(user: string, role: string) {
  const e = await getEnforcer();
  return e.addRoleForUser(user, role);
}

export async function getRolesForUser(user: string) {
  const e = await getEnforcer();
  return e.getRolesForUser(user);
}

export async function getPermissionsForUser(user: string) {
  const e = await getEnforcer();
  return e.getImplicitPermissionsForUser(user);
}

import prisma from '../src/utils/prisma.js';

async function main() {
  // Create scopes
  const scopes = [
    'kyc:submit',
    'kyc:view',
    'kyc:review',
    'user:manage',
    'user:view',
    'notification:view',
  ];
  for (const name of scopes) {
    await prisma.scope.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Create roles
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  // Assign scopes to roles
  const userScopes = ['kyc:submit', 'kyc:view', 'notification:view'];
  const adminScopes = scopes;

  for (const scopeName of userScopes) {
    const scope = await prisma.scope.findUnique({ where: { name: scopeName } });
    if (scope) {
      await prisma.roleScope.upsert({
        where: { roleId_scopeId: { roleId: userRole.id, scopeId: scope.id } },
        update: {},
        create: { roleId: userRole.id, scopeId: scope.id },
      });
    }
  }
  for (const scopeName of adminScopes) {
    const scope = await prisma.scope.findUnique({ where: { name: scopeName } });
    if (scope) {
      await prisma.roleScope.upsert({
        where: { roleId_scopeId: { roleId: adminRole.id, scopeId: scope.id } },
        update: {},
        create: { roleId: adminRole.id, scopeId: scope.id },
      });
    }
  }

  console.log('Seed complete!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

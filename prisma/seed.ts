import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  const existingAdmin = await prisma.user.findFirst({
    where: { role: UserRole.ADMIN }
  });

  if (existingAdmin) {
    console.log('ℹ️  Un administrateur existe déjà:', existingAdmin.userName);
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      userName: 'admin',
      email: 'admin@blog.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Administrateur créé avec succès!');
  console.log('-----------------------------------');
  console.log('📧 Email:', admin.email);
  console.log('👤 Nom d\'utilisateur:', admin.userName);
  console.log('🔑 Mot de passe:', 'admin123');
  console.log('⚠️  IMPORTANT: Changez le mot de passe après la première connexion!');
  console.log('-----------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

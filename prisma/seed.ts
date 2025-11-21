import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { log } from 'node:console';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  const existingAdmin = await prisma.user.findFirst({
    where: { role: UserRole.ADMIN }
  });
  let admin;
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    admin = await prisma.user.create({
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
  } else {
    admin = existingAdmin;
    console.log('ℹ️  Un administrateur existe déjà:', admin.userName);
  }

  let users = [];
  const existingUser = await prisma.user.findFirst({ where: { role: UserRole.USER } });
  if (existingUser) {
    log('ℹ️  Des utilisateurs existent déjà, création ignorée.');
    users = await prisma.user.findMany({ where: { role: UserRole.USER } });
  } else {
    for (let i = 1; i <= 3; i++) {
      const userName = `user${i}`;
      const email = `user${i}@blog.com`;
      const password = await bcrypt.hash('user123', 10);
      const user = await prisma.user.create({
        data: {
          userName,
          email,
          password,
          role: UserRole.USER,
        },
      });
      users.push(user);
    }
    log('✅ 3 utilisateurs de test créés:');
    users.forEach((user) => {
      log(`- ${user.userName} (${user.email})`);
    });
  }

  const existingArticle = await prisma.article.findFirst();
  if (existingArticle) {
    console.log('ℹ️  Des articles existent déjà, création ignorée.');
  } else {
    const allUsers = [admin, ...users];
    for (let i = 1; i <= 200; i++) {
      const author = allUsers[i % allUsers.length];
      await prisma.article.create({
        data: {
          title: `Article de test n°${i}`,
          content: `Ceci est le contenu de l'article de test numéro ${i}.`,
          authorId: author.id,
          imageUrl: null,
          date: new Date(Date.now() - i * 86400000)
        },
      });
    }
    console.log('✅ 200 articles de test créés.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

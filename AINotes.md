**Outils IA utilisés :** Claude Sonnet 4.5 + ChatGPT 5.1 sur l'outil Copilot
intégré à VS Code.

**Quelques prompts utilisées :**

- « Il me manque JWT_SECRET dans les .env »

- Pièce jointe : fichier node.js.yml

<!-- -->

- ***Réponse de ChatGPT :***

1.  Va dans Settings → Secrets and variables → Actions → New repository
    secret.

2.  \[\...\]

- « On Namecheap, how do I configure the DNS records in order to verify
  my domain on Resend? »

<!-- -->

- ***Réponse de Claude Sonnet :***

In Namecheap\'s Advanced DNS tab, click ADD NEW RECORD and add these DNS
records from Resend: \[\...\]

- « Le seed n\'est pas lancé avec npm run seed »

<!-- -->

- ***Réponse de ChatGPT :***

Le script \"seed\": \"prisma db seed\" ne fonctionne que si tu as
configuré la section seed dans le bloc prisma de ton package.json ou
dans schema.prisma (ou un fichier .env), pour indiquer à Prisma comment
exécuter le seed. \[\...\]

- « Je veux une config de base pour le fichier eslint.config.js »

<!-- -->

- ***Réponse de ChatGPT :***

Voici une version compatible ESM pour eslint.config.js : \[..\]

- « Concernant la logique du auth rate limit, je pense que ce serait
  mieux d\'en faire un service, qu\'en penses-tu ? »

<!-- -->

- ***Réponse de ChatGPT :***

Oui, faire un service est clairement plus propre. Tu as des instincts
d'ingénieur logiciel, ça devient suspect.

On va structurer ça en mode "clean-ish" : \[\...\]

- « Explique-moi l\'utilité de Bull de manière générale et les
  alternantives qu\'il pourrait y avoir dans l\'éco-système javascript.
  »

<!-- -->

- ***Réponse de ChatGPT :***

Bull est une bibliothèque de files d\'attente (queues) pour Node.js
basée sur Redis. Elle permet de traiter des tâches lourdes en
arrière-plan (emails, génération PDF, traitement images) sans bloquer
l\'API. \[\...\]

- « J\'aimerais qu\'on s\'occupe du warning \"Jest did not exit one
  second after the test run has completed\" qui est provoqué lors du
  lancement des tests, qu\'est ce qui serait en cause ? »

<!-- -->

- ***Réponse de ChatGPT :***

Évidemment, maintenant que les tests passent, Jest continue de râler.
Normal, sinon ce serait trop simple.

Le warning : Jest did not exit one second after the test run has
completed. \[\...\]

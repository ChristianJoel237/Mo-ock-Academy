# 🎓 Mo-ock Academy — Projets de Formation Full Stack

Bienvenue sur ce repository ! Il regroupe l'ensemble des projets réalisés durant la formation Full Stack. Chaque dossier correspond à un projet pratique couvrant le développement frontend, backend et la gestion de bases de données.

---

## 🗂️ Structure du repository

```
Mo-ock-Academy/
├── Notes/
│   ├── notes_back_end/        → API REST pour la gestion des notes (Node.js + Express + MongoDB)
│   └── notes_front_end/       → Interface utilisateur des notes (React)
│
└── Phone_Book/
    ├── Back_end_phone_book/   → API REST du répertoire téléphonique (Node.js + Express + MongoDB)
    └── phonebook/             → Interface utilisateur du répertoire (React)
```

---

## 🛠️ Technologies utilisées

| Technologie | Rôle |
|---|---|
| **React** | Frontend (interface utilisateur) |
| **Node.js** | Environnement d'exécution backend |
| **Express** | Framework backend (API REST) |
| **MongoDB** | Base de données |
| **Mongoose** | ODM pour interagir avec MongoDB |

---

## ⚙️ Prérequis

Avant de commencer, assure-toi d'avoir installé sur ton ordinateur :

- [Node.js](https://nodejs.org) (version 16 ou supérieure)
- [MongoDB](https://www.mongodb.com/try/download/community) (version 7.0 recommandée)
- [Git](https://git-scm.com)

Pour vérifier que tout est bien installé, ouvre un terminal et tape :

```bash
node --version
npm --version
git --version
```

---

## 🚀 Comment cloner et lancer un projet

### Étape 1 — Cloner le repository

```bash
git clone https://github.com/ChristianJoel237/Mo-ock-Academy.git
```

Ensuite entre dans le dossier cloné :

```bash
cd Mo-ock-Academy
```

---

### Étape 2 — Lancer le Backend

Navigue vers le dossier backend du projet souhaité. Exemple avec le répertoire téléphonique :

```bash
cd Phone_Book/Back_end_phone_book/Back_end_phone_book
```

Installe les dépendances :

```bash
npm install
```

Crée un fichier `.env` à la racine du dossier backend :

```bash
MONGODB_URI=mongodb://localhost:27017/nom_de_ta_base
PORT=3001
```

> ⚠️ Remplace `nom_de_ta_base` par le nom que tu veux donner à ta base de données.

Lance le serveur backend :

```bash
npm start
```

Le serveur démarre sur **http://localhost:3001**

---

### Étape 3 — Lancer le Frontend

Ouvre un nouveau terminal et navigue vers le dossier frontend :

```bash
cd Phone_Book/phonebook/phonebook
```

Installe les dépendances :

```bash
npm install
```

Lance l'application React :

```bash
npm run dev
```

L'application s'ouvre sur **http://localhost:5173**

---

## 📁 Détail des projets

### 📒 Projet Notes

| Dossier | Description | Port |
|---|---|---|
| `notes_back_end` | API REST — CRUD des notes | 3001 |
| `notes_front_end` | Interface React des notes | 5173 |

**Fonctionnalités :**
- Afficher toutes les notes
- Ajouter une nouvelle note
- Modifier une note existante
- Supprimer une note

---

### 📞 Projet Phone Book

| Dossier | Description | Port |
|---|---|---|
| `Back_end_phone_book` | API REST — CRUD du répertoire | 3001 |
| `phonebook` | Interface React du répertoire | 5173 |

**Fonctionnalités :**
- Afficher tous les contacts
- Ajouter un nouveau contact
- Modifier le numéro d'un contact existant
- Supprimer un contact
- Filtrer les contacts par nom

---

## ❓ Problèmes fréquents

### MongoDB ne démarre pas
Assure-toi que le service MongoDB est bien lancé :

```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### Port déjà utilisé
Si le port 3001 est déjà utilisé, modifie la valeur `PORT` dans ton fichier `.env`.

### `node_modules` manquant
Si tu vois une erreur `Cannot find module`, c'est que les dépendances ne sont pas installées. Lance :

```bash
npm install
```

---

## 👤 Auteur

**Christian Joel** — Formation Full Stack  
GitHub : [@ChristianJoel237](https://github.com/ChristianJoel237)

---

## 📄 Licence

Ce projet est libre d'accès pour tous les membres de la formation. 🎓

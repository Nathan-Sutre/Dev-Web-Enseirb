# Dev-Web-Enseirb

Matériel d’enseignement pour le module de développement web (R&I, 2A).

## Contenu

- `ProjetWeb.md` : sujet détaillé du projet SeenFlix.
- `ProjetWeb.pdf` : version PDF du sujet (à télécharger / consulter).

## Base de données SQLite

La base est stockée dans le fichier `database/seenflix.db`. Il faut disposer de la commande `sqlite3` ; sur Ubuntu ou Debian, elle peut être installée avec :

```bash
sudo apt install sqlite3
```

Depuis la racine du dépôt, créez le fichier et ses tables avec le script SQL fourni :

```bash
sqlite3 database/seenflix.db < database/creation_base.sql
```

Pour vérifier que les tables ont été créées :

```bash
sqlite3 database/seenflix.db ".tables"
```

## Projet des étudiants

Chaque trinôme doit créer **son propre dépôt** pour développer le projet SeenFlix  
et ajouter `@Systemofalam` comme collaboratrice.


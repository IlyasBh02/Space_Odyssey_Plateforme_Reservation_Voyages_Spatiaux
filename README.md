# SpaceVoyager – Booking App

## Description

SpaceVoyager est une application front-end simple utilisant HTML, CSS, JavaScript et LocalStorage. Elle permet de simuler une authentification, créer et gérer des réservations, afficher un ticket et filtrer les destinations.

## Fonctionnalités Principales

* Login / Logout simulé
* Gestion de session via LocalStorage
* Formulaire de réservation dynamique
* Calcul du prix en temps réel
* Ajout de plusieurs passagers
* Validation des champs
* Sauvegarde des réservations
* Page “My Bookings”
* Edition et suppression
* Ticket imprimable
* Recherche, filtres et pagination

## User Stories (Simplifiées)

### Authentification & Session

**1. Login utilisateur (fake login)**

* Formulaire email + mot de passe
* Sauvegarde dans localStorage
* Redirection après connexion

**2. Session & Logout**

* Vérification du login à chaque page
* Affichage du nom/email
* Bouton Logout

### Création d’une réservation

**3. Formulaire dynamique**

* Données chargées depuis data.json
* Packages selon destination
* Champs dynamiques
* Ajout de passagers

**4. Calcul du prix en direct**

* Mise à jour automatique selon choix

**5. Validation du formulaire**

* Champs obligatoires
* Regex email & téléphone
* Dates futures limitées à 30 jours
* Erreurs inline

### Gestion des Bookings

**6. Sauvegarde de la réservation**

* Stockage LocalStorage
* ID unique
* Fonctionne même en guest

**7. Page “My Bookings”**

* Liste des réservations
* Infos principales visibles

**8. Modifier une réservation**

* Formulaire pré-rempli
* Sauvegarde sous le même ID

**9. Annuler une réservation**

* Confirmation
* Suppression LocalStorage

### Ticket

**10. Ticket imprimable**

* Page dédiée
* Bouton Print

### Recherche & Navigation

**11. Search + Filters + Pagination**

* Recherche texte
* Filtres (type, prix, durée, distance)
* Pagination 4 cartes/page

### Accessibilité & Performance

**13. Expérience optimisée**

* Navigation clavier
* Balises HTML sémantiques
* Images optimisées
* Responsive mobile-first

## Comment lancer le projet

1. Télécharger ou cloner le projet
2. Ouvrir index.html dans un navigateur
3. Tout fonctionne directement

#!/bin/bash
# Script de démarrage rapide pour Tatlight Backend

echo "🚀 Démarrage de Tatlight Backend..."
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier si venv existe
if [ ! -d "venv" ]; then
    echo "${YELLOW}⚠️  Environnement virtuel non trouvé. Création...${NC}"
    python3 -m venv venv
    echo "${GREEN}✅ Environnement virtuel créé${NC}"
fi

# Activer l'environnement virtuel
echo "${YELLOW}🔧 Activation de l'environnement virtuel...${NC}"
source venv/bin/activate

# Installer les dépendances
echo "${YELLOW}📦 Installation des dépendances...${NC}"
pip install -r requirements.txt

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "${YELLOW}⚠️  Fichier .env non trouvé. Copie depuis .env.example...${NC}"
    cp .env.example .env
    echo "${GREEN}✅ Fichier .env créé. N'oubliez pas de le configurer !${NC}"
fi

# Migrations
echo "${YELLOW}🗃️  Application des migrations...${NC}"
python manage.py makemigrations
python manage.py migrate

# Créer superuser si nécessaire
echo ""
read -p "Voulez-vous créer un superuser ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    python manage.py createsuperuser
fi

# Lancer le serveur
echo ""
echo "${GREEN}✅ Configuration terminée !${NC}"
echo ""
echo "🌐 Démarrage du serveur Django..."
echo "📍 Le serveur sera accessible sur: http://127.0.0.1:8000/"
echo "🔐 Admin: http://127.0.0.1:8000/admin/"
echo ""
python manage.py runserver
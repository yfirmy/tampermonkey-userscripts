# Auto Timesheet script
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/yfirmy/tampermonkey-userscripts/blob/master/auto-timesheet/README.fr.md) [![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/yfirmy/tampermonkey-userscripts/blob/master/auto-timesheet/README.md)

## Comment installer le script
 1. [Installez l'extension Tampermonkey](https://www.tampermonkey.net/) pour votre navigateur 
 2. Cliquez sur [ce lien](https://raw.github.com/yfirmy/tampermonkey-userscripts/main/auto-timesheet/auto-timesheet.user.js) and cliquez sur "Installer"
 3. Personnalisez le script (allez dans l'extension Tampermonkey, and modifier "Auto Timesheet Filler" directement)
    -  Modifiez la valeur de `WORK_HOURS` si nécessaire
    -  Modifiez la valeur de `LUNCH_HOURS` si necessaire 
    -  Modifiez vos lieux de travail (dans les paragraphes "Working location") si nécessaire
 4. Faites "Fichier > Enregistrer" dans l'insterface Tampermonkey, pour valider vos modifications

## Comment utiliser le script
Une fois le script installé et adapté (voir ci-dessus):
 1. Allez dans l'interface de création de Timesheet
 2. Créez une Timesheet
 3. Celle-ci sera automatiquement pré-remplie par le script
 4. Cliquer sur le lien "Informations additionnelles" pour laisser le script remplir cette partie également, et cliquer sur OK
 5. Sauvegardez ou Soumettez votre Timesheet

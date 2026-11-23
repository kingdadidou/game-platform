export const guides = [
  {
    "slug": "conseil-des-ombres",
    "title": "Conseil des Ombres",
    "href": "/lobby",
    "players": "5 à 10 joueurs",
    "intro": "Un jeu de déduction collective : les Agents cherchent à réussir trois missions tandis que les Ombres, infiltrées dans le groupe, tentent de les saboter. Les mêmes joueurs débattent ensemble, mais ne poursuivent pas tous le même objectif.",
    "sections": [
      [
        "Préparer la première mission",
        "Créez un salon, partagez son code et attendez que chacun soit prêt. Chaque participant consulte son rôle en privé. Le chef choisit une équipe dont la taille dépend du nombre de joueurs et du numéro de mission. Tout le monde vote sur la proposition, y compris les joueurs qui ne partent pas en mission. Une équipe approuvée passe à l’action ; sinon, un nouveau chef fait une proposition."
      ],
      [
        "Résoudre une mission et gagner",
        "Les membres de l’équipe agissent secrètement. Un Agent doit contribuer à la réussite. Une Ombre peut choisir de réussir pour conserver la confiance du groupe, ou saboter. Dans cette version, un seul sabotage suffit à faire échouer la mission. Le résultat révèle le nombre de sabotages, pas leurs auteurs. Les Agents gagnent avec trois réussites ; les Ombres avec trois échecs. Cinq équipes refusées de suite font également gagner les Ombres. Il y a donc cinq missions au maximum, même avec dix joueurs."
      ],
      [
        "Exemple : une équipe de deux échoue",
        "À cinq joueurs, Alice et Bruno participent à la première mission. Le résultat affiche un sabotage. On sait qu’au moins une Ombre figure dans cette équipe ; on ne sait pas laquelle. Si Alice participe ensuite avec Claire à une mission réussie, cela ne prouve pas son innocence : une Ombre peut volontairement réussir. Comparez les compositions et les votes au lieu de vous fier à une seule déclaration."
      ],
      [
        "Conseils pour les deux camps",
        "Comme Agent, expliquez ce que votre proposition permettra d’apprendre : changer une seule personne peut être plus instructif que remplacer toute une équipe. Comme Ombre, réussir une première mission peut rendre un sabotage ultérieur moins facile à attribuer. Attention toutefois : deux Ombres qui sabotent ensemble donnent davantage d’informations au groupe. Discutez des faits publics sans montrer votre dossier secret."
      ]
    ],
    "table": {
      "headers": [
        "Joueurs",
        "M1",
        "M2",
        "M3",
        "M4",
        "M5"
      ],
      "rows": [
        [
          "5",
          "2",
          "3",
          "2",
          "3",
          "3"
        ],
        [
          "6",
          "2",
          "3",
          "4",
          "3",
          "4"
        ],
        [
          "7",
          "2",
          "3",
          "3",
          "4",
          "4"
        ],
        [
          "8 à 10",
          "3",
          "4",
          "4",
          "5",
          "5"
        ]
      ]
    },
    "faq": [
      [
        "Une mission réussie innocente-t-elle toute l’équipe ?",
        "Non. Une Ombre peut choisir de contribuer à la réussite. Seul un échec garantit qu’au moins un saboteur était présent."
      ],
      [
        "Faut-il participer à l’équipe pour voter ?",
        "Non : tous les joueurs votent sur sa composition. Seuls les membres approuvés interviennent ensuite dans la mission."
      ]
    ]
  },
  {
    "slug": "dernier-conseil",
    "title": "Le Dernier Conseil",
    "href": "/dernier-conseil",
    "players": "5 à 10 joueurs",
    "intro": "Une assemblée élit des gouvernements qui font adopter des décrets. Les Gardiens défendent la République ; les Conspirateurs protègent le Dictateur et cherchent à installer l’Autorité. Les fonctions visibles ne révèlent pas le camp secret.",
    "sections": [
      [
        "Former un gouvernement",
        "Tous les joueurs consultent leur identité en secret. Les Conspirateurs connaissent leur camp. Le Dictateur connaît ses alliés dans les parties de cinq ou six joueurs ; à partir de sept, il ne les connaît pas. Le Premier ministre propose un Sénateur puis les délégués votent. Après trois élections refusées, le prochain décret est promulgué automatiquement, sans déclencher de pouvoir spécial."
      ],
      [
        "Comprendre le paquet de décrets",
        "La partie commence avec 17 cartes : 6 décrets républicains et 11 décrets d’autorité. Dans un gouvernement élu, le Premier ministre en reçoit trois et en écarte une. Il transmet les deux autres au Sénateur, qui en écarte une puis promulgue la dernière. Les cartes écartées restent secrètes. La défausse est remélangée lorsque la pioche ne suffit plus à un tirage. Un décret d’autorité ne démontre donc pas, à lui seul, la culpabilité des deux élus."
      ],
      [
        "Les conditions de victoire",
        "La République gagne avec six décrets républicains ou le bannissement du Dictateur. Le camp adverse gagne avec six décrets d’autorité. Il gagne aussi immédiatement si le Dictateur est élu Sénateur alors qu’au moins trois décrets d’autorité sont déjà en vigueur. À ce stade, le choix du Sénateur devient aussi décisif que le contenu des cartes."
      ],
      [
        "Exemple et méthode de discussion",
        "Le Premier ministre affirme avoir reçu trois cartes d’autorité. Le Sénateur confirme avoir reçu deux cartes d’autorité. Ce récit est compatible avec le paquet, mais ne prouve pas leur honnêteté. Comparez-le aux précédentes déclarations, aux votes publics et aux gouvernements successifs. Distinguez toujours ce qui a été observé de ce qu’un joueur affirme avoir vu. Ne révélez pas votre écran pour trancher un désaccord : le bluff fait partie du jeu."
      ]
    ],
    "table": {
      "headers": [
        "Décrets d’autorité",
        "Effet dans cette version"
      ],
      "rows": [
        [
          "2",
          "Inspection : consulter le camp d’un autre délégué, sans connaître son rôle exact."
        ],
        [
          "3",
          "Élection spéciale : choisir le prochain Premier ministre."
        ],
        [
          "4 et 5",
          "Bannissement : exclure un délégué ; bannir le Dictateur fait gagner la République."
        ],
        [
          "Dès 5",
          "Veto : le Sénateur propose de défausser ses deux cartes ; le Premier ministre doit accepter."
        ]
      ]
    },
    "faq": [
      [
        "Un veto accepté est-il gratuit ?",
        "Non. Il augmente le compteur des élections refusées et peut donc conduire à une promulgation automatique."
      ],
      [
        "Une inspection identifie-t-elle le Dictateur ?",
        "Non. Elle renseigne sur le camp, pas sur l’identité précise du rôle."
      ]
    ]
  },
  {
    "slug": "metropole",
    "title": "Métropole",
    "href": "/metropole",
    "players": "2 à 6 joueurs",
    "intro": "Métropole associe achats de villes d’Île-de-France, loyers, constructions, négociations et marché d’actions fictives. Votre objectif est de conserver une trésorerie suffisante tout en développant le patrimoine le plus élevé.",
    "sections": [
      [
        "Choisir la carte et préparer les règles",
        "Avant le départ, l’hôte choisit entre le réseau à embranchements et le circuit classique de 40 cases. Il règle aussi le capital initial, les enchères, le doublement du loyer des quartiers complets et la construction équilibrée. Sur le réseau, une gare permet de choisir la suite du trajet : les déplacements restants sont conservés après le choix. Sur le circuit, les gares sont des biens achetables sans embranchement. Les joueurs commencent ensemble sur la case de départ prévue par la carte."
      ],
      [
        "Acheter, construire et conserver des liquidités",
        "Lancez les deux dés ; un double permet de rejouer après résolution de la case. Une propriété libre peut être achetée. Si vous passez et que les enchères sont activées, les autres investisseurs peuvent participer à la vente. Un adversaire arrêté sur un bien vous verse son loyer, sauf si le bien est hypothéqué. Pour construire, possédez tout le quartier et respectez l’équilibre des maisons si cette option est active. En cas de dette, vendez des actifs ou des actions pour retrouver une trésorerie positive."
      ],
      [
        "Investir dans les entreprises",
        "Chaque entreprise dispose de 100 actions. Vous pouvez acheter ou vendre à votre tour avant les dés, ou pendant la visite d’une entreprise. Le nombre d’opérations n’est plus limité à trois ; le budget et les titres disponibles limitent les achats. Chaque transaction coûte 2 %, avec un minimum de 1 M. Les cours varient selon les journées, les événements, certaines constructions et les transactions. Les dividendes sont versés à l’ouverture des journées suivantes jusqu’à la vingtième. Il s’agit uniquement de monnaie et de titres de jeu."
      ],
      [
        "Exemple : calculer le coût réel",
        "Dix actions à 40 M coûtent 400 M, auxquels s’ajoutent 8 M de frais : votre trésorerie diminue de 408 M. Leur valeur dans le patrimoine suit ensuite le cours actuel ; elle n’est pas un gain garanti. Gardez une réserve pour les loyers et taxes. Le Café des affaires permet de proposer des propriétés, des actions et de l’argent : l’autre joueur doit accepter. Une offre n’immobilise pas les titres ; leur disponibilité est vérifiée à l’acceptation."
      ],
      [
        "Fin de partie et choix stratégiques",
        "Le dernier investisseur solvable gagne. Sinon, après vingt journées, le patrimoine le plus élevé l’emporte : trésorerie, valeur des biens, constructions et actions. Les biens hypothéqués ont une valeur réduite. Un joueur riche en titres peut manquer de liquidités à court terme ; comparez donc votre réserve d’argent à vos risques de loyer avant un gros achat. Une série de villes complémentaires peut être plus utile qu’une accumulation de biens isolés."
      ]
    ],
    "faq": [
      [
        "Fermer le marché termine-t-il le tour ?",
        "Le bouton de fermeture replie seulement le panneau. Sur une entreprise, utilisez « Continuer après la visite » pour terminer cette phase."
      ],
      [
        "Peut-on échanger des actions ?",
        "Oui : choisissez les quantités de chaque côté de l’offre dans le Café des affaires, éventuellement avec des propriétés et de l’argent."
      ]
    ]
  },
  {
    "slug": "traitres-a-bord",
    "title": "Traîtres à bord !",
    "href": "/traitre-a-bord",
    "players": "3 à 8 joueurs",
    "intro": "Des Pirates remplissent un coffre pendant que des Mutins cherchent à faire échouer l’équipage. Les cartes Butin restent cachées : il faut retenir les annonces, observer les actions et décider à qui faire confiance.",
    "sections": [
      [
        "Le tour de jeu et les annonces",
        "Chacun commence avec trois cartes. À votre tour, ajoutez un Butin au Coffre face cachée et annoncez +1, 0 ou −2, ou jouez une carte Action face visible. L’annonce peut être un mensonge : elle n’est pas une mesure fiable du contenu réel. Après un Butin ou la plupart des Actions, piochez une carte. La Pêche miraculeuse a son propre renouvellement de main. Vos cartes en main restent personnelles."
      ],
      [
        "Quand vérifier le Coffre",
        "Au début de son tour, un Pirate peut révéler son rôle et vérifier le Coffre. Si sa valeur réelle atteint l’objectif, les Pirates gagnent ; sinon, les Mutins gagnent immédiatement. Les Pirates gagnent aussi lorsque tous les Mutins sont éliminés. Les Mutins gagnent quand ils ne sont plus en infériorité numérique à bord ou quand la Pioche est vide. L’objectif dépend de la taille du groupe : consultez la table avant de commencer."
      ],
      [
        "Exemple : une annonce trompeuse",
        "Trois joueurs annoncent chacun +1. Cela ne garantit pas une hausse totale de trois : une carte de valeur −2 peut avoir été annoncée +1. Une Longue-vue apporte une information sur les dernières cartes du Coffre, pas sur tout son contenu. Avant de réclamer la victoire, confrontez ce renseignement aux annonces dont vous vous souvenez et aux cartes retirées par Bon débarras."
      ],
      [
        "Conseils de mémoire et de bluff",
        "Retenez qui annonce une contribution positive et à quel moment. Une Planche peut servir à éliminer un suspect, mais bannir un Pirate rapproche aussi les Mutins de la parité. Ne confondez pas le nombre de cartes du Coffre avec leur valeur. La plateforme met en avant la dernière action sans proposer d’historique détaillé des contributions : l’incertitude et la mémoire font partie de la partie."
      ]
    ],
    "table": {
      "headers": [
        "Carte",
        "Effet"
      ],
      "rows": [
        [
          "Butin",
          "Ajouter +1, 0 ou −2 au Coffre, face cachée."
        ],
        [
          "Planche",
          "Une Planche devant une autre personne ; à trois, elle révèle son rôle et passe à l’eau."
        ],
        [
          "Longue-vue",
          "Consulter secrètement les trois cartes du dessus du Coffre et les remettre dans l’ordre choisi."
        ],
        [
          "Vide tes poches",
          "Un autre joueur défausse sa main et pioche trois cartes, selon les disponibilités."
        ],
        [
          "Bon débarras",
          "Retirer sans les révéler les deux cartes du dessus du Coffre."
        ],
        [
          "Pêche miraculeuse",
          "Piocher trois cartes puis remettre deux cartes de sa main sur la Pioche, sans pioche supplémentaire en fin de tour."
        ]
      ]
    },
    "faq": [
      [
        "Quel objectif pour mon groupe ?",
        "À 3, 4, 5, 6, 7 et 8 joueurs, l’objectif vaut respectivement 5, 8, 11, 6, 9 et 12. Il y a un Mutin de 3 à 5 joueurs, puis deux de 6 à 8."
      ],
      [
        "Les annonces sont-elles forcément vraies ?",
        "Non. Un joueur peut mentir sur le Butin qu’il ajoute ; seule une vérification autorisée révèle des cartes."
      ]
    ]
  },
  {
    "slug": "frontieres-express",
    "title": "Frontières Express",
    "href": "/frontieres-express",
    "players": "2 à 6 joueurs",
    "intro": "Une campagne de conquête en huit manches. Chaque commandant prépare ses ordres sans voir ceux des autres ; les décisions sont ensuite résolues ensemble. La diplomatie sert à anticiper les fronts, mais les promesses ne remplacent pas les ordres validés.",
    "sections": [
      [
        "Préparer et valider ses ordres",
        "À chaque manche, programmez au maximum deux ordres : recruter ou déplacer des unités vers une région voisine. Un déplacement doit laisser au moins une unité dans la région de départ. Vérifiez les voisins sur la carte avant d’engager un groupe. Validez vos ordres lorsque votre plan est prêt : tant que les commandants n’ont pas validé, la manche reste en préparation et le score peut ne pas évoluer."
      ],
      [
        "Résoudre les opérations",
        "Les recrutements sont appliqués avant les déplacements. Pour conquérir une région, l’attaque doit engager plus d’unités que la défense ; une égalité ne suffit pas. Les autres joueurs peuvent également renforcer ou déplacer leurs armées : le nombre visible pendant la préparation n’est donc pas une promesse de défense immobile. Tenez compte des mouvements simultanés plutôt que de calculer chaque attaque comme un duel isolé."
      ],
      [
        "Ravitaillement et victoire",
        "Chaque nouvelle manche apporte un point de ravitaillement par région contrôlée, plus deux si vous détenez encore votre capitale. Contrôler sept régions donne une victoire immédiate. Sinon, à la fin des huit manches, le score additionne dix points par région, les unités présentes sur vos territoires et le ravitaillement restant. Un territoire compte donc à la fois pour le score et pour vos ressources futures."
      ],
      [
        "Exemple : ouvrir un front sans se découvrir",
        "Une région contient cinq unités. En envoyer quatre laisse une unité sur place, ce qui respecte la règle, mais expose fortement le départ. Si la cible possède trois défenseurs, quatre attaquants dépassent cette défense visible ; un recrutement adverse peut cependant changer le rapport de force. Comparez cette option à une expansion vers une région moins disputée, ou à un recrutement qui prépare la manche suivante."
      ],
      [
        "Conseils pour une campagne courte",
        "Les huit manches donnent peu de temps pour réparer un mauvais déploiement. Choisissez des territoires reliés, gardez une marge sur les frontières menacées et évitez de multiplier les engagements que deux ordres ne peuvent pas soutenir. En fin de campagne, examinez le score complet : conserver des unités et du ravitaillement peut départager des joueurs qui contrôlent autant de régions. Vérifiez toujours que vos ordres sont bien validés avant d’attendre la résolution."
      ]
    ],
    "faq": [
      [
        "Pourquoi les scores n’ont-ils pas changé ?",
        "La sélection d’ordres ne suffit pas. Les commandants doivent valider pour déclencher la résolution de la manche."
      ],
      [
        "Une attaque à égalité gagne-t-elle ?",
        "Non : l’attaque doit dépasser strictement la défense. Anticipez également les renforts que l’adversaire peut programmer."
      ]
    ]
  }
];

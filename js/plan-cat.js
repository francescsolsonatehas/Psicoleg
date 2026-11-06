/* Catàleg del pla personal: àrees, nivells i passos proposats. Compartit per pla.js i dades.js. */
(function(){
  var __=PSI.t;
  window.PSI_PLAN={
    keys:['son','anim','ansietat','estres','connexio'],
    areas:{son:__('Son'),anim:__('Ànim'),ansietat:__('Ansietat i preocupació'),estres:__('Estrès i sobrecàrrega'),connexio:__('Connexió amb altres'),general:__('Cura general')},
    levels:[__('Sense dificultats'),__('Dificultats lleus'),__('Dificultats moderades'),__('Dificultats importants')],
    acts:{
      son:[
        {t:__('Apunta com dorms durant una setmana amb el diari de son.'),h:'eines-tcc.html#son'},
        {t:__('Intenta llevar-te cada dia a la mateixa hora, també els caps de setmana.')},
        {t:__('Una hora abans d\'anar al llit, deixa les pantalles i fes alguna cosa tranquil·la.')},
        {t:__('Prova la relaxació muscular progressiva abans d\'anar a dormir.'),h:'eines.html#relaxacio'},
        {t:__('Si fa mesos que dorms malament, llegeix la fitxa sobre l\'insomni.'),h:'trastorns/insomni.html'}
      ],
      anim:[
        {t:__('Planifica una activitat petita que et doni plaer o et faci sentir que has avançat.'),h:'eines-tcc.html#activacio'},
        {t:__('Apunta com et sents cada dia, en menys d\'un minut.'),h:'eines.html#anim'},
        {t:__('Surt a caminar deu minuts, millor amb llum natural.')},
        {t:__('Llegeix la fitxa sobre la depressió per saber quan convé demanar ajuda.'),h:'trastorns/depressio.html'}
      ],
      ansietat:[
        {t:__('Fes tres minuts de respiració guiada.'),h:'eines.html#respiracio'},
        {t:__('Si et sents desbordat/da, prova el grounding 5-4-3-2-1.'),h:'eines.html#grounding'},
        {t:__('Escriu el pensament que et preocupa al diari de pensaments i busca\'n una versió més equilibrada.'),h:'eines.html#pensaments'},
        {t:__('Reserva 15 minuts del dia per preocupar-te. Si et ve una preocupació fora d\'hora, apunta-la i deixa-la per a aquell moment.')},
        {t:__('Si tens atacs de pànic, apunta\'ls al registre de pànic.'),h:'eines-tcc.html#panic'}
      ],
      estres:[
        {t:__('Fes una llista del que tens pendent i tria només una cosa per fer avui.')},
        {t:__('Fes una pausa de cinc minuts sense pantalles durant la jornada.')},
        {t:__('Relaxa el cos amb la relaxació muscular progressiva.'),h:'eines.html#relaxacio'},
        {t:__('Si la feina t\'ofega, mira com parlar-ne al lloc de treball.'),h:'parlar-ne.html#feina'}
      ],
      connexio:[
        {t:__('Envia un missatge a una persona de confiança, encara que sigui només per saludar.')},
        {t:__('Mira com explicar a algú de confiança com et sents.'),h:'parlar-ne.html#familia'},
        {t:__('Proposa un pla senzill amb altra gent aquesta setmana (un cafè, una passejada).')},
        {t:__('Si et costa parlar-ne, mira com trobar ajuda professional.'),h:'ajuda.html'}
      ],
      general:[
        {t:__('Apunta com et sents al registre d\'ànim.'),h:'eines.html#anim'},
        {t:__('Fes una passejada curta i fixa\'t en què veus i sents.')},
        {t:__('Dedica uns minuts a alguna cosa que t\'agradi, només pel plaer de fer-la.')},
        {t:__('Posa\'t un recordatori suau a l\'agenda.'),h:'meves-dades.html#recordatoris'}
      ]
    }
  };
})();

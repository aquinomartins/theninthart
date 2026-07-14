const p = './imagensQuadrinhos/';
const asset = (id, file, type, chapter, order, width, height, alt, extra = {}) => ({
  id, src: `${p}${file}`, type, chapter, order, width, height,
  aspectRatio: +(width / height).toFixed(3), hasTransparency: file.endsWith('.png'), fit: 'contain',
  focalPoint: { x: 50, y: 50 }, alt, layoutRole: extra.layoutRole || 'panel', reactsTo: extra.reactsTo || [],
  mobileOrder: extra.mobileOrder || order, enabled: extra.enabled ?? true, contentPlacement: extra.contentPlacement || 'safe-zone',
  variants: extra.variants || {}, normalizedFrom: extra.normalizedFrom || null
});

export const comicsManifest = {
  version: '1.0.0',
  notes: 'Narrative order: kitchen/cake, machine, travel, public return. Layout-reference assets are catalogued but not rendered.',
  assets: [
    asset('hq-008','hq008.png','panel','cake-kitchen',1,563,375,'Abuela e as crianças encontram pistas do bolo na cozinha.',{layoutRole:'hero'}),
    asset('hq-009','hq009.png','panel','cake-kitchen',2,685,612,'Personagens investigam a cozinha e as migalhas como coordenadas.',{layoutRole:'left'}),
    asset('hq-010','hq010.png','panel','cake-kitchen',3,371,612,'Quadro vertical com reação de descoberta diante do mistério do bolo.',{layoutRole:'right'}),
    asset('imagem-hq-1','imagemHQ1.png','composite-page','cake-kitchen',4,1055,1491,'Página completa de HQ apresentando a cozinha, os personagens e a busca pelo bolo.',{layoutRole:'composite'}),
    asset('hq-001','hq001.png','panel','machine',10,1055,556,'Hagia e Pio começam a projetar a máquina temporal sobre a cozinha.',{layoutRole:'hero',reactsTo:['selected-part','temporal-state']}),
    asset('hq-002','hq002.png','panel','machine',11,518,390,'Detalhe de montagem da máquina com ferramentas e partes intercambiáveis.',{layoutRole:'rail',reactsTo:['selected-part']}),
    asset('hq-003','hq003.png','panel','machine',12,732,576,'O mecanismo ganha forma enquanto a cozinha vibra em outra frequência.',{layoutRole:'top',reactsTo:['selected-part']}),
    asset('hq-004','hq004.png','panel','machine',13,415,521,'Peça vertical da máquina aponta para o próximo salto temporal.',{layoutRole:'midA',reactsTo:['selected-part']}),
    asset('hq-005','hq005.png','panel','machine',14,582,444,'Teste da máquina do bolo com movimento e energia na sarjeta.',{layoutRole:'footer',reactsTo:['selected-part','temporal-state']}),
    asset('hq-006','hq006.png','panel','travel',20,1055,499,'A máquina dispara e abre uma faixa de viagem temporal.',{layoutRole:'hero',reactsTo:['temporal-state']}),
    asset('hq-007','hq007.png','panel','travel',21,490,394,'Pio atravessa uma cena de deslocamento entre épocas.',{layoutRole:'bubble',reactsTo:['temporal-state']}),
    asset('page-dino','ChatGPT Image 11 de jul. de 2026, 17_19_36.png','composite-page','travel',22,1122,1402,'Página multipainel com viagem, paisagem pré-histórica e dinossauros.',{layoutRole:'composite',reactsTo:['temporal-state'],normalizedFrom:'ChatGPT Image 11 de jul. de 2026, 17_19_36.png'}),
    asset('page-travel-1','ChatGPT Image 14 de jul. de 2026, 16_05_11 (1).png','composite-page','travel',23,1086,1448,'Página completa de transição temporal com múltiplos quadros.',{layoutRole:'composite'}),
    asset('page-travel-2','ChatGPT Image 14 de jul. de 2026, 16_05_14 (2).png','composite-page','travel',24,1086,1448,'Página vertical com sequência de viagem e descoberta.',{layoutRole:'composite'}),
    asset('page-travel-3','ChatGPT Image 14 de jul. de 2026, 16_05_14 (3).png','composite-page','travel',25,1024,1536,'Página editorial vertical com ação temporal.',{layoutRole:'composite'}),
    asset('page-public-1','dde05d0e-2cd7-44e0-a4d5-86981164fa75.png','composite-page','public-return',30,1122,1402,'Página completa para cozinha pública e mistura coletiva de épocas.',{layoutRole:'composite',reactsTo:['public-state']}),
    asset('page-public-2','Design sem nome(5).png','composite-page','public-return',31,1055,1491,'Composição editorial vertical para estado público da cozinha.',{layoutRole:'composite',reactsTo:['public-state'],normalizedFrom:'Design sem nome(5).png'}),
    asset('page-public-3','Design sem nome(6).png','composite-page','public-return',32,1055,1491,'Composição final de retorno da máquina e consequências do bolo.',{layoutRole:'composite',normalizedFrom:'Design sem nome(6).png'}),
    asset('scene-object-013','imagem013.png','scene','public-return',33,900,626,'Cena ampla para objetos e cozinha em transformação.',{layoutRole:'lowerA',reactsTo:['selected-object']}),
    asset('scene-object-018','imagem018.png','scene','public-return',34,597,624,'Cena de objeto ou personagem para variante temporal.',{layoutRole:'lowerB',reactsTo:['selected-object']}),
    asset('scene-020','imagem020.png','scene','public-return',35,405,829,'Painel vertical estreito para retorno temporal.',{layoutRole:'rail'}),
    asset('scene-021','imagem021.png','scene','public-return',36,395,829,'Painel vertical estreito para consequência temporal.',{layoutRole:'right'}),
    asset('page-14-4','ChatGPT Image 14 de jul. de 2026, 16_05_14 (4).png','composite-page','public-return',37,1024,1536,'Página completa adicional para retorno e cozinha pública.',{layoutRole:'composite'}),
    asset('page-14-5','ChatGPT Image 14 de jul. de 2026, 16_05_14 (5).png','composite-page','public-return',38,1024,1536,'Página completa adicional com fechamento narrativo.',{layoutRole:'composite'}),
    asset('page-15-6','ChatGPT Image 14 de jul. de 2026, 16_05_15 (6).png','composite-page','public-return',39,1086,1448,'Página multipainel catalogada para expansão.',{layoutRole:'composite'}),
    asset('page-15-7','ChatGPT Image 14 de jul. de 2026, 16_05_15 (7).png','composite-page','public-return',40,992,1586,'Página vertical catalogada para expansão.',{layoutRole:'composite'}),
    asset('page-15-8','ChatGPT Image 14 de jul. de 2026, 16_05_15 (8).png','composite-page','public-return',41,1024,1536,'Página vertical catalogada para expansão.',{layoutRole:'composite'}),
    asset('interface-reference','d9a98e4ed094eb7e1f8dc20bd1f0a22e4a-11-miller-krigstein-2.2x.w710.jpg','interactive-reference','references',90,1420,2174,'Referência externa de composição editorial multipainel.',{enabled:false}),
    asset('layout-reference-a','ChatGPT Image 14 de jul. de 2026, 16_05_14 (4).png','layout-reference','references',91,1024,1536,'Referência de grid vertical catalogada; não renderizar automaticamente.',{enabled:false})
  ]
};
export const comicAssetById = Object.fromEntries(comicsManifest.assets.map((a) => [a.id, a]));

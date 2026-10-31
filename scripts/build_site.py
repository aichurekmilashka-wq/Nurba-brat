"""One content model for the React application and an offline HTML prototype."""
from pathlib import Path
from html import escape
import json, re
from social_metadata import social_metadata
from journey_export import render_journey

ROOT=Path(__file__).resolve().parent.parent
LANGS=['ru','ky','en','sv','nb']
LABELS={'ru':'Русский','ky':'Кыргызча','en':'English','sv':'Svenska','nb':'Norsk bokmål'}
LANGUAGE_BUTTON={'ru':'Язык','ky':'Тил','en':'Language','sv':'Språk','nb':'Språk'}
LANGUAGE_SHORT={'ru':'Рус','ky':'Кыр','en':'Eng','sv':'Sve','nb':'Nor'}
T={}
def tr(key,ru,ky,en,sv,nb):
 for lang,value in zip(LANGS,[ru,ky,en,sv,nb]):T.setdefault(lang,{})[key]=value
tr('portraitAlt','Четыре красных мака','Төрт кызыл мак','Four red poppies','Fyra röda vallmoblommor','Fire røde valmuer')
tr('brandName','Nurba','Nurba','Nurba','Nurba','Nurba')
tr('brand','Регуляторный консалтинг','Регулятордук консалтинг','Regulatory consulting','Regulatorisk rådgivning','Regulatorisk rådgivning')
tr('region','Кыргызстан · Международные проекты','Кыргызстан · Эл аралык долбоорлор','Kyrgyzstan · International projects','Kirgizistan · Internationella projekt','Kirgisistan · Internasjonale prosjekter')
tr('preview','Прототип сайта · Контакты и сведения о компании ожидают подтверждения','Сайттын прототиби · Компаниянын маалыматы жана байланыштары такталат','Website prototype · Company details and contacts await confirmation','Webbplatsprototyp · Företagsuppgifter och kontaktuppgifter inväntar bekräftelse','Nettsideprototype · Firmaopplysninger og kontaktinformasjon må bekreftes')
tr('navMenu','Меню','Меню','Menu','Meny','Meny')
tr('home','Главная','Башкы бет','Home','Hem','Hjem')
tr('services','Услуги','Кызматтар','Services','Tjänster','Tjenester')
tr('pricing','Сроки и стоимость','Мөөнөттөр жана баалар','Timeline & costs','Tidsplan och kostnader','Tidsplan og kostnader')
tr('projects','Проекты','Долбоорлор','Projects','Projekt','Prosjekter')
tr('knowledge','База знаний','Билим базасы','Knowledge hub','Kunskapsbank','Kunnskapsbase')
tr('about','Компания','Компания','About','Om oss','Om oss')
tr('contacts','Контакты','Байланыш','Contact','Kontakt','Kontakt')
tr('request','Оценить проект','Долбоорду баалоо','Assess your project','Bedöm ditt projekt','Vurder prosjektet ditt')
tr('heroTitle','Регуляторный консалтинг','Регулятордук консалтинг','Regulatory consulting','Regulatorisk rådgivning','Regulatorisk rådgivning')
tr('heroText','Регистрация лекарств и медицинских изделий в Кыргызстане. Проверка документов, подготовка досье и сопровождение проекта.','Кыргызстанда дары-дармектерди жана медициналык буюмдарды каттоо. Документтерди текшерүү, досьени даярдоо жана долбоорду коштоо.','Medicine and medical device registration in Kyrgyzstan. Document review, dossier preparation and project coordination.','Registrering av läkemedel och medicintekniska produkter i Kirgizistan. Dokumentgranskning, sammanställning av dossier och projektsamordning.','Registrering av legemidler og medisinsk utstyr i Kirgisistan. Dokumentgjennomgang, utarbeidelse av dokumentasjon og prosjektoppfølging.')
tr('how','Порядок работы','Иштөө тартиби','How it works','Så arbetar vi','Slik jobber vi')
tr('choose','Виды услуг','Кызматтардын түрлөрү','Our services','Våra tjänster','Våre tjenester')
tr('chooseText','Выберите задачу — посмотрите состав работы, исходные данные и следующий шаг.','Милдетти тандаңыз — иштердин курамын, баштапкы маалыматтарды жана кийинки кадамды көрүңүз.','Choose your task to see the scope, initial information and next step.','Välj din uppgift för att se omfattning, inledande information och nästa steg.','Velg oppgave for å se omfang, innledende informasjon og neste steg.')
tr('audiences','Для кого этот сайт','Бул сайт кимдер үчүн','Who this is for','Vem webbplatsen riktar sig till','Hvem dette er for')
tr('manufacturers','Производителям','Өндүрүүчүлөргө','For manufacturers','För tillverkare','For produsenter')
tr('importers','Импортёрам и дистрибьюторам','Импорттоочуларга жана дистрибьюторлорго','For importers and distributors','För importörer och distributörer','For importører og distributører')
tr('partners','Регуляторным партнёрам','Регулятордук өнөктөштөргө','For regulatory partners','För regulatoriska partner','For regulatoriske partnere')
tr('manufacturersText','Оценка готовности продукта и документов для проекта в Кыргызстане.','Кыргызстандагы долбоор үчүн продуктунун жана документтердин даярдыгын баалоо.','Assess product and documentation readiness for a project in Kyrgyzstan.','Bedöm produktens och dokumentationens beredskap för ett projekt i Kirgizistan.','Vurder produktets og dokumentasjonens beredskap for et prosjekt i Kirgisistan.')
tr('importersText','Проверка исходных данных и распределение обязанностей с производителем.','Баштапкы маалыматтарды текшерүү жана өндүрүүчү менен милдеттерди бөлүштүрүү.','Review initial information and agree responsibilities with the manufacturer.','Granska inledande uppgifter och fördela ansvar tillsammans med tillverkaren.','Gjennomgå innledende opplysninger og avklar ansvar med produsenten.')
tr('partnersText','Местная координация, согласованный обмен документами и коммуникация.','Жергиликтүү координация, макулдашылган документ алмашуу жана байланыш.','Local coordination, agreed document exchange and communication.','Lokal samordning, överenskommet dokumentutbyte och kommunikation.','Lokal koordinering, avtalt dokumentutveksling og kommunikasjon.')
tr('medicines','Регистрация лекарств','Дары-дармектерди каттоо','Medicine registration','Läkemedelsregistrering','Legemiddelregistrering')
tr('devices','Регистрация медизделий','Медициналык буюмдарды каттоо','Medical device registration','Registrering av medicintekniska produkter','Registrering av medisinsk utstyr')
tr('review','Аудит готовности досье','Досьенин даярдыгын текшерүү','Dossier readiness review','Granskning av dossierberedskap','Gjennomgang av dokumentasjon')
tr('preparation','Подготовка досье','Досьени даярдоо','Dossier preparation','Sammanställning av dossier','Utarbeidelse av dokumentasjon')
tr('variations','Изменения и сопровождение','Өзгөртүүлөр жана коштоо','Variations and lifecycle support','Ändringar och livscykelstöd','Endringer og livssyklusstøtte')
tr('pv','Фармаконадзор','Фармакокөзөмөл','Pharmacovigilance','Farmakovigilans','Legemiddelovervåking')
tr('consulting','Регуляторные консультации','Регулятордук кеңештер','Regulatory consulting','Regulatorisk rådgivning','Regulatorisk rådgivning')
tr('medicinesText','Первичная оценка проекта по лекарственному препарату, документов и состава сопровождения.','Дары препараты боюнча долбоорду, документтерди жана коштоо иштерин алгачкы баалоо.','Initial assessment of a medicinal product project, its documentation and coordination scope.','Inledande bedömning av ett läkemedelsprojekt, dokumentationen och samordningens omfattning.','Innledende vurdering av et legemiddelprosjekt, dokumentasjonen og oppfølgingens omfang.')
tr('devicesText','Отдельная оценка медицинского изделия с учётом назначения и имеющейся документации.','Медициналык буюмдун максатын жана учурдагы документтерин эске алуу менен өзүнчө баалоо.','A separate assessment based on a device’s intended purpose and available documentation.','En separat bedömning utifrån produktens avsedda användning och tillgängliga dokumentation.','En separat vurdering basert på utstyrets tiltenkte bruk og tilgjengelig dokumentasjon.')
tr('reviewText','Карта имеющихся материалов, пробелов и вопросов, которые нужно решить до старта.','Учурдагы материалдардын, жетишпеген маалыматтардын жана баштоого чейинки суроолордун тизмеси.','A map of available materials, gaps and questions to resolve before starting.','En översikt över befintligt material, luckor och frågor att lösa före start.','En oversikt over tilgjengelig materiale, mangler og spørsmål som må avklares før oppstart.')
tr('preparationText','Согласование структуры, сбор и систематизация материалов с командой производителя.','Өндүрүүчүнүн командасы менен түзүмдү макулдашуу, материалдарды чогултуу жана иреттөө.','Agree a structure and collect and organise materials with the manufacturer’s team.','Fastställ struktur och samla in och organisera material tillsammans med tillverkarens team.','Avtal struktur og samle inn og organisere materiale med produsentens team.')
tr('variationsText','Оценка планируемого изменения и подготовка плана дальнейшего сопровождения.','Пландалган өзгөртүүнү баалоо жана андан аркы коштоо планын даярдоо.','Assess a planned change and prepare a plan for further support.','Bedöm en planerad ändring och ta fram en plan för fortsatt stöd.','Vurder en planlagt endring og utarbeid en plan for videre oppfølging.')
tr('pvText','Обсуждение задач мониторинга безопасности и обязанностей участников проекта.','Коопсуздукту көзөмөлдөө милдеттерин жана долбоордун катышуучуларынын жоопкерчилигин талкуулоо.','Discuss safety-monitoring tasks and the responsibilities of project participants.','Diskutera säkerhetsövervakning och projektdeltagarnas ansvar.','Diskuter sikkerhetsovervåking og prosjektdeltakernes ansvar.')
tr('consultingText','Разбор конкретного вопроса и перечень исходных сведений для обоснованного ответа.','Так суроону талдоо жана негиздүү жооп үчүн керектүү баштапкы маалыматтардын тизмеси.','Review a specific question and identify the information needed for an informed response.','Analysera en specifik fråga och identifiera uppgifterna som behövs för ett välgrundat svar.','Gjennomgå et konkret spørsmål og identifiser opplysningene som trengs for et begrunnet svar.')
tr('scope','Состав работы','Иштердин курамы','Scope of work','Arbetets omfattning','Arbeidsomfang')
tr('inputs','Что нужно для начала','Баштоо үчүн эмне керек','What is needed to start','Vad behövs för att börja','Hva trengs for å starte')
tr('inputsText','Название и тип продукта, производитель, страна производства, цель обращения и перечень имеющихся документов. На первом этапе достаточно описания без конфиденциального досье.','Продуктунун аталышы жана түрү, өндүрүүчү, өндүрүш өлкөсү, кайрылуунун максаты жана учурдагы документтердин тизмеси. Алгач купуя досьесиз кыскача маалымат жетиштүү.','Product name and type, manufacturer, country of manufacture, project goal and an inventory of available documents. An initial description is sufficient; do not send a confidential dossier at this stage.','Produktnamn och typ, tillverkare, tillverkningsland, projektmål och en förteckning över befintliga dokument. En inledande beskrivning räcker; skicka ingen konfidentiell dossier i detta skede.','Produktnavn og type, produsent, produksjonsland, prosjektmål og en oversikt over tilgjengelige dokumenter. En innledende beskrivelse er nok; ikke send konfidensiell dokumentasjon på dette stadiet.')
tr('outputs','Результат этапа','Этаптын жыйынтыгы','Stage deliverables','Leveranser per steg','Leveranser per trinn')
tr('outputsText','Письменный состав работ, список недостающих материалов и вопросов, ответственные стороны и согласованные следующие действия.','Иштердин жазуу жүзүндөгү курамы, жетишпеген материалдар жана суроолор, жооптуу тараптар жана кийинки макулдашылган аракеттер.','A written scope, a list of missing materials and questions, responsible parties and agreed next actions.','Skriftlig omfattning, en lista över saknat material och frågor, ansvariga parter och överenskomna nästa steg.','Skriftlig omfang, en liste over manglende materiale og spørsmål, ansvarlige parter og avtalte neste steg.')
tr('responsibility','Ответственность и границы','Жоопкерчилик жана чектер','Responsibilities and boundaries','Ansvar och avgränsningar','Ansvar og avgrensninger')
tr('responsibilityText','Заказчик обеспечивает достоверность исходных сведений и согласование материалов. Исполнитель работает в рамках договора. Решения уполномоченных органов не могут быть гарантированы компанией.','Кардар баштапкы маалыматтардын тууралыгын жана материалдарды макулдашууну камсыздайт. Аткаруучу келишимдин алкагында иштейт. Ыйгарым укуктуу органдардын чечимдерине компания кепилдик бере албайт.','The client provides accurate information and approves materials. The provider works within the agreed contract. Decisions by competent authorities cannot be guaranteed by a company.','Kunden ansvarar för riktiga uppgifter och godkänner material. Leverantören arbetar inom avtalets ramar. Företaget kan inte garantera behöriga myndigheters beslut.','Kunden sørger for korrekte opplysninger og godkjenner materiale. Leverandøren arbeider innenfor avtalen. Et selskap kan ikke garantere vedtak fra kompetente myndigheter.')
tr('costIntro','Расчёт зависит от продукта, готовности документов и согласованного объёма сопровождения. Ниже показана структура расходов; это не ценовое предложение.','Эсеп продуктуга, документтердин даярдыгына жана макулдашылган коштоо иштерине жараша болот. Төмөндө чыгымдардын түзүмү берилген; бул баа сунушу эмес.','The estimate depends on the product, documentation readiness and agreed scope. The cost structure below is not a quotation.','Bedömningen beror på produkten, dokumentationens beredskap och överenskommen omfattning. Kostnadsstrukturen nedan är inte en offert.','Estimatet avhenger av produktet, dokumentasjonens beredskap og avtalt omfang. Kostnadsstrukturen nedenfor er ikke et pristilbud.')
tr('fees','Работа команды','Команданын иши','Professional services','Konsulttjänster','Faglige tjenester')
tr('feesText','Оценка, подготовка материалов и сопровождение по согласованному составу работ.','Макулдашылган иштерге ылайык баалоо, материалдарды даярдоо жана коштоо.','Assessment, material preparation and coordination within the agreed scope.','Bedömning, framtagning av material och samordning inom avtalad omfattning.','Vurdering, utarbeidelse av materiale og koordinering innenfor avtalt omfang.')
tr('official','Официальные платежи','Расмий төлөмдөр','Official fees','Myndighetsavgifter','Offentlige gebyrer')
tr('officialText','Определяются применимой процедурой и учитываются отдельно от вознаграждения компании.','Тиешелүү жол-жобого жараша аныкталып, компаниянын акысынан өзүнчө эсептелет.','Determined by the applicable procedure and listed separately from professional fees.','Bestäms av det tillämpliga förfarandet och redovisas separat från konsultarvodet.','Bestemmes av gjeldende prosedyre og oppgis separat fra honoraret.')
tr('external','Дополнительные работы','Кошумча иштер','External costs','Externa kostnader','Eksterne kostnader')
tr('externalText','Переводы, испытания и другие внешние работы — при необходимости и после согласования.','Котормо, сыноо жана башка тышкы иштер — зарыл болгондо жана макулдашылгандан кийин.','Translations, testing and other external work, where needed and agreed in advance.','Översättning, provning och annat externt arbete vid behov och efter överenskommelse.','Oversettelse, testing og annet eksternt arbeid ved behov og etter avtale.')
tr('timeline','Что влияет на сроки','Мөөнөттөргө эмне таасир этет','What affects the timeline','Vad påverkar tidsplanen','Hva påvirker tidsplanen')
tr('timelineText','Полнота материалов, ответы производителя, сложность проекта и внешние процедуры. Срок работы команды и срок рассмотрения органами указываются раздельно после оценки.','Материалдардын толуктугу, өндүрүүчүнүн жооптору, долбоордун татаалдыгы жана тышкы жол-жоболор. Баалоодон кийин команданын иш мөөнөтү менен органдардын кароо мөөнөтү өзүнчө көрсөтүлөт.','Completeness of materials, manufacturer response times, project complexity and external procedures. Team working time and authority review time are distinguished after assessment.','Materialets fullständighet, tillverkarens svarstider, projektets komplexitet och externa förfaranden. Teamets arbetstid skiljs från myndigheternas handläggningstid efter bedömning.','Materialets fullstendighet, produsentens svartid, prosjektets kompleksitet og eksterne prosesser. Teamets arbeidstid og myndighetenes behandlingstid oppgis separat etter vurdering.')
tr('step1','Исходная оценка','Алгачкы баалоо','Initial assessment','Inledande bedömning','Innledende vurdering')
tr('step2','Состав работ и предложение','Иштердин курамы жана сунуш','Scope and proposal','Omfattning och offert','Omfang og tilbud')
tr('step3','Договор и ответственность','Келишим жана жоопкерчилик','Contract and responsibilities','Avtal och ansvar','Avtale og ansvar')
tr('step4','Подготовка материалов','Материалдарды даярдоо','Material preparation','Framtagning av material','Utarbeidelse av materiale')
tr('step5','Сопровождение проекта','Долбоорду коштоо','Project coordination','Projektsamordning','Prosjektoppfølging')
tr('step6','Передача результатов','Жыйынтыктарды өткөрүү','Delivery of results','Överlämning av resultat','Overlevering av resultater')
tr('international','Разработка упаковки и перевод','Таңгакты иштеп чыгуу жана котормо','Packaging development and translation','Förpackningsutveckling och översättning','Utvikling av emballasje og oversettelse')
tr('internationalText','Помогаем в разработке упаковки и переводе текстов на кыргызский, русский и английский языки.','Таңгакты иштеп чыгууга жана тексттерди кыргыз, орус жана англис тилдерине которууга жардам беребиз.','We help develop packaging and translate texts into Kyrgyz, Russian and English.','Vi hjälper till med förpackningsutveckling och översättning till kirgiziska, ryska och engelska.','Vi bistår med utvikling av emballasje og oversettelse til kirgisisk, russisk og engelsk.')
tr('faq','Вопросы и ответы','Суроолор жана жооптор','Questions & answers','Frågor och svar','Spørsmål og svar')
tr('faqQ1','Можно ли заранее назвать точную цену?','Так бааны алдын ала айтууга болобу?','Can an exact price be given in advance?','Kan ett exakt pris anges i förväg?','Kan en nøyaktig pris oppgis på forhånd?')
tr('faqA1','Итоговый расчёт возможен после оценки продукта, документов и состава работ. Официальные и дополнительные расходы должны быть выделены отдельно.','Акыркы эсеп продуктуну, документтерди жана иштердин курамын баалагандан кийин мүмкүн. Расмий жана кошумча чыгымдар өзүнчө көрсөтүлүшү керек.','A final estimate requires an assessment of the product, documentation and scope. Official fees and additional costs should be listed separately.','En slutlig bedömning kräver granskning av produkten, dokumentationen och omfattningen. Myndighetsavgifter och tilläggskostnader ska anges separat.','Et endelig estimat krever vurdering av produktet, dokumentasjonen og omfanget. Offentlige gebyrer og tilleggskostnader skal oppgis separat.')
tr('faqQ2','Нужно ли сразу отправлять полное досье?','Толук досьени дароо жөнөтүү керекпи?','Should I send a complete dossier immediately?','Ska jag skicka en fullständig dossier direkt?','Bør jeg sende fullstendig dokumentasjon med en gang?')
tr('faqA2','Нет. Начните с описания продукта и перечня доступных материалов. Конфиденциальный обмен согласуется отдельно.','Жок. Продуктунун сүрөттөлүшүнөн жана учурдагы материалдардын тизмесинен баштаңыз. Купуя алмашуу өзүнчө макулдашылат.','No. Start with a product description and an inventory of available materials. Confidential exchange is agreed separately.','Nej. Börja med en produktbeskrivning och en förteckning över tillgängligt material. Konfidentiellt utbyte avtalas separat.','Nei. Begynn med en produktbeskrivelse og en oversikt over tilgjengelig materiale. Konfidensiell utveksling avtales separat.')
tr('faqQ3','Есть ли гарантия регистрации?','Каттоого кепилдик барбы?','Is registration guaranteed?','Garanteras registrering?','Er registrering garantert?')
tr('faqA3','Решение принимает уполномоченный орган. Состав работы, сроки команды и ответственность фиксируются в договоре; положительное решение не обещается.','Чечимди ыйгарым укуктуу орган кабыл алат. Иштер, команданын мөөнөттөрү жана жоопкерчилик келишимде көрсөтүлөт; оң чечим убада кылынбайт.','The competent authority makes the decision. Scope, team timelines and responsibilities are contractual; a positive decision is not promised.','Den behöriga myndigheten fattar beslutet. Omfattning, teamets tidsplan och ansvar regleras i avtal; ett positivt beslut utlovas inte.','Kompetent myndighet fatter vedtaket. Omfang, teamets tidsplan og ansvar avtalefestes; et positivt vedtak loves ikke.')
tr('startGuide','Как подготовиться к первой оценке','Алгачкы баалоого кантип даярдануу керек','Preparing for an initial assessment','Förberedelser inför en första bedömning','Forberedelser til en første vurdering')
tr('checklist','Чек-лист исходных данных','Баштапкы маалыматтардын тизмеси','Initial information checklist','Checklista för inledande uppgifter','Sjekkliste for innledende opplysninger')
tr('guides','Практические руководства','Практикалык колдонмолор','Practical guides','Praktiska vägledningar','Praktiske veiledninger')
tr('documents','Документы и чек-листы','Документтер жана тизмелер','Documents & checklists','Dokument och checklistor','Dokumenter og sjekklister')
tr('updates','Изменения требований','Талаптардын өзгөрүшү','Regulatory updates','Regulatoriska uppdateringar','Regulatoriske oppdateringer')
tr('glossary','Глоссарий','Терминдер','Glossary','Ordlista','Ordliste')
tr('search','Поиск по базе знаний','Билим базасынан издөө','Search the knowledge hub','Sök i kunskapsbanken','Søk i kunnskapsbasen')
tr('noResults','Ничего не найдено. Попробуйте другое слово.','Эч нерсе табылган жок. Башка сөздү колдонуп көрүңүз.','No results. Try another search term.','Inga träffar. Prova ett annat sökord.','Ingen treff. Prøv et annet søkeord.')
tr('guideText','Сначала определите продукт, производителя и цель проекта. Составьте перечень имеющихся материалов и отдельно отметьте недостающие сведения. Укажите предыдущие регистрации, если они есть. Передачу полного досье согласуйте после определения ответственных и порядка конфиденциального обмена. Это организационная памятка, а не нормативный перечень документов.','Адегенде продуктуну, өндүрүүчүнү жана долбоордун максатын аныктаңыз. Учурдагы материалдардын тизмесин түзүп, жетишпеген маалыматтарды өзүнчө белгилеңиз. Мурунку каттоолор болсо, көрсөтүңүз. Толук досьени өткөрүүнү жооптуу тараптарды жана купуя алмашуу тартибин аныктагандан кийин макулдашыңыз. Бул уюштуруучулук эскертме, ченемдик документтердин тизмеси эмес.','First identify the product, manufacturer and project goal. Make an inventory of available materials and record any missing information. Note previous registrations, if any. Agree the transfer of a full dossier after responsibilities and confidential exchange are defined. This is an organisational guide, not a statutory document checklist.','Identifiera först produkt, tillverkare och projektmål. Gör en förteckning över tillgängligt material och notera saknade uppgifter. Ange tidigare registreringar, om sådana finns. Avtala om överföring av en fullständig dossier när ansvar och konfidentiellt utbyte har fastställts. Detta är en organisatorisk vägledning, inte en lagstadgad dokumentlista.','Identifiser først produkt, produsent og prosjektmål. Lag en oversikt over tilgjengelig materiale og noter manglende opplysninger. Oppgi tidligere registreringer, hvis relevant. Avtal overføring av fullstendig dokumentasjon etter at ansvar og konfidensiell utveksling er avklart. Dette er en organisatorisk veiledning, ikke en lovpålagt dokumentliste.')
tr('checklistText','Продукт и назначение; производитель и страна; текущий статус документов; цель обращения; ответственное контактное лицо; вопросы и ограничения проекта. Не включайте персональные данные пациентов.','Продукт жана максаты; өндүрүүчү жана өлкө; документтердин учурдагы абалы; кайрылуунун максаты; жооптуу байланыш адамы; суроолор жана долбоордун чектөөлөрү. Бейтаптардын жеке маалыматтарын кошпоңуз.','Product and intended purpose; manufacturer and country; documentation status; project goal; responsible contact; questions and constraints. Do not include patients’ personal data.','Produkt och avsedd användning; tillverkare och land; dokumentationsstatus; projektmål; ansvarig kontaktperson; frågor och begränsningar. Ta inte med patienters personuppgifter.','Produkt og tiltenkt bruk; produsent og land; dokumentasjonsstatus; prosjektmål; ansvarlig kontaktperson; spørsmål og begrensninger. Ikke ta med pasienters personopplysninger.')
tr('projectsEmpty','Реальные проекты будут опубликованы после проверки фактов и разрешения заказчиков. В прототипе нет вымышленных кейсов, отзывов и результатов.','Чыныгы долбоорлор фактылар текшерилип, кардарлар уруксат бергенден кийин жарыяланат. Прототипте ойдон чыгарылган мисалдар, пикирлер жана жыйынтыктар жок.','Real projects will be published after fact-checking and client permission. This prototype contains no fabricated cases, testimonials or outcomes.','Verkliga projekt publiceras efter faktagranskning och kundernas tillstånd. Prototypen innehåller inga påhittade fall, omdömen eller resultat.','Reelle prosjekter publiseres etter faktasjekk og kundens tillatelse. Prototypen inneholder ingen oppdiktede eksempler, omtaler eller resultater.')
tr('caseFormat','Задача → выполненные работы → результат → ограничения','Милдет → аткарылган иштер → жыйынтык → чектөөлөр','Challenge → work delivered → result → limitations','Uppgift → utfört arbete → resultat → avgränsningar','Oppgave → utført arbeid → resultat → avgrensninger')
tr('team','Команда и эксперты','Команда жана эксперттер','Team & experts','Team och experter','Team og eksperter')
tr('teamEmpty','Профили специалистов будут добавлены после подтверждения имён, опыта, квалификаций и языков сопровождения.','Адистердин профилдери аты-жөнү, тажрыйбасы, квалификациясы жана коштоо тилдери такталгандан кийин кошулат.','Specialist profiles will be added after names, experience, qualifications and service languages are confirmed.','Specialistprofiler läggs till när namn, erfarenhet, kvalifikationer och servicespråk har bekräftats.','Spesialistprofiler legges til etter at navn, erfaring, kvalifikasjoner og tjenestespråk er bekreftet.')
tr('aboutText','Структура сайта предназначена для компании, сопровождающей регуляторные проекты в Кыргызстане. Название юридического лица, реквизиты и подтверждённый перечень услуг должны быть добавлены перед публикацией.','Сайттын түзүмү Кыргызстандагы регулятордук долбоорлорду коштогон компания үчүн даярдалган. Юридикалык аталышы, реквизиттери жана тастыкталган кызматтары жарыялоого чейин кошулушу керек.','This site structure is intended for a company supporting regulatory projects in Kyrgyzstan. Its legal name, company details and confirmed service list must be added before publication.','Webbplatsstrukturen är avsedd för ett företag som stöder regulatoriska projekt i Kirgizistan. Juridiskt namn, företagsuppgifter och bekräftade tjänster måste läggas till före publicering.','Nettsidestrukturen er ment for et selskap som bistår med regulatoriske prosjekter i Kirgisistan. Juridisk navn, firmaopplysninger og bekreftede tjenester må legges til før publisering.')
tr('editorial','Проверка материалов','Материалдарды текшерүү','Editorial policy','Redaktionell policy','Redaksjonelle retningslinjer')
tr('editorialText','Регуляторные материалы должны иметь источник, автора, проверяющего и дату проверки. Изменения требований требуют пересмотра связанных страниц и переводов. Переводы прототипа являются черновыми и требуют профессиональной языковой проверки.','Регулятордук материалдарда булак, автор, текшерүүчү жана текшерүү датасы болушу керек. Талаптар өзгөргөндө тиешелүү беттер жана котормолор кайра каралат. Прототиптин котормолору долбоордук болуп, кесипкөй тилдик текшерүүнү талап кылат.','Regulatory materials require sources, an author, a reviewer and a review date. Requirement changes trigger a review of related pages and translations. Prototype translations are drafts and require professional language review.','Regulatoriskt material ska ha källor, författare, granskare och granskningsdatum. Ändrade krav kräver översyn av relaterade sidor och översättningar. Prototypens översättningar är utkast och kräver professionell språkgranskning.','Regulatorisk innhold skal ha kilder, forfatter, faglig kontrollør og kontrolldato. Endrede krav krever gjennomgang av relaterte sider og oversettelser. Prototypens oversettelser er utkast og krever profesjonell språkvask.')
tr('updatesEmpty','Нормативные новости публикуются после проверки первоисточника, даты вступления в силу и применимости к конкретному продукту. Непроверенных новостей в прототипе нет.','Ченемдик жаңылыктар баштапкы булагы, күчүнө кирүү датасы жана тиешелүү продуктуга колдонулушу текшерилгенден кийин жарыяланат. Прототипте текшерилбеген жаңылыктар жок.','Regulatory updates are published after checking the primary source, effective date and applicability. No unverified updates are included in this prototype.','Regulatoriska uppdateringar publiceras efter kontroll av primärkälla, ikraftträdande och tillämplighet. Prototypen innehåller inga obekräftade nyheter.','Regulatoriske oppdateringer publiseres etter kontroll av primærkilde, ikrafttredelse og relevans. Prototypen inneholder ingen ubekreftede nyheter.')
tr('glossaryText','Досье — комплект материалов по продукту. Регуляторное сопровождение — согласованный комплекс работ по проекту. Фармаконадзор — деятельность, связанная с мониторингом безопасности лекарств. Термины здесь даны в ознакомительной форме.','Досье — продукт боюнча материалдардын топтому. Регулятордук коштоо — долбоор боюнча макулдашылган иштердин жыйындысы. Фармакокөзөмөл — дарылардын коопсуздугун көзөмөлдөөгө байланышкан иш. Терминдер тааныштыруу максатында берилген.','Dossier: a collection of product materials. Regulatory support: an agreed set of project activities. Pharmacovigilance: activities related to monitoring medicine safety. These are introductory explanations.','Dossier: en samling produktmaterial. Regulatoriskt stöd: överenskomna projektaktiviteter. Farmakovigilans: verksamhet kopplad till övervakning av läkemedelssäkerhet. Detta är inledande förklaringar.','Dokumentasjon: en samling produktmateriale. Regulatorisk støtte: avtalte prosjektaktiviteter. Legemiddelovervåking: aktiviteter knyttet til overvåking av legemiddelsikkerhet. Dette er innledende forklaringer.')
tr('contactEmpty','Телефон, доменная почта, адрес, реквизиты, часы работы и фактические языки команды будут размещены после подтверждения. Пока можно подготовить запрос локально.','Телефон, домендик почта, дарек, реквизиттер, иш убактысы жана команданын тилдери такталгандан кийин жарыяланат. Азырынча суроо-талапты жергиликтүү түрдө даярдоого болот.','Phone, company email, address, legal details, opening hours and actual team languages will be added after confirmation. For now, you can prepare a request locally.','Telefon, företagsmejl, adress, företagsuppgifter, öppettider och teamets faktiska språk läggs till efter bekräftelse. Tills vidare kan du förbereda en förfrågan lokalt.','Telefon, firma-e-post, adresse, firmaopplysninger, åpningstider og teamets faktiske språk legges til etter bekreftelse. Inntil videre kan du forberede en forespørsel lokalt.')
tr('formTitle','Расскажите о задаче','Милдетиңиз тууралуу айтыңыз','Tell us about your project','Berätta om ditt projekt','Fortell om prosjektet ditt')
tr('formNote','Прототип: данные не отправляются. Можно проверить заполнение и скачать текст запроса. Конфиденциальное досье сюда не загружайте.','Прототип: маалымат жөнөтүлбөйт. Толтурууну текшерип, суроо-талаптын текстин жүктөп алууга болот. Купуя досьени бул жерге жүктөбөңүз.','Prototype: no data is sent. Validate the form and download your request as text. Do not upload confidential documentation here.','Prototyp: inga uppgifter skickas. Kontrollera formuläret och ladda ned din förfrågan som text. Ladda inte upp konfidentiell dokumentation här.','Prototype: ingen opplysninger sendes. Kontroller skjemaet og last ned forespørselen som tekst. Ikke last opp konfidensiell dokumentasjon her.')
tr('task','Задача','Милдет','Task','Uppgift','Oppgave')
tr('country','Страна компании','Компаниянын өлкөсү','Company country','Företagets land','Selskapets land')
tr('contact','Email или телефон','Email же телефон','Email or phone','E-post eller telefon','E-post eller telefon')
tr('name','Имя и компания — необязательно','Атыңыз жана компания — милдеттүү эмес','Name and company — optional','Namn och företag — valfritt','Navn og selskap — valgfritt')
tr('comment','Описание продукта и задачи — необязательно','Продукт жана милдет тууралуу маалымат — милдеттүү эмес','Product and task description — optional','Beskrivning av produkt och uppgift — valfritt','Beskrivelse av produkt og oppgave — valgfritt')
tr('submit','Скачать запрос','Суроо-талапты жүктөп алуу','Download request','Ladda ned förfrågan','Last ned forespørsel')
tr('formSuccess','Запрос подготовлен и скачан. Данные не отправлены компании.','Суроо-талап даярдалып, жүктөлдү. Маалымат компанияга жөнөтүлгөн жок.','Request prepared and downloaded. No data has been sent to a company.','Förfrågan är förberedd och nedladdad. Inga uppgifter har skickats till ett företag.','Forespørselen er klargjort og lastet ned. Ingen opplysninger er sendt til et selskap.')
tr('formError','Укажите действительный email или телефон.','Туура email же телефон көрсөтүңүз.','Enter a valid email address or phone number.','Ange en giltig e-postadress eller ett telefonnummer.','Oppgi en gyldig e-postadresse eller et telefonnummer.')
tr('privacy','Персональные данные','Жеке маалыматтар','Privacy','Integritet','Personvern')
tr('cookies','Cookies','Cookies','Cookies','Kakor','Informasjonskapsler')
tr('terms','Условия использования','Колдонуу шарттары','Terms of use','Användarvillkor','Bruksvilkår')
tr('privacyText','В локальном прототипе нет сервера заявок, аналитики и отправки данных. Поля формы используются только в текущем окне для скачивания текста. Политика действующего сайта должна описывать реального оператора, цели, получателей, хранение и права пользователей.','Жергиликтүү прототипте суроо-талап сервери, аналитика жана маалымат жөнөтүү жок. Форманын талаалары ушул терезеде текстти жүктөп алуу үчүн гана колдонулат. Иштеп жаткан сайттын саясаты чыныгы операторду, максаттарды, алуучуларды, сактоону жана колдонуучулардын укуктарын сүрөттөшү керек.','This local prototype has no request server, analytics or data transmission. Form fields are used only in the current window to download text. A live privacy policy must describe the actual controller, purposes, recipients, storage and user rights.','Den lokala prototypen har ingen server för förfrågningar, analys eller dataöverföring. Formulärfält används endast i det aktuella fönstret för att ladda ned text. En integritetspolicy för en publicerad webbplats måste beskriva faktisk ansvarig, ändamål, mottagare, lagring och användarrättigheter.','Den lokale prototypen har ingen server for forespørsler, analyse eller dataoverføring. Skjemafelter brukes bare i det gjeldende vinduet for å laste ned tekst. En personvernerklæring for en publisert nettside må beskrive faktisk behandlingsansvarlig, formål, mottakere, lagring og brukerrettigheter.')
tr('cookiesText','Этот прототип не устанавливает cookies и не подключает рекламные или аналитические сервисы. Политику необходимо пересмотреть при подключении внешних систем.','Бул прототип cookies орнотпойт жана жарнама же аналитика кызматтарын кошпойт. Тышкы системалар кошулганда саясат кайра каралышы керек.','This prototype does not set cookies or connect advertising or analytics services. Review the policy before connecting external systems.','Prototypen sätter inga kakor och ansluter inga reklam- eller analystjänster. Policyn ska ses över innan externa system ansluts.','Prototypen setter ingen informasjonskapsler og kobler ikke til reklame- eller analysetjenester. Retningslinjene må gjennomgås før eksterne systemer kobles til.')
tr('termsText','Содержание является проектом сайта и не заменяет индивидуальную регуляторную оценку. Нормативные перечни, сроки и применимость процедур требуют проверки специалистом перед публикацией.','Мазмун сайттын долбоору болуп саналат жана жеке регулятордук баалоону алмаштырбайт. Ченемдик тизмелер, мөөнөттөр жана жол-жоболордун колдонулушу жарыялоого чейин адис тарабынан текшерилиши керек.','This content is a website draft and does not replace an individual regulatory assessment. Statutory checklists, timelines and procedural applicability require specialist review before publication.','Innehållet är ett webbplatsutkast och ersätter inte en individuell regulatorisk bedömning. Lagstadgade listor, tidsramar och förfarandens tillämplighet kräver specialistgranskning före publicering.','Innholdet er et nettsideutkast og erstatter ikke en individuell regulatorisk vurdering. Lovpålagte lister, tidsfrister og relevansen av prosedyrer krever faglig gjennomgang før publisering.')
tr('more','Подробнее','Кененирээк','Learn more','Läs mer','Les mer')
tr('allServices','Все услуги','Бардык кызматтар','All services','Alla tjänster','Alle tjenester')
tr('notFound','Страница не найдена','Бет табылган жок','Page not found','Sidan hittades inte','Siden ble ikke funnet')
tr('footerText','Сопровождение регуляторных проектов в Кыргызстане. Проект структуры и содержания.','Кыргызстандагы регулятордук долбоорлорду коштоо. Түзүмдүн жана мазмундун долбоору.','Regulatory project support in Kyrgyzstan. A structure and content prototype.','Stöd för regulatoriska projekt i Kirgizistan. En struktur- och innehållsprototyp.','Bistand med regulatoriske prosjekter i Kirgisistan. En struktur- og innholdsprototype.')

tr('folderOpen','Открыть','Ачуу','Open','Öppna','Åpne')
tr('folderClose','Закрыть','Жабуу','Close','Stäng','Lukk')
tr('folderContents','Материалы папки','Папканын материалдары','Folder contents','Mappinnehåll','Mappeinnhold')
tr('folderItems','материала','материал','resources','dokument','dokumenter')
tr('folderHint','Нажмите на папку, чтобы открыть материалы. Ссылка под ней ведёт к описанию услуги.','Материалдарды ачуу үчүн папканы басыңыз. Төмөнкү шилтеме кызматтын сүрөттөлүшүнө алып барат.','Click a folder to reveal its resources. The link below opens the service details.','Klicka på en mapp för att visa materialet. Länken nedanför öppnar tjänstens beskrivning.','Klikk på en mappe for å vise innholdet. Lenken under åpner tjenestebeskrivelsen.')

SERVICES=[('medicines-registration','medicines'),('medical-devices-registration','devices'),('dossier-review','review'),('dossier-preparation','preparation'),('variations','variations'),('pharmacovigilance','pv'),('regulatory-consulting','consulting')]
def build_pages(t):
 def block(title,text):return {'type':'text','title':t[title],'text':t[text]}
 def card(title,text,path):return {'title':t[title],'text':t[text],'path':path}
 def cards(title,items,text=''):return {'type':'cards','title':t[title],'text':t.get(text,''),'items':items}
 service_cards=[card(k,k+'Text','services/'+slug) for slug,k in SERVICES]
 audience_cards=[card(k,k+'Text','for-'+slug) for slug,k in [('manufacturers','manufacturers'),('importers','importers'),('partners','partners')]]
 costs=cards('pricing',[card('fees','feesText','pricing'),card('official','officialText','pricing'),card('external','externalText','pricing')],'costIntro')
 steps={'type':'steps','title':t['how'],'items':[t['step'+str(i)] for i in range(1,7)]}
 faq={'type':'faq','title':t['faq'],'items':[{'question':t['faqQ'+str(i)],'answer':t['faqA'+str(i)]} for i in range(1,4)]}
 form={'type':'form','title':t['formTitle']}
 knowledge_cards=[card('startGuide','guideText','knowledge/initial-assessment'),card('checklist','checklistText','knowledge/checklist')]
 pages={}
 def page(path,title,lead,blocks):pages[path]={'title':t[title],'lead':t.get(lead,''),'blocks':blocks}
 page('','heroTitle','heroText',[cards('choose',service_cards),{**steps,'type':'journey'},costs,cards('projects',[card('projects','projectsEmpty','projects'),card('team','teamEmpty','about/team')]),block('international','internationalText'),cards('knowledge',knowledge_cards),faq,form])
 page('services','services','chooseText',[cards('allServices',service_cards)])
 for slug,k in SERVICES:
  page('services/'+slug,k,k+'Text',[block('scope',k+'Text'),block('inputs','inputsText'),block('outputs','outputsText'),steps,block('responsibility','responsibilityText'),block('timeline','timelineText'),costs,cards('team',[card('team','teamEmpty','about/team')]),faq,form])
 for slug,k in [('manufacturers','manufacturers'),('importers','importers'),('partners','partners')]:
  relevant=service_cards[:4] if k=='manufacturers' else [service_cards[i] for i in ([0,1,2] if k=='importers' else [2,3,4,6])]
  page('for-'+slug,k,k+'Text',[block('inputs','inputsText'),cards('services',relevant),block('responsibility','responsibilityText'),block('international','internationalText'),form])
 page('how-we-work','how','heroText',[steps,block('outputs','outputsText'),block('responsibility','responsibilityText'),block('international','internationalText'),form])
 page('pricing','pricing','costIntro',[costs,block('timeline','timelineText'),faq,form])
 page('projects','projects','projectsEmpty',[{'type':'text','title':t['caseFormat'],'text':t['projectsEmpty']},form])
 page('knowledge','knowledge','',[{'type':'search','title':t['search'],'items':knowledge_cards+ [card('glossary','glossaryText','knowledge/glossary')]},cards('knowledge',[card('guides','guideText','knowledge/guides'),card('documents','checklistText','knowledge/documents'),card('updates','updatesEmpty','knowledge/updates'),card('glossary','glossaryText','knowledge/glossary')])])
 page('knowledge/guides','guides','',[cards('guides',[knowledge_cards[0]])])
 page('knowledge/documents','documents','',[cards('documents',[knowledge_cards[1]])])
 page('knowledge/updates','updates','updatesEmpty',[block('editorial','editorialText')])
 page('knowledge/glossary','glossary','glossaryText',[])
 page('knowledge/initial-assessment','startGuide','guideText',[block('inputs','inputsText'),block('documents','checklistText'),block('responsibility','responsibilityText'),cards('services',[service_cards[2]]),block('editorial','editorialText'),form])
 page('knowledge/checklist','checklist','checklistText',[block('inputs','inputsText'),block('international','internationalText'),cards('services',[service_cards[2],service_cards[3]]),form])
 page('faq','faq','',[faq,form])
 page('about','about','aboutText',[cards('about',[card('team','teamEmpty','about/team'),card('editorial','editorialText','about/editorial-policy')]),block('international','internationalText')])
 page('about/team','team','teamEmpty',[block('international','internationalText'),form])
 page('about/editorial-policy','editorial','editorialText',[])
 page('contacts','contacts','contactEmpty',[block('international','internationalText'),form])
 page('request','request','',[form])
 for k in ['privacy','cookies','terms']:page(k,k,k+'Text',[])
 page('404','notFound','',[cards('services',service_cards[:2])])
 return pages

DATA={'languages':LABELS,'locales':{lang:{'ui':T[lang],'pages':build_pages(T[lang])} for lang in LANGS}}
(ROOT/'content/site.json').write_text(json.dumps(DATA,ensure_ascii=False,indent=2))
print('Content model:',len(DATA['locales']['ru']['pages']),'pages ×',len(LANGS),'languages')

# Static export: all pages open directly from Finder, without Node or a server.
import os
from html.parser import HTMLParser
from folder_export import render_service_folders, runtime as folder_runtime
CSS=(ROOT/'styles/site.css').read_text()+'\n'+(ROOT/'styles/glass-folder.css').read_text()+'\n'+(ROOT/'styles/brand.css').read_text()+'\n'+(ROOT/'styles/hero-editorial.css').read_text()+'\n'+(ROOT/'styles/liquid-glass-button.css').read_text()+'\n'+(ROOT/'styles/glyph-portal.css').read_text()+'\n'+(ROOT/'styles/button-7.css').read_text()+'\n'+(ROOT/'styles/theme.css').read_text()+'\n'+(ROOT/'styles/action-buttons.css').read_text()+'\n'+(ROOT/'styles/shifting-dropdown.css').read_text()+'\n'+(ROOT/'styles/mobile.css').read_text()+'\n'+(ROOT/'styles/project-journey.css').read_text()
EXPORT=ROOT/'prototype'
NAV=[('services','services'),('pricing','pricing'),('projects','projects'),('knowledge','knowledge'),('about','about'),('contacts','contacts')]
FOOTER=[['services','pricing','how-we-work','projects','faq'],['for-manufacturers','for-importers','for-partners','knowledge','knowledge/documents'],['about','about/team','about/editorial-policy','contacts','request']]
def target(lang,path):return EXPORT/lang/path/'index.html'
def render(lang,path,destination):
 t=T[lang]; pages=DATA['locales'][lang]['pages']; p=pages[path]
 def url(other_path='',other_lang=None):return os.path.relpath(target(other_lang or lang,other_path),destination.parent).replace(os.sep,'/')
 snake_rail=''
 portrait_url=os.path.relpath(ROOT/'public/assets/four-poppies-continuous-stems.png',destination.parent).replace(os.sep,'/')
 clean_poppy_url=os.path.relpath(ROOT/'public/assets/poppy-isolated-clean.png',destination.parent).replace(os.sep,'/')
 logo_url=os.path.relpath(ROOT/'public/assets/nurba-black-sans.svg',destination.parent).replace(os.sep,'/')
 def a(path,label,cls=''):return f'<a class="{cls}" href="{escape(url(path),quote=True)}">{escape(label)}</a>'
 folder_serial=0
 def render_cards(items):
  nonlocal folder_serial
  if items and all(item['path'].startswith('services/') for item in items):
   folder_serial+=1
   return render_service_folders(items,t,url,f'gf-batch-{folder_serial}',lang)
  out='<div class="cards">'
  for i,item in enumerate(items,1):
   out+=f'<a class="card" href="{escape(url(item["path"]),quote=True)}"><span class="card-no">{i:02}</span><h3>{escape(item["title"])}</h3><p>{escape(item["text"])}</p><div class="card-link">{escape(t["more"])}<span aria-hidden="true">↗</span></div></a>'
  return out+'</div>'
 def form(title):
  options=''.join(f'<option>{escape(t[k])}</option>' for _,k in SERVICES)
  fields=f'<label class="field">{escape(t["task"])}<select name="task" required>{options}</select></label>'
  for key,extra,full in [('country','required autocomplete="country-name" maxlength="100"',False),('contact','required maxlength="200"',True),('name','autocomplete="organization" maxlength="200"',True)]:
   fields+=f'<label class="field{" full" if full else ""}">{escape(t[key])}<input name="{key}" {extra}></label>'
  fields+=f'<label class="field full">{escape(t["comment"])}<textarea name="comment" maxlength="3000"></textarea></label>'
  fields+=f'<div class="form-bottom"><button class="button button-primary" type="submit" disabled>{escape(t["submit"])} <span aria-hidden="true">↗</span></button><p role="status" class="form-status"></p></div>'
  return f'<div class="request-layout"><div><h2 class="section-title">{escape(title)}</h2><p class="request-note">{escape(t["formNote"])}</p></div><form class="request-form">{fields}</form></div>'
 blocks=[]
 for i,b in enumerate(p['blocks'],1):
  content=''
  if b['type']=='form':content=form(b['title'])
  else:
   content=f'<div class="section-head"><h2 class="section-title">{escape(b["title"])}</h2><span class="section-number" aria-hidden="true">{i:02}</span></div>'
   if b['type']=='text':content+=f'<p class="body-copy">{escape(b["text"])}</p>'
   elif b['type']=='cards':
    if b.get('text'):content+=f'<p class="section-lead">{escape(b["text"])}</p>'
    content+=render_cards(b['items'])
   elif b['type']=='journey':
    content+=render_journey(b['items'],lang,b['title'],lambda stage:os.path.relpath(ROOT/f'public/assets/journey-stage-{stage}.svg',destination.parent).replace(os.sep,'/'))
   elif b['type']=='steps':content+='<ol class="steps">'+''.join(f'<li>{escape(item)}</li>' for item in b['items'])+'</ol>'
   elif b['type']=='faq':content+='<div class="faq-list">'+''.join(f'<details><summary>{escape(item["question"])}</summary><p>{escape(item["answer"])}</p></details>' for item in b['items'])+'</div>'
   elif b['type']=='search':content+=f'<div class="knowledge-search"><label><span class="eyebrow">{escape(t["search"])}</span><input class="search-field" type="search" placeholder="{escape(t["search"],quote=True)}"></label>'+render_cards(b['items'])+f'<p class="search-empty" role="status" hidden>{escape(t["noResults"])}</p></div>'
  blocks.append(f'<section class="content-section"><div class="shell">{content}</div></section>')
 langs=''.join(f'<a href="{escape(url(path,other),quote=True)}" lang="{other}" hreflang="{other}"'+(' aria-current="true"' if other==lang else '')+f'><span>{escape(LABELS[other])}</span>'+('<span aria-hidden="true">✓</span>' if other==lang else '')+'</a>' for other in LANGS)
 nav_links=f'<a href="{escape(url(),quote=True)}">{escape(t["home"])}</a>'
 for group in json.loads((ROOT/'content/navigation.json').read_text()):
  if len(group['pages'])==1:
   nav_links+=f'<a href="{escape(url(group["pages"][0]),quote=True)}">{escape(t[group["label"]])}</a>'
  else:
   links=''.join(f'<a href="{escape(url(route),quote=True)}"'+(' aria-current="page"' if route==path else '')+f'>{escape(t["allServices"] if route=="services" else pages[route]["title"])}</a>' for route in group['pages'])
   nav_links+=f'<details class="nav-subgroup"><summary class="nav-group-trigger" aria-controls="submenu-{group["label"]}"><span>{escape(t[group["label"]])}</span><svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></summary><div class="nav-subpanel" id="submenu-{group["label"]}">{links}</div></details>'
 nav=f'<details class="nav-dropdown main-menu-dropdown"><summary class="nav-trigger" aria-controls="header-main-menu"><span>{escape(t["navMenu"])}</span><svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></summary><div class="nav-panel main-menu-panel" id="header-main-menu">{nav_links}</div></details>'
 theme_labels={
  'ru':{'light':'Дневная тема','dark':'Ночная тема'},
  'ky':{'light':'Күндүзгү тема','dark':'Түнкү тема'},
  'en':{'light':'Day theme','dark':'Night theme'},
  'sv':{'light':'Dagtema','dark':'Nattema'},
  'nb':{'light':'Dagtema','dark':'Nattema'},
 }[lang]
 theme_button=f'<button type="button" class="button-7 theme-toggle" data-theme-toggle aria-label="{escape(theme_labels["light"],quote=True)}" title="{escape(theme_labels["light"],quote=True)}" aria-pressed="false" style="--button-7-width:200px"><span class="button-7-label">{escape(theme_labels["light"])}</span><span class="button-7-arrow" aria-hidden="true"><svg class="theme-icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg><svg class="theme-icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg></span></button>'
 header=f'<header class="site-header"><div class="shell header-inner"><nav class="site-nav" aria-label="{escape(t["home"],quote=True)}">{nav}</nav><div class="language-switcher"><details class="nav-dropdown language-dropdown"><summary class="nav-trigger language-trigger" aria-controls="header-languages"><span>{escape(LABELS[lang])}</span><svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></summary><div class="nav-panel language-panel" id="header-languages">{langs}</div></details></div>{theme_button}</div></header>'
 if not path:
  blooms=''
  for i in (1,3,4,6):
   asset=f'poppy-blossom-{i}.png'
   flower_url=os.path.relpath(ROOT/'public/assets'/asset,destination.parent).replace(os.sep,'/')
   mobile_url=os.path.relpath(ROOT/'public/assets'/f'poppy-blossom-{i}-mobile.png',destination.parent).replace(os.sep,'/')
   blooms+=f'<span class="botanical-bloom bloom-{i}" style="--poppy-image:url({escape(flower_url,quote=True)});--poppy-image-mobile:url({escape(mobile_url,quote=True)})"></span>' 
  heading=f'''<section id="gp-home" class="glyph-portal nurba-glyph-hero" data-gp-word="Nurba" data-gp-typography="true" aria-label="Nurba" style="--gp-paper:#fff;--gp-ink:#000;--gp-field:#fff"><div data-gp-viewport aria-hidden="true"></div><div data-gp-pin><div data-gp-field aria-hidden="true" inert><div class="hero-botanical-art">{blooms}</div></div><svg data-gp-art aria-hidden="true" focusable="false"><text data-gp-glyph x="0" y="0" style="font-family:'Glyph Portal Jakarta',Arial,sans-serif;font-size:100px;font-weight:700;font-kerning:none;font-variant-ligatures:none;letter-spacing:0">Nurba</text><g data-gp-marks style="visibility:hidden"><path/></g></svg><div data-gp-front><h1 id="hero-title">{escape(p["title"])}</h1></div><span data-gp-fallback aria-hidden="true" style="font-family:'Glyph Portal Jakarta',Arial,sans-serif;font-weight:700">Nurba</span></div></section>'''
 else:heading=f'<div class="page-heading"><div class="shell"><nav class="breadcrumbs" aria-label="{escape(t["home"],quote=True)}">{a("",t["home"])}<span aria-hidden="true">/</span><span>{escape(p["title"])}</span></nav><h1>{escape(p["title"])}</h1>'+ (f'<p>{escape(p["lead"])}</p>' if p['lead'] else '')+'</div></div>'
 def expanding_control(match):
  tag,attrs,classes,tail,content=match.groups()
  label=re.sub(r'<svg.*?</svg>','',content)
  label=re.sub(r'<[^>]+>','',label).replace(' ↗','').strip()
  from html import unescape
  if classes=='nav-trigger language-trigger':label=LANGUAGE_BUTTON[lang]
  plain_label=unescape(label)
  width=max(128,72+len(plain_label)*8)
  arrow='<span class="button-7-arrow" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></span>'
  if classes=='nav-trigger language-trigger':
   arrow=f'<span class="button-7-arrow" aria-hidden="true">{LANGUAGE_SHORT[lang]}</span>'
  if classes=='nav-trigger':
   arrow='<span class="button-7-arrow button-7-menu" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg></span>'
  action_class=" site-action" if classes not in ("nav-trigger","nav-trigger language-trigger","header-cta") else ""
  return f'<{tag}{attrs}class="{classes} button-7{action_class}"{tail} aria-label="{escape(plain_label,quote=True)}" style="--button-7-width:{width}px"><span class="button-7-label">{label}</span>{arrow}</{tag}>'
 pattern=r'<(a|summary|button|div)([^>]*?)class="(nav-trigger(?: language-trigger)?|header-cta|service-folder-link|card-link|button button-primary|button button-secondary)"([^>]*)>(.*?)</\1>'
 header=re.sub(pattern,expanding_control,header)
 blocks=[re.sub(pattern,expanding_control,markup) for markup in blocks]
 footer=f'<footer class="site-footer"><div class="shell"><div class="footer-grid"><div class="footer-intro"><h2>{escape(t["brandName"])}</h2><p>{escape(t["footerText"])}</p></div>'
 for group in FOOTER:footer+='<div class="footer-links">'+''.join(a(route,pages[route]['title']) for route in group)+'</div>'
 footer+=f'</div><div class="footer-bottom"><span>{escape(t["region"])}</span><div class="footer-legal">'+''.join(a(key,t[key]) for key in ['privacy','cookies','terms'])+'</div></div></div></footer>'
 config=json.dumps({'locale':lang,'labels':{k:t[k] for k in ['task','country','contact','name','comment','formError','formSuccess']}},ensure_ascii=False).replace('<','\\u003c')
 script=r'''
 const config=CONFIG;
 document.querySelectorAll('.knowledge-search').forEach(root=>{
  const input=root.querySelector('input');
  input.addEventListener('input',()=>{
   let count=0;const query=input.value.trim().toLocaleLowerCase(config.locale);
   root.querySelectorAll('.card').forEach(card=>{const show=card.textContent.toLocaleLowerCase(config.locale).includes(query);card.hidden=!show;card.style.display=show?'':'none';if(show)count++;});
   root.querySelector('.search-empty').hidden=count>0;
  });
 });
 document.querySelectorAll('.request-form').forEach(form=>{
  const contact=form.elements.namedItem('contact');
  contact.addEventListener('input',()=>contact.setCustomValidity(''));
  form.querySelector('button[type="submit"]').disabled=false;
  form.addEventListener('submit',event=>{
   event.preventDefault();const value=contact.value.trim();
   const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)||(/^[+\d\s().-]+$/.test(value)&&value.replace(/\D/g,'').length>=7);
   if(!valid){contact.setCustomValidity(config.labels.formError);contact.reportValidity();return;}
   contact.setCustomValidity('');
   const values=new FormData(form);const text=['task','country','contact','name','comment'].map(key=>config.labels[key]+': '+String(values.get(key)||'').trim()).join('\n\n');
   const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='project-request-'+config.locale+'.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   form.querySelector('.form-status').textContent=config.labels.formSuccess;
  });
 });
 '''.replace('CONFIG',config)
 script+='\n;(function(){\n'+(ROOT/'lib/dropdown-navigation.js').read_text().replace('export ','')+'\nmountDropdownNavigation(document.querySelector(\'.site-nav\'));mountDropdownNavigation(document.querySelector(\'.language-switcher\'));\n})();'
 script+=folder_runtime(ROOT)
 if not path:
  script+='\n;(function(){\n'+(ROOT/'lib/project-journey.js').read_text().replace('export ','')+'\ndocument.querySelectorAll(\'[data-project-journey]\').forEach(mountProjectJourney);\n})();'
 script+='\n;(function(){\n'+(ROOT/'lib/theme-toggle.js').read_text().replace('export ','')+'\nmountThemeToggle(document.querySelector(\'[data-theme-toggle]\'),'+json.dumps(theme_labels,ensure_ascii=False)+');\n})();'
 if not path:
  script+='\n;(function(){\n'+(ROOT/'lib/glyph-portal.js').read_text().replace('export ','')+'\nmountGlyphPortal(document.querySelector(\'.nurba-glyph-hero\'),{typographyOnly:true,interactive:false});\n})();'
 script+='\n;(function(){\n'+(ROOT/'lib/scroll-reveal.js').read_text().replace('export ','')+'\nmountScrollReveal();\n})();'
 alternates=''.join(f'<link rel="alternate" hreflang="{other}" href="{escape(url(path,other),quote=True)}">' for other in LANGS)
 social=social_metadata(lang,path,p['title'],p['lead'] or p['title'])
 theme_boot='<script>(function(){var t="light";try{var s=localStorage.getItem("nurba-theme");if(s==="dark"||s==="light")t=s}catch(e){}document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.dataset.theme=t})();</script>'
 return '<!doctype html>\n'+f'<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="{escape(p["lead"] or p["title"],quote=True)}"><title>{escape(p["title"])} | {escape(t["brandName"])}</title>{alternates}{social}{theme_boot}<style>{CSS}</style></head><body>{header}<main id="main">{snake_rail}{heading}{"".join(blocks)}</main>{footer}<script>{script}</script></body></html>'

for lang in LANGS:
 for path in DATA['locales'][lang]['pages']:
  destination=target(lang,path);destination.parent.mkdir(parents=True,exist_ok=True);destination.write_text(render(lang,path,destination))
preview=ROOT/'Предпросмотр.html'
preview.write_text(render('ru','',preview))

# Validate exported navigation, language equivalents and structural SEO without claiming browser QA.
class Audit(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=[];self.h1=0;self.lang=None;self.alternates=[];self.noindex=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='html':self.lang=a.get('lang')
  if tag=='a' and 'href' in a:self.links.append(a['href'])
  if tag=='option' and 'value' in a:self.links.append(a['value'])
  if tag=='link' and a.get('rel')=='alternate':self.alternates.append(a.get('hreflang'));self.links.append(a['href'])
  if tag=='h1':self.h1+=1
  if 'id' in a:self.ids.append(a['id'])
  if tag=='meta' and a.get('name')=='robots' and 'noindex' in a.get('content',''):self.noindex=True
files=[preview,*EXPORT.rglob('*.html')]
for file in files:
 a=Audit();a.feed(file.read_text())
 assert a.h1==1,(file,'H1')
 assert a.noindex,(file,'prototype must not be indexed')
 assert len(a.ids)==len(set(a.ids)),(file,'duplicate IDs')
 assert set(a.alternates)==set(LANGS),(file,'language links')
 for link in a.links:
  assert (file.parent/link).is_file(),(file,link)
for lang in LANGS:
 assert set(T[lang])==set(T['ru']),lang
 assert set(DATA['locales'][lang]['pages'])==set(DATA['locales']['ru']['pages']),lang
print('Offline export:',len(files),'HTML files; local links, language equivalents, H1 and noindex: OK')

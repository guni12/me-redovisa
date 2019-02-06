var obj = {
    questions: {
        find: function() {
            var l1, l2;

            l1 = "Att ta tillfället i akt att studera ett av de stora ramverken ";
            l1 += "är meningsfullt. Google gav vid handen att React är allra mest använt, med ";
            l1 += "Angular som tvåa. Det faktum att Vue har lånat från båda och ";
            l2 = "Dessutom såg jag att Vue specifikt efterfrågades i ett ";


            return [
                {
                    "question": "Vilket JavaScript-ramverk valde du och varför?",
                    "answer": [
                        l1 + "att det vid första anblick ser trevligt ut fick mig att välja det.",
                        l2 + "par jobb-annonser här från Göteborg."
                    ]
                },
                {
                    "question": "Hur gick det att sedan implementera din me-sida i ramverket?",
                    "answer": [
                        "Jag stötte på patrull ett flertal gånger under kursmomentet. \
                        Det tog mig en stund att förstå hur front-end-paketet skulle \
                        förhålla sig till back-end. Att vue-katalogen kunde skapas \
                        och ligga i princip varsomhelst i min dator.",
                        "Gitter-chatten har betytt en hel del, när andra har haft \
                        problem som jag också sedan har stött på.",
                        "Det var en stor hjälp att se hur Emil gjort sitt ramverk \
                        för Vue, som han också lagt ut på github.",
                        "När det basala till slut fungerade och jag förstod hur \
                        jag kan publicera hemifrån direkt till servern på \
                        DigitalOcean. Då hade jag slutligen problem med navigeringen \
                        mellan kursmomenten. Rubrikerna byttes, men inte momentet \
                        att hämta ny text.",
                        "Jag löste det genom 'watch: $route(to)'.",
                        "Lite klumpigt tycker jag det är att nu ha två olika \
                        funktioner med i princip samma innehåll. Men jag räknar med \
                        att jag kommer att kunna förbättra koden allteftersom.",
                        "För att kunna uppdatera kmom-texterna gjorde jag en extra \
                        sida: reports/update."
                    ]
                },
                {
                    "question": "Vilka fördelar ser du med ett JavaScript \
                    ramverk jämfört med vanilla JavaScript?",
                    "answer": [
                        "För en så här liten hemsida är det kanske ingen fördel. \
                        Men man blir tvungen att se hur andra duktiga programmerare \
                        bygger upp en struktur.",
                        "När man erövrat de olika features som följer med kommer \
                        man säkert att riktigt snabbt kunna skapa hemsidor.",
                        "Anställningsbarheten är också ett viktigt argument.",
                        "Om javascript bara ingår som ett mindre programmeringsspråk \
                        i den byggda hemsidan, räcker det troligtvis med vanilla."
                    ]
                },
                {
                    "question": "Vilka lärdomar gjorde du dig när du implementerade \
                    autentisering med JWT på servern?",
                    "answer": [
                        "Jag hade liksom flera andra problem att få igång bcrypt på \
                        servern, men lokalt gick det bra. Därför gjorde jag två olika \
                        funktioner till en början, en för bcrypt och en för bcrypjs.",
                        "Men sedan jag hämtat den uppdaterade package.json till \
                        servern och körde den, utan att tänka på bcrypt, så gick \
                        det hur bra som helst att installera bcrypt plötsligt.",
                        "Det tog mig lite tid att komma igång, igen, med hur man \
                        skickar kod från en modul till en annan med javascript.",
                        "Det var åter en stor hjälp att kunna se hur Emil gjort med \
                        sin lager-app.",
                        "När man förstått hur man kan hantera variabler och skicka \
                        via header eller body så var grunden lagd.",
                        "Det ska bli spännande hur man kan implementera och spara \
                        jwt-koden i ramverket för att automatiskt hålla en medlem inloggad."
                    ]
                },
                {
                    "question": "Vad är din TIL för detta kmom?",
                    "answer": [
                        "Jag har behövt kämpa lite med detta moment.",
                        "En TIL är att inte ge upp. En annan är att \
                        felmeddelanden har mycket att ge."
                    ]
                }
            ];
        }
    }
};

module.exports = obj;

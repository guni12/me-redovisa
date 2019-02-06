var obj = {
    questions: {
        find: function() {
            return [
                {
                    "question": "Berätta utförligt om din syn på nodejs backend\
                     ramverk och berätta vilket ramverk du valde och varför.",
                    "answer": [
                        "Jag har mycket kvar att lära om det mesta, \
                        så också om ramverk för javascript.",
                        "Eftersom jag inte har använt Express ännu och det är ett \
                        mycket efterfrågat Ramverk i jobb-annonser, så tycker \
                        jag detta är en bra chans.",
                        "Ett full-stack MVC hade varit ett alternativ. Men det kan \
                        kanske bli utrymme för att knyta \
                        fler delar till projektet under kursens gång.",
                        "Jag tycker att 'We' ser trevligt ut, med \
                        överblickbar documentation och lovar interoperabilitet. \
                        'Seneca' ser också bra ut med sina tutorials och tydliga api.",
                        "Men huruvida ett ramverk är tungt eller lätt, fungerar eller \
                        ger huvudvärk, det kräver ju erfarenhet att veta."
                    ]
                },
                {
                    "question": "Berätta om din katalogstruktur och hur \
                    du organiserade din kod, hur tänkte du?",
                    "answer": [
                        "Jag har använt den struktur, än så länge, som skapades av Express.",
                        "För att hantera kursmomenten har jag lagt dem, med sitt \
                        eget kmom-nr, i var sin egen fil.",
                        "Dvs den första heter 'public/javascripts/kmom01.js'.",
                        "På så sätt kan samma route '/:kmom' finna just det kmom \
                        som efterfrågas i requesten.",
                        "Frågor och svar samlas i ett objekt i en modul\
                         som exporteras till ramverket.",
                        "Vi får se om denna struktur håller för hela kursen."

                    ]
                },
                {
                    "question": "Använde du någon form av scaffolding som ditt \
                    valda ramverk erbjuder?",
                    "answer": [
                        "Jag valde att ta den av Express föreslagna \
                        genererade varianten med '--view=pug'.",
                        "Sedan insåg jag att med json-svar kanske jag \
                        inte kommer att använda markdown så mycket.",
                        "Men det får visa sig senare. Nu finns den möjligheten också i varje fall."
                    ]
                },
                {
                    "question": "Vad är din TIL för detta kmom?",
                    "answer": [
                        "Det var mycket matnyttigt i detta kursmoment.",
                        "Bl.a. har jag använt raspberry pi tidigare och oroat mig över säkerheten.",
                        "Nginx har jag läst om och förstått inte är så tung som apache2.\
                        Jag ser mycket fram emot att lära mig mer om den.",
                        "Jag krånglade till det och skapade en ny .pub nyckel, \
                        innan jag mindes att den som ska hittas \
                        ligger i home-katalogen i mitt subsystem.",
                        "Sedan behövde gpg2 kunna läsa av nyckeln. Det löstes med 'gpg2 -K'",
                        "Länge syntes inte nginx text på min digitalocean hemsida. \
                        Tyvärr kan jag inte riktigt avgöra varför det plötsligt löste sig.",
                        "Och med en ny variant av subdomän kopplad till \
                        config-filen under sites-available \
                        så fungerade även routerna till sist.",
                        "Att vara supernoggrann, det är en viktig TIL."
                    ]
                }
            ];
        }
    }
};

module.exports = obj;

import { SiteHeader } from "@/app/components/site-header";

export const metadata = {
  title: "Regulamin — UżywanyFon",
};

export default function RegulaminPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Regulamin serwisu UżywanyFon
        </h1>
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
          Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
        </p>

        <div className="flex flex-col gap-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              §1 Postanowienia ogólne
            </h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Właścicielem i sprzedawcą w serwisie UżywanyFon (dalej:
                „Serwis”) jest Grzegorz Tokarz, osoba fizyczna nieprowadząca
                zarejestrowanej działalności gospodarczej (dalej:
                „Sprzedawca”).
              </li>
              <li>
                Kontakt ze Sprzedawcą możliwy jest pod adresem e-mail: [adres
                e-mail kontaktowy — zostanie uzupełniony po uruchomieniu
                docelowej domeny].
              </li>
              <li>
                Serwis służy do prezentacji i sprzedaży używanych telefonów
                komórkowych będących własnością Sprzedawcy.
              </li>
              <li>
                Ponieważ Sprzedawca nie prowadzi zarejestrowanej działalności
                gospodarczej, do sprzedaży nie stosuje się w pełnym zakresie
                przepisów ustawy z dnia 30 maja 2014 r. o prawach konsumenta
                (m.in. ustawowego prawa odstąpienia od umowy zawartej na
                odległość w terminie 14 dni bez podania przyczyny). Sprzedaż
                odbywa się na zasadach ogólnych Kodeksu cywilnego, w tym z
                zachowaniem odpowiedzialności Sprzedawcy z tytułu rękojmi za
                wady rzeczy sprzedanej (art. 556 i nast. Kodeksu cywilnego),
                opisanej szczegółowo w §6.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              §2 Definicje
            </h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <strong>Kupujący</strong> — osoba fizyczna posiadająca konto w
                Serwisie i składająca zamówienie.
              </li>
              <li>
                <strong>Konto</strong> — indywidualne konto Kupującego w
                Serwisie, zakładane poprzez formularz rejestracji i
                aktywowane po potwierdzeniu adresu e-mail.
              </li>
              <li>
                <strong>Towar</strong> — używany telefon komórkowy (wraz z
                wybranym wariantem koloru/pojemności) oferowany do sprzedaży
                w Serwisie.
              </li>
              <li>
                <strong>Zamówienie</strong> — oświadczenie woli Kupującego
                zmierzające do zawarcia umowy sprzedaży Towaru, złożone za
                pośrednictwem Serwisu.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              §3 Konto i rejestracja
            </h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Złożenie zamówienia wymaga założenia Konta i potwierdzenia
                adresu e-mail poprzez link aktywacyjny wysłany na podany
                adres.
              </li>
              <li>
                Kupujący zobowiązany jest do podania prawdziwych danych oraz
                do zachowania w poufności hasła do Konta.
              </li>
              <li>
                Kupujący może w każdej chwili zażądać usunięcia Konta,
                kontaktując się ze Sprzedawcą na adres wskazany w §1.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              §4 Składanie zamówień
            </h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Zamówienia składane są poprzez dodanie wybranych wariantów
                Towaru do koszyka, a następnie podanie danych odbiorcy i
                adresu wysyłki oraz potwierdzenie zamówienia przyciskiem
                „Złóż zamówienie”.
              </li>
              <li>
                Umowę sprzedaży uważa się za zawartą z chwilą potwierdzenia
                złożenia zamówienia przez Serwis.
              </li>
              <li>
                Ceny Towarów podane w Serwisie są cenami końcowymi wyrażonymi
                w złotych polskich (PLN) i nie zawierają kosztów wysyłki,
                które są wskazywane odrębnie przed złożeniem zamówienia.
              </li>
              <li>
                Ze względu na ograniczoną dostępność używanych egzemplarzy,
                Sprzedawca zastrzega możliwość anulowania zamówienia, jeśli
                dany wariant Towaru okazał się niedostępny — w takim
                przypadku Kupujący zostanie o tym niezwłocznie
                poinformowany, a ewentualna płatność zwrócona w całości.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              §5 Płatność i wysyłka
            </h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Płatność za zamówienie odbywa się elektronicznie, za
                pośrednictwem zewnętrznego operatora płatności, którego
                nazwa i sposób obsługi zostaną wskazane w procesie składania
                zamówienia.
              </li>
              <li>
                Wysyłka Towaru realizowana jest — w zależności od wyboru
                Kupującego — kurierem pod wskazany adres, do paczkomatu/punktu
                odbioru, albo poprzez odbiór osobisty ustalony indywidualnie
                ze Sprzedawcą.
              </li>
              <li>
                Czas realizacji i wysyłki zamówienia wynosi zazwyczaj do 3
                dni roboczych od zaksięgowania płatności, chyba że przy
                danym Towarze wskazano inaczej.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              §6 Stan Towaru i rękojmia
            </h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Wszystkie Towary w Serwisie są egzemplarzami używanymi.
                Każdy Towar opisany jest jednym ze stanów: „Nowy”, „Bardzo
                dobry”, „Dobry”, „Zadowalający” lub „Uszkodzony”, a Sprzedawca
                dokłada starań, aby opis i zdjęcia rzetelnie odzwierciedlały
                faktyczny stan egzemplarza.
              </li>
              <li>
                Przy każdym wariancie Towaru wskazana jest informacja o
                ewentualnej blokadzie simlock.
              </li>
              <li>
                Niezależnie od statusu Sprzedawcy jako osoby prywatnej,
                Kupującemu przysługuje ustawowa rękojmia za wady fizyczne i
                prawne rzeczy sprzedanej na zasadach określonych w Kodeksie
                cywilnym (art. 556–576). Reklamację z tytułu rękojmi można
                zgłosić na adres kontaktowy wskazany w §1, opisując
                stwierdzoną wadę.
              </li>
              <li>
                Sprzedawca rozpatruje reklamację i ustosunkowuje się do niej
                w terminie 14 dni od jej otrzymania.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              §7 Dobrowolny zwrot
            </h2>
            <p>
              Poza ustawową rękojmią, Sprzedawca dopuszcza możliwość zwrotu
              Towaru w terminie 14 dni od jego otrzymania, jeśli Towar nie
              nosi śladów użytkowania wykraczających poza opisany stan i
              zostanie odesłany w stanie kompletnym, na koszt Kupującego. O
              chęci zwrotu należy poinformować Sprzedawcę drogą mailową
              przed odesłaniem Towaru.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              §8 Dane osobowe
            </h2>
            <p>
              Zasady przetwarzania danych osobowych Kupujących opisane są w{" "}
              <a
                href="/polityka-prywatnosci"
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Polityce prywatności
              </a>
              , stanowiącej integralne uzupełnienie niniejszego regulaminu.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              §9 Postanowienia końcowe
            </h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                W sprawach nieuregulowanych niniejszym regulaminem
                zastosowanie mają przepisy prawa polskiego, w szczególności
                Kodeksu cywilnego.
              </li>
              <li>
                Sprzedawca zastrzega sobie prawo do zmiany regulaminu.
                Zamówienia złożone przed wejściem w życie zmian realizowane
                są na dotychczasowych zasadach.
              </li>
              <li>
                Ewentualne spory strony będą starały się rozwiązać
                polubownie; w przypadku braku porozumienia właściwy będzie
                sąd zgodnie z obowiązującymi przepisami.
              </li>
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
}

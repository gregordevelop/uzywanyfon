import { SiteHeader } from "@/app/components/site-header";

export const metadata = {
  title: "Polityka prywatności — UżywanyFon",
};

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Polityka prywatności
        </h1>
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
          Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
        </p>

        <div className="flex flex-col gap-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              1. Administrator danych
            </h2>
            <p>
              Administratorem danych osobowych zbieranych w serwisie
              UżywanyFon jest Grzegorz Tokarz (dalej: „Administrator”),
              kontakt: [adres e-mail kontaktowy — zostanie uzupełniony po
              uruchomieniu docelowej domeny].
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              2. Jakie dane przetwarzamy
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Imię i adres e-mail — przy zakładaniu konta.</li>
              <li>
                Hasło — przechowywane wyłącznie w formie zahaszowanej
                (bcrypt), nigdy jako czysty tekst.
              </li>
              <li>
                Dane do wysyłki — imię i nazwisko odbiorcy, numer telefonu,
                ulica, kod pocztowy, miasto — podawane przy składaniu
                zamówienia.
              </li>
              <li>Historia zamówień i ich zawartość.</li>
              <li>
                Adres IP — wykorzystywany technicznie do ograniczania liczby
                prób rejestracji i logowania (ochrona przed nadużyciami).
              </li>
              <li>
                Niezbędne pliki cookie — utrzymujące sesję logowania oraz
                zawartość koszyka zakupowego.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              3. Cel i podstawa prawna przetwarzania
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Realizacja zamówień i obsługa konta — art. 6 ust. 1 lit. b
                RODO (przetwarzanie niezbędne do wykonania umowy).
              </li>
              <li>
                Ochrona przed nadużyciami (np. automatycznymi rejestracjami)
                — art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes
                Administratora).
              </li>
              <li>
                Rozpatrywanie ewentualnych reklamacji — art. 6 ust. 1 lit. c
                i f RODO.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              4. Odbiorcy danych
            </h2>
            <p className="mb-2">
              Dane mogą być przekazywane wyłącznie podmiotom niezbędnym do
              realizacji powyższych celów:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                dostawcy hostingu i skrzynki pocztowej, za pośrednictwem
                których działa Serwis i wysyłane są wiadomości e-mail,
              </li>
              <li>
                dostawcy bazy danych, na której przechowywane są dane
                Serwisu,
              </li>
              <li>
                Cloudflare (usługa Turnstile) — w celu odróżnienia
                prawdziwych użytkowników od botów przy rejestracji,
              </li>
              <li>
                firmie kurierskiej / operatorowi paczkomatów — wyłącznie
                dane niezbędne do doręczenia przesyłki (imię i nazwisko,
                adres, telefon),
              </li>
              <li>
                operatorowi płatności elektronicznych — w zakresie
                niezbędnym do zrealizowania płatności za zamówienie.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              5. Okres przechowywania danych
            </h2>
            <p>
              Dane konta przechowywane są do czasu usunięcia konta przez
              użytkownika. Dane zamówień przechowywane są przez okres
              niezbędny do obsługi ewentualnej reklamacji oraz zgodnie z
              obowiązującymi przepisami.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              6. Prawa użytkownika
            </h2>
            <p className="mb-2">
              Zgodnie z RODO przysługuje Ci prawo do:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>dostępu do swoich danych i otrzymania ich kopii,</li>
              <li>sprostowania (poprawienia) danych,</li>
              <li>usunięcia danych („prawo do bycia zapomnianym”),</li>
              <li>ograniczenia przetwarzania,</li>
              <li>przenoszenia danych,</li>
              <li>wniesienia sprzeciwu wobec przetwarzania,</li>
              <li>
                wniesienia skargi do Prezesa Urzędu Ochrony Danych
                Osobowych (UODO).
              </li>
            </ul>
            <p className="mt-2">
              W celu skorzystania z powyższych praw skontaktuj się z
              Administratorem na adres wskazany w §1.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              7. Pliki cookie
            </h2>
            <p>
              Serwis wykorzystuje wyłącznie niezbędne pliki cookie — do
              utrzymania sesji zalogowanego użytkownika oraz zawartości
              koszyka. Nie wykorzystujemy cookies reklamowych ani
              analitycznych firm trzecich.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              8. Bezpieczeństwo danych
            </h2>
            <p>
              Hasła użytkowników przechowywane są w formie zahaszowanej i
              nie są znane Administratorowi. Dostęp do panelu
              administracyjnego Serwisu zabezpieczony jest osobnym hasłem.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              9. Zmiany polityki prywatności
            </h2>
            <p>
              Administrator zastrzega sobie prawo do wprowadzania zmian w
              niniejszej polityce prywatności. Aktualna wersja zawsze
              dostępna jest pod tym adresem.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

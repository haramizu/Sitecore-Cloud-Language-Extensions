import { useState, useEffect } from "react";
import languages from "../resources/languages.json";
import { storage } from "@wxt-dev/storage";
import "./App.css";

function App() {
  const browserLocale = navigator.language.slice(0, 2);
  const [selectedLanguage, setSelectedLanguage] = useState(browserLocale);

  const setLanguageStorage = async (lang: string) => {
    await storage.setItem(`local:preferredLanguage`, lang);
  };

  const getLanguageStorage = async () => {
    const lang = (await storage.getItem(`local:preferredLanguage`)) as string;
    return lang || browserLocale;
  };

  useEffect(() => {
    const initLanguage = async () => {
      const savedLang = (await getLanguageStorage()) as string;
      setSelectedLanguage(savedLang);
    };
    initLanguage();
  }, []);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = event.target.value;
    setSelectedLanguage(newLang);
    setLanguageStorage(newLang).then(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  };

  return (
    <>
      <h1 className="heading-1">Sitecore Language Switcher</h1>
      <div className="card">
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="language-select"
        >
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default App;

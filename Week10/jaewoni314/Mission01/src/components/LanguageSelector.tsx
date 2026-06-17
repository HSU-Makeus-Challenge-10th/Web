import { memo } from "react";
import { LANGUAGE_OPTIONS } from "../constants/movie";
import type { MovieLanguage } from "../types/movie";
import SelectBox from "./SelectBox";

interface LanguageSelectorProps {
  language: MovieLanguage;
  onChange: (language: MovieLanguage) => void;
}

function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  console.log("LanguageSelector 렌더링");

  return (
    <SelectBox value={language} options={LANGUAGE_OPTIONS} onChange={onChange} />
  );
}

export default memo(LanguageSelector);

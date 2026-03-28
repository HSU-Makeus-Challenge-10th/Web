import type { FormEvent } from "react";

export type TTodo = {
  id: number;
  text: string;
};

export interface TodoFormProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export interface TTodoListProps {
  title: string;
  todos?: TTodo[];
  buttonLabel: string;
  buttonColor: string;
  onClick?: (todo: TTodo) => void;
}

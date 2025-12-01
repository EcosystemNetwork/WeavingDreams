import { Character } from './mockAi';

export interface WikiEnvironment {
  id: string;
  name: string;
  type: string;
  description: string;
  atmosphere: string;
  keyDetails: string;
  createdAt: number;
}

export interface WikiProp {
  id: string;
  name: string;
  category: string;
  description: string;
  appearance: string;
  significance: string;
  createdAt: number;
}

export interface WikiData {
  characters: Character[];
  environments: WikiEnvironment[];
  props: WikiProp[];
}

const WIKI_STORAGE_KEY = 'narrative_weaver_wiki';

export const wikiStore = {
  // Initialize with empty wiki if not exists
  init: (): WikiData => {
    const existing = localStorage.getItem(WIKI_STORAGE_KEY);
    if (existing) {
      return JSON.parse(existing);
    }
    const empty: WikiData = { characters: [], environments: [], props: [] };
    localStorage.setItem(WIKI_STORAGE_KEY, JSON.stringify(empty));
    return empty;
  },

  // Get all wiki data
  getAll: (): WikiData => {
    const data = localStorage.getItem(WIKI_STORAGE_KEY);
    return data ? JSON.parse(data) : { characters: [], environments: [], props: [] };
  },

  // Add character to wiki
  addCharacter: (character: Character): void => {
    const wiki = wikiStore.getAll();
    // Check if character already exists
    const exists = wiki.characters.some(c => c.name === character.name);
    if (!exists) {
      wiki.characters.push(character);
      localStorage.setItem(WIKI_STORAGE_KEY, JSON.stringify(wiki));
    }
  },

  // Get all characters from wiki
  getCharacters: (): Character[] => {
    return wikiStore.getAll().characters;
  },

  // Delete character from wiki
  deleteCharacter: (name: string): void => {
    const wiki = wikiStore.getAll();
    wiki.characters = wiki.characters.filter(c => c.name !== name);
    localStorage.setItem(WIKI_STORAGE_KEY, JSON.stringify(wiki));
  },

  // Add environment to wiki
  addEnvironment: (environment: WikiEnvironment): void => {
    const wiki = wikiStore.getAll();
    // Check if environment already exists
    const exists = wiki.environments.some(e => e.name === environment.name);
    if (!exists) {
      wiki.environments.push(environment);
      localStorage.setItem(WIKI_STORAGE_KEY, JSON.stringify(wiki));
    }
  },

  // Get all environments from wiki
  getEnvironments: (): WikiEnvironment[] => {
    return wikiStore.getAll().environments;
  },

  // Delete environment from wiki
  deleteEnvironment: (id: string): void => {
    const wiki = wikiStore.getAll();
    wiki.environments = wiki.environments.filter(e => e.id !== id);
    localStorage.setItem(WIKI_STORAGE_KEY, JSON.stringify(wiki));
  },

  // Add prop to wiki
  addProp: (prop: WikiProp): void => {
    const wiki = wikiStore.getAll();
    // Check if prop already exists
    const exists = wiki.props.some(p => p.name === prop.name);
    if (!exists) {
      wiki.props.push(prop);
      localStorage.setItem(WIKI_STORAGE_KEY, JSON.stringify(wiki));
    }
  },

  // Get all props from wiki
  getProps: (): WikiProp[] => {
    return wikiStore.getAll().props;
  },

  // Delete prop from wiki
  deleteProp: (id: string): void => {
    const wiki = wikiStore.getAll();
    wiki.props = wiki.props.filter(p => p.id !== id);
    localStorage.setItem(WIKI_STORAGE_KEY, JSON.stringify(wiki));
  },

  // Clear all wiki data
  clear: (): void => {
    localStorage.removeItem(WIKI_STORAGE_KEY);
  }
};

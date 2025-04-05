// localPromptDB.ts

export interface Prompt {
	uuid: string;
	createdAt: number;
	updatedAt: number;

	title: string;
	prompt: string;

	isForText: boolean;
	isForCode: boolean;
	isForImage: boolean;
	isForVideo: boolean;
	isForAudio: boolean,

	isForChatgpt: boolean;
	isForClaude: boolean;
	isForDeepseek: boolean;
	isForGemini: boolean;
	isForGrok: boolean;

	isFavorite: boolean;
	isGoat: boolean;
	isNsfw: boolean;
	isHidden: boolean;
}

export type PromptBooleanKey = keyof Pick<
	Prompt, 'isForText' | 'isForCode' | 'isForImage' | 'isForVideo' | 'isForAudio'
		| 'isForChatgpt' | 'isForClaude' | 'isForDeepseek' | 'isForGemini' | 'isForGrok'
		| 'isFavorite' | 'isGoat' | 'isNsfw' | 'isHidden'
>

const DB_NAME = 'LocalPromptDB';
const STORE_NAME = 'prompts';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				const store = db.createObjectStore(STORE_NAME, { keyPath: 'uuid' });
				store.createIndex('createdAt', 'createdAt', { unique: false });
			}
		};
	});
}

function generateUUID(): string {
	return crypto.randomUUID();
}

export function createEmptyPrompt(): Prompt {
	const prompt: Prompt = {
		uuid: generateUUID(),
		title: '',
		prompt: '',

		createdAt: 0,
		updatedAt: 0,

		isForText: false,
		isForCode: false,
		isForImage: false,
		isForVideo: false,
		isForAudio: false,

		isForChatgpt: false,
		isForClaude: false,
		isForDeepseek: false,
		isForGemini: false,
		isForGrok: false,

		isFavorite: false,
		isGoat: false,
		isNsfw: false,
		isHidden: false
	};
	return prompt;
}

export const Checkboxes: { label: string, prop: PromptBooleanKey }[] = [
	{ label: 'Text', prop: 'isForText' },
	{ label: 'Code', prop: 'isForCode' },
	{ label: 'Image', prop: 'isForImage' },
	{ label: 'Video', prop: 'isForVideo' },
	{ label: 'Audio', prop: 'isForAudio' },

	{ label: 'ChatGPT', prop: 'isForChatgpt' },
	{ label: 'Claude', prop: 'isForClaude' },
	{ label: 'Deepseek', prop: 'isForDeepseek' },
	{ label: 'Gemini', prop: 'isForGemini' },
	{ label: 'Grok', prop: 'isForGrok' },

	{ label: 'Favorite', prop: 'isFavorite' },
	{ label: 'GOAT', prop: 'isGoat' },
	{ label: 'NSFW', prop: 'isNsfw' },
	{ label: 'Hidden', prop: 'isHidden' },
];

export async function addPromptToDB(prompt: Prompt): Promise<void> {
	prompt = { ...prompt };
	const now = Date.now();
	prompt.createdAt = prompt.createdAt || now;
	prompt.updatedAt = now;

	const db = await openDB();
	const tx = db.transaction(STORE_NAME, 'readwrite');
	const store = tx.objectStore(STORE_NAME);

	store.put(prompt);

	await new Promise<void>((resolve, reject) => {
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
	db.close();
}

export async function getPromptFromDB(uuid: string): Promise<Prompt | undefined> {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, 'readonly');
	const store = tx.objectStore(STORE_NAME);
	const result = await new Promise<Prompt | undefined>((resolve, reject) => {
		const request = store.get(uuid);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
	db.close();
	return result;
}

export async function getAllCreatedTimestamps(): Promise<number[]> {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, 'readonly');
	const store = tx.objectStore(STORE_NAME);
	const timestamps: number[] = [];

	await new Promise<void>((resolve, reject) => {
		const index = store.index('createdAt');
		const request = index.openCursor();
		request.onsuccess = () => {
			const cursor = request.result;
			if (cursor) {
				timestamps.push(cursor.value.createdAt);
				cursor.continue();
			} else {
				resolve();
			}
		};
		request.onerror = () => reject(request.error);
	});

	db.close();
	return timestamps;
}

export async function getPromptsInRange(from: number, to: number): Promise<Prompt[]> {
	const t1 = Math.min(from, to);
	const t2 = Math.max(from, to);
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, 'readonly');
	const store = tx.objectStore(STORE_NAME);
	const index = store.index('createdAt');

	const prompts: Prompt[] = [];

	await new Promise<void>((resolve, reject) => {
		const range = IDBKeyRange.bound(t1, t2);
		const request = index.openCursor(range);
		request.onsuccess = () => {
			const cursor = request.result;
			if (cursor) {
				prompts.push(cursor.value);
				cursor.continue();
			} else {
				resolve();
			}
		};
		request.onerror = () => reject(request.error);
	});

	db.close();
	return prompts;
}

export async function deletePromptFromDB(uuid: string): Promise<void> {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, 'readwrite');
	const store = tx.objectStore(STORE_NAME);
	store.delete(uuid);
	await new Promise<void>((resolve, reject) => {
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
	db.close();
}

async function updatePromptInDB(prompt: Prompt): Promise<void> {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, 'readwrite');
	const store = tx.objectStore(STORE_NAME);
	store.put(prompt);
	await new Promise<void>((resolve, reject) => {
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
	db.close();
}

export async function togglePromptPropInDB(uuid: string, prop: PromptBooleanKey): Promise<void> {
	const prompt = await getPromptFromDB(uuid);
	if (!prompt) return;

	prompt[prop] = !prompt[prop];
	prompt.updatedAt = Date.now();
	await updatePromptInDB(prompt);
}

export const toggleFavorite = (uuid: string) => togglePromptPropInDB(uuid, 'isFavorite');
export const toggleHidden = (uuid: string) => togglePromptPropInDB(uuid, 'isHidden');

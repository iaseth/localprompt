// localPromptDB.ts

export interface Prompt {
	uuid: string;
	createdAt: number;
	updatedAt: number;

	title: string;
	prompt: string;

	isForText: boolean;
	isForImage: boolean;
	isForVideo: boolean;
	isNsfw: boolean;

	isForChatgpt: boolean;
	isForClaude: boolean;
	isForGemini: boolean;
	isForDeepseek: boolean;
	isForGrok: boolean;

	isFavorite: boolean;
	isHidden: boolean;
}

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

export function getEmptyPrompt(): Prompt {
	const prompt: Prompt = {
		uuid: generateUUID(),
		title: '',
		prompt: '',

		createdAt: 0,
		updatedAt: 0,

		isForText: false,
		isForImage: false,
		isForVideo: false,
		isNsfw: false,

		isForChatgpt: false,
		isForClaude: false,
		isForGemini: false,
		isForDeepseek: false,
		isForGrok: false,

		isFavorite: false,
		isHidden: false
	};
	return prompt;
}

export async function addPrompt(prompt: Prompt): Promise<void> {
	prompt = JSON.parse(JSON.stringify(prompt));
	const now = Date.now();
	prompt.createdAt = now;
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

export async function getPrompt(uuid: string): Promise<Prompt | undefined> {
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
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, 'readonly');
	const store = tx.objectStore(STORE_NAME);
	const index = store.index('createdAt');

	const prompts: Prompt[] = [];

	await new Promise<void>((resolve, reject) => {
		const range = IDBKeyRange.bound(from, to);
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

export async function deletePrompt(uuid: string): Promise<void> {
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

async function updatePrompt(prompt: Prompt): Promise<void> {
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

export async function toggleProp(uuid: string, prop: keyof Pick<
	Prompt, 'isFavorite' | 'isHidden'
>): Promise<void> {
	const prompt = await getPrompt(uuid);
	if (!prompt) return;

	prompt[prop] = !prompt[prop];
	prompt.updatedAt = Date.now();
	await updatePrompt(prompt);
}

export const toggleFavorite = (uuid: string) => toggleProp(uuid, 'isFavorite');
export const toggleHidden = (uuid: string) => toggleProp(uuid, 'isHidden');

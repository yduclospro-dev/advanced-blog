import "@testing-library/jest-dom";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

jest.mock('@/components/ClientOnly', () => ({
	__esModule: true,
	default: ({ children }: { children: React.ReactNode }) => children
}));

jest.mock("resend", () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: { send: jest.fn() }
    }))
  };
});

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	})
});

if (typeof HTMLFormElement !== 'undefined' && !HTMLFormElement.prototype.requestSubmit) {
	HTMLFormElement.prototype.requestSubmit = function (this: HTMLFormElement & { submit?: () => void }, submitter?: Element | null) {
		try {
			if (submitter && typeof (submitter as HTMLElement | { click?: unknown }).click === 'function') {
				(submitter as HTMLElement).click();
				return;
			}

			const submitBtn = this.querySelector('[type="submit"]') as (HTMLElement | null);
			if (submitBtn && typeof submitBtn.click === 'function') {
				submitBtn.click();
				return;
			}

			if (typeof this.submit === 'function') {
				this.submit();
			}
		} catch {
		}
	};
}

type TestUser = {
	id: string;
	username?: string;
	userName?: string;
	email?: string;
	password?: string;
	role?: string;
};

type TestState = {
	users: TestUser[];
	currentUser: TestUser | null;
	isAuthenticated: boolean;
	addUser?: (user: TestUser) => boolean;
	getUserByEmail?: (email: string) => TestUser | undefined;
	getAllUsers?: () => TestUser[];
	checkIfUsernameOrEmailExists?: (username: string, email: string) => boolean;
	login?: () => Promise<{ success: boolean }>;
	logout?: () => void;
	register?: () => Promise<{ success: boolean }>;
};

let _state: TestState = {
	users: [],
	currentUser: null,
	isAuthenticated: false,
};

const updateState = (partial: Partial<TestState>) => {
	_state = { ..._state, ...partial };
};

type UseUserStoreType = {
	<T>(selector?: (s: TestState) => T): T | TestState;
	getState: () => TestState;
	setState: (partial: Partial<TestState>) => void;
	subscribe: (listener: () => void) => () => void;
};

const useUserStore = (function <T>(selector?: (s: TestState) => T) {
	if (typeof selector === 'function') return selector(_state) as T;
	return _state as unknown as T | TestState;
} as unknown) as UseUserStoreType;

useUserStore.getState = () => _state;
useUserStore.setState = (partial: Partial<TestState>) => updateState(partial);
useUserStore.subscribe = () => () => {};

useUserStore.getState().addUser = (user: TestUser) => {
	if (!user?.id || !user?.username || !user?.email || !user?.password) return false;
	_state = { ..._state, users: [..._state.users, user] };
	return true;
};
useUserStore.getState().getUserByEmail = (email: string) => _state.users.find((u) => u.email === email);
useUserStore.getState().getAllUsers = () => _state.users;
useUserStore.getState().checkIfUsernameOrEmailExists = (username: string, email: string) =>
	_state.users.some((u) => u.username === username || u.email === email);

useUserStore.getState().login = async () => ({ success: false });
useUserStore.getState().logout = () => {
	_state = { ..._state, currentUser: null, isAuthenticated: false };
};
useUserStore.getState().register = async () => ({ success: false });

jest.mock('@/stores/userStore', () => ({ useUserStore }));

jest.mock('next/navigation', () => {
	const push = jest.fn();
	const replace = jest.fn();
	const prefetch = jest.fn(() => Promise.resolve());

	return {
		__esModule: true,
		useRouter: () => ({ push, replace, prefetch }),
		useSearchParams: () => ({ get: () => null }),
		useParams: () => ({}),
	};
});

jest.mock('@/utils/axios', () => {
	const mock = {
		get: jest.fn(() => Promise.resolve({ data: [] })),
		post: jest.fn((url, payload) => Promise.resolve({
			data: {
				id: `article-${Math.random().toString(36).slice(2)}`,
				title: payload && payload.title,
				content: payload && payload.content,
				imageUrl: payload && payload.imageUrl,
				date: new Date().toISOString(),
				author: payload && payload.author || 'test-author',
				authorId: payload && payload.authorId || 'test-author-id',
			}
		})),
		put: jest.fn((url, payload) => {
			const parts = String(url).split('/');
			const id = parts[parts.length - 1];
			return Promise.resolve({ data: Object.assign({ id }, payload || {}) });
		}),
		delete: jest.fn(() => Promise.resolve({})),
	};

	return { __esModule: true, default: mock };
});

const _origConsoleError = console.error;
const quietErrors = process.env.QUIET_TEST_ERRORS !== 'false';

if (quietErrors) {
	console.error = () => {
	};

	interface QuietHelpers {
		__quietConsoleErrors: () => () => void;
		__unquietConsoleErrors: () => () => void;
		__lastConsoleError?: unknown[];
	}

	const helpers = globalThis as unknown as QuietHelpers;

	helpers.__quietConsoleErrors = () => {
		const prev = console.error;
		console.error = (...args: unknown[]) => {
			helpers.__lastConsoleError = args;
		};
		return () => {
			console.error = prev;
		};
	};

	helpers.__unquietConsoleErrors = () => {
		console.error = _origConsoleError;
		return () => {
			console.error = () => {};
		};
	};
}
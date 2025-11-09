import "@testing-library/jest-dom";

// Render ClientOnly children synchronously in tests to avoid the fallback 'Chargement...' UI
jest.mock('@/components/ClientOnly', () => ({
	__esModule: true,
	default: ({ children }: { children: React.ReactNode }) => children
}));

// Provide a noop for window.matchMedia which some components may use
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

// Polyfill for jsdom: HTMLFormElement.requestSubmit is not implemented in older jsdom versions
// Some tests (and @testing-library/dom) call requestSubmit via button interactions. Provide a
// small shim that delegates to a submit button click or falls back to form.submit().
if (typeof HTMLFormElement !== 'undefined' && !HTMLFormElement.prototype.requestSubmit) {
	HTMLFormElement.prototype.requestSubmit = function (this: HTMLFormElement & { submit?: () => void }, submitter?: Element | null) {
		try {
			// If a submitter element with a click handler is provided, prefer it
			if (submitter && typeof (submitter as HTMLElement | { click?: unknown }).click === 'function') {
				(submitter as HTMLElement).click();
				return;
			}

			const submitBtn = this.querySelector('[type="submit"]') as (HTMLElement | null);
			if (submitBtn && typeof submitBtn.click === 'function') {
				submitBtn.click();
				return;
			}

			// Fallback to the native submit if available on the form element
			if (typeof this.submit === 'function') {
				this.submit();
			}
		} catch {
			// swallow - tests shouldn't fail because of the shim
		}
	};
}

// Provide a lightweight test implementation for useUserStore (zustand) so store unit tests
// and components relying on the user store API can run in Jest without hitting real persistence or network.
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

// API helpers expected by tests
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

// Provide a default mock for Next.js navigation hooks used in client components
// This prevents the "invariant expected app router to be mounted" error when
// a test doesn't mock `next/navigation` explicitly.
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

// Mock the axios instance used by the app so store unit tests don't hit the network.
// The mock provides minimal get/post/put/delete implementations returning
// objects shaped like Axios responses ({ data }). Tests rely on these shapes.
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

// Quiet noisy console.error output during tests by default.
// Set QUIET_TEST_ERRORS=false in the environment to see errors as usual.
const _origConsoleError = console.error;
const quietErrors = process.env.QUIET_TEST_ERRORS !== 'false';

if (quietErrors) {
	// Replace console.error with a no-op that can be toggled back in tests
	console.error = () => {
		// no-op by default during tests
	};

	// Expose helpers for tests that need to assert on console.error output
	// Usage in a test:
	//   const restore = (globalThis as any).__unquietConsoleErrors();
	//   // run code that should log errors
	//   restore();
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
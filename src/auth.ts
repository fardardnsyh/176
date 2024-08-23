import { SvelteKitAuth, type DefaultSession } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import GitHub from '@auth/sveltekit/providers/github';

declare module '@auth/sveltekit' {
	interface Session {
		user: {
			id: string;
		} & DefaultSession['user'];
	}
}

export const { handle } = SvelteKitAuth({
	providers: [
		GitHub,
		Credentials({
			name: 'a demo user',
			async authorize() {
				return { id: '1', name: 'Jane Doe', email: 'jsmith@example.com', image: '/demouser.jpg' };
			}
		})
	],
	callbacks: {
		jwt({ token, profile }) {
			if (profile?.id) {
				token.id = profile.id;
			} else if (token.sub === '1') {
				// Demo user
				token.id = '1';
			}
			return token;
		},
		session({ session, token }) {
			const id = token.id;
			if (typeof id === 'number') {
				session.user.id = id.toString();
			} else if (typeof id === 'string') {
				session.user.id = id;
			}
			return session;
		}
	},
	// According to the Auth js documentation this flag should be set by Vercel, but for some reason it is not.
	trustHost: true
});

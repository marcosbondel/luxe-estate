export function createClient() {
  return {
    auth: {
      signOut: async () => {},
      signInWithOAuth: async () => {},
    },
  }
}

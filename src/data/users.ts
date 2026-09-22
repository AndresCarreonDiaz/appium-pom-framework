export type Credentials = { email: string; password: string }

/** The demo app accepts any well-formed email and a password of 8+ characters. */
export const validUser: Credentials = {
  email: 'qa.demo@example.com',
  password: 'Str0ngPassw0rd',
}

export const invalidEmailUser: Credentials = {
  email: 'not-an-email',
  password: 'Str0ngPassw0rd',
}

export const shortPasswordUser: Credentials = {
  email: 'qa.demo@example.com',
  password: 'short',
}

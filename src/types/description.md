# types

types are used to define the types of the data that is used in the application.

example:

```ts
export type User = {
  id: number;
  name: string;
  email: string;
};
```

file name: `user.ts` (not `user.d.ts`: with `skipLibCheck` enabled, errors inside `.d.ts` files are not reported)

import with `import type { User } from '@/types/user';`

`env.ts` declares the `process.env` variables (global `NodeJS.ProcessEnv`), keep it in sync with `.env.example`.

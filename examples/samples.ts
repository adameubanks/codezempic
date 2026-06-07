import type { Dose, Language } from '../src/rules/profiles'

export interface ExampleSample {
  title: string
  language: Language
  dose: Dose
  before: string
  after: string
  reduction: number
  removed: string[]
}

function sample(
  title: string,
  language: Language,
  dose: Dose,
  before: string,
  after: string,
  removed: string[]
): ExampleSample {
  const reduction = before.length > 0
    ? Math.round(((before.length - after.length) / before.length) * 100)
    : 0
  return { title, language, dose, before, after, reduction, removed }
}

export const SAMPLES: ExampleSample[] = [
  sample(
    'AI comment spam',
    'javascript',
    'small',
    `// This function checks whether a user is valid
// Returns true if the user object exists

function isValidUser(user) {
  // Make sure we actually have a user
  if (user) {
    // All good
    return true;
  }

  // Nothing to validate
  return false;
}`,
    `function isValidUser(user) {

  if (user) {

    return true;
  }

  return false;
}`,
    [
      '6 single-line comments',
      'Blank line cleanup',
    ]
  ),
  sample(
    'Unused imports and verbose booleans',
    'javascript',
    'medium',
    `import fs from 'fs';
import path from 'path';

function readConfig(file) {
  return fs.readFileSync(file, 'utf8');
}

function canAccess(user) {
  if (user.isActive === true) {
    return true;
  }
  return false;
}`,
    `import fs from 'fs';
function readConfig(file) {
  return fs.readFileSync(file, 'utf8');
}
function canAccess(user) {
  if (user.isActive) {
    return true;
  }
  return false;
}`,
    [
      'Unused import: path',
      'if (user.isActive === true) → if (user.isActive)',
    ]
  ),
  sample(
    'TypeScript bloat and AI wrapper patterns',
    'typescript',
    'large',
    `import { unusedHelper } from './utils';

interface UserData {
  id: string;
  name: string;
}

async function fetchUserDataHandler(userId: string): Promise<UserData> {
  const result = await fetch('/api/users/' + userId);
  return result;
}`,
    `async function fetchUserData(userId) {
  const result = await fetch('/api/users/' + userId);
  return result;
}`,
    [
      'Unused import removed',
      'interface UserData stripped',
      'Type annotations removed',
      'fetchUserDataHandler → fetchUserData',
    ]
  ),
]

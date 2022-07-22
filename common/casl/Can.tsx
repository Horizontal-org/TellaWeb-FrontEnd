import { createContext } from 'react';
import { createContextualCan } from '@casl/react';

export const AbilityContext = createContext(null);
export const Can = createContextualCan(AbilityContext.Consumer);
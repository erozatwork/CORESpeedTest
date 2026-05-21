import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const configAtom = atomWithStorage('config', {
  packageManager: 'pnpm',
});

export function useConfig() {
  return useAtom(configAtom);
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLp } from '../../apis/lp';
import type { CreateLpRequest } from '../../types/lp';

export const useCreateLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpData: CreateLpRequest) => createLp(lpData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
    },
  });
};

'use server'
import { trpc } from '@/utils/trpc'
import { TRPCClientError } from '@trpc/client';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation'
 
export async function login(state: { message: string }, formData: FormData) {
    try {
    const result = await trpc.auth.login.mutate({
        username: formData.get('username') as string ?? '',
        password: formData.get('password') as string ?? ''
    });
    
    if (result) {
        const cookieStore = await cookies();
        cookieStore.set('token', result.tokens.id);
    }
    } catch(error)  {
        return { message: (error as TRPCClientError<any>).message }
    }
    
    redirect('/', RedirectType.replace)
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    redirect('/', RedirectType.replace)
}
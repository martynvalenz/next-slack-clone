import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { type SignInFlow } from '../types'
import { type FormEvent, useState } from 'react'
import SocialLogin from './social-login'
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from 'lucide-react';

interface Props {
  setState:(state:SignInFlow) => void
}

const SignInCard = ({
  setState
}:Props) => {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending,setPending] = useState(false)

  const onProviderSignIn = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    signIn('password', { email, password, flow: 'signIn' })
    .catch(() => {
      setError('Invalid email or password')
      setPending(false)
    })
  }
  
  return (
    <Card className='w-full h-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
          <TriangleAlert className='size-4' />
          <p>{error}</p>
        </div>
      )}
      <CardContent className='space-y-5 px-0 pb-0'>
        <form onSubmit={onProviderSignIn} className='flex flex-col space-y-2.5'>
          <Input 
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            type='email'
            required
          />
          <Input 
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            type='password'
            required
          />
          <Button type='submit' className='w-full' size="lg" disabled={pending}>
            Sign In
          </Button>
        </form>
        <Separator />
        <SocialLogin 
          pending={pending}
          setPending={setPending}
        />
        <p className='text-xs text-muted-foreground'>
          Don&apos;t have an account? <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState('signUp')}>Sign Up</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default SignInCard
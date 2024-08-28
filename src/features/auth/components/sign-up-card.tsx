import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { type SignInFlow } from '../types'
import { useState } from 'react'
import SocialLogin from './social-login'

interface Props {
  setState:(state:SignInFlow) => void
}

const SignUpCard = ({
  setState
}:Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  return (
    <Card className='w-full h-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Use your email or another service to create an account
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-5 px-0 pb-0'>
        <form action="" className='flex flex-col space-y-2.5'>
          <Input 
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            type='email'
            required
          />
          <Input 
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            type='password'
            required
          />
          <Input 
            disabled={false}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm Password'
            type='password'
            required
          />
          <Button type='submit' className='w-full' size="lg" disabled={false}>
            Sign Up
          </Button>
        </form>
        <Separator />
        <SocialLogin />
        <p className='text-xs text-muted-foreground'>
          Already have an account? <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState('signIn')}>Sign In</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default SignUpCard